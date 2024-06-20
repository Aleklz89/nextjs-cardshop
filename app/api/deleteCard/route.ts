import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../lib/prisma";
import axios from 'axios';
import Decimal from 'decimal.js';

export async function POST(request: NextRequest) {
  try {
    const { userId, cardUuidsWithBalances } = await request.json();

    if (!userId || !cardUuidsWithBalances || cardUuidsWithBalances.length === 0) {
      return NextResponse.json(
        { error: "Missing userId or cardUuidsWithBalances" },
        { status: 400 }
      );
    }

    const cardUuids = cardUuidsWithBalances.map(item => item.cardUuid);
    const totalBalance = cardUuidsWithBalances.reduce((acc, item) => acc.plus(item.balance), new Decimal(0));

    // Проверка на наличие заблокированных карт
    const cardLocks = await prisma.cardLock.findMany({
      where: { cardUuid: { in: cardUuids } },
    });

    const lockedCards = cardLocks.filter(lock => lock.isLocked);
    if (lockedCards.length > 0) {
      return NextResponse.json(
        { error: "Some cards are already being processed" },
        { status: 400 }
      );
    }

    // Блокировка карт
    await prisma.cardLock.updateMany({
      where: { cardUuid: { in: cardUuids } },
      data: { isLocked: true },
    });

    try {
      // Начало транзакции
      const updatedUser = await prisma.$transaction(async (transaction) => {
        // Валидация карт путем получения их деталей
        const invalidCards = await Promise.all(cardUuids.map(async (cardUuid) => {
          try {
            const response = await axios.get(`https://api.epn.net/card/${cardUuid}/showpan`, {
              headers: {
                accept: 'application/json',
                Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
                'X-CSRF-TOKEN': '',
              },
            });
            return response.status !== 200 ? cardUuid : null;
          } catch {
            return cardUuid;
          }
        })).then(results => results.filter(Boolean));

        if (invalidCards.length > 0) {
          // Разблокировка валидных карт
          const validCardUuids = cardUuids.filter(cardUuid => !invalidCards.includes(cardUuid));
          await prisma.cardLock.updateMany({
            where: { cardUuid: { in: validCardUuids } },
            data: { isLocked: false },
          });

          throw new Error(`Некоторые карты недействительны: ${invalidCards.join(', ')}`);
        }

        // Обновление баланса пользователя
        const user = await transaction.user.findUnique({
          where: { id: userId },
          select: { balance: true },
        });

        if (!user) {
          throw new Error("Пользователь не найден");
        }

        const newBalance = new Decimal(user.balance).plus(totalBalance);
        const updatedUser = await transaction.user.update({
          where: { id: userId },
          data: { balance: newBalance },
        });

        // Запись одной транзакции
        await transaction.transaction.create({
          data: {
            userId,
            type: 'card close',
            description: `Closing the card and transferring balance`,
            amount: totalBalance.toNumber(),
          },
        });

        return updatedUser;
      });

      // Удаление карт из EPN вне транзакции
      const response = await axios.delete('https://api.epn.net/card', {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': '',
        },
        data: { card_uuids: cardUuids },
      });

      if (response.status !== 200) {
        throw new Error(`Ошибка: ${response.status}, ${response.data}`);
      }

      // Разблокировка карт
      await prisma.cardLock.updateMany({
        where: { cardUuid: { in: cardUuids } },
        data: { isLocked: false },
      });

      return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
      // Разблокировка карт в случае ошибки
      await prisma.cardLock.updateMany({
        where: { cardUuid: { in: cardUuids } },
        data: { isLocked: false },
      });

      console.error("Ошибка во время удаления карт и обновления баланса:", error);
      return NextResponse.json(
        { error: "Ошибка во время удаления карт и обновления баланса", details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Ошибка во время удаления карт и обновления баланса:", error);
    return NextResponse.json(
      { error: "Ошибка во время удаления карт и обновления баланса", details: error.message },
      { status: 500 }
    );
  }
}
