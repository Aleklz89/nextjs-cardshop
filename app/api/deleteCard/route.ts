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

    // Check if any card is already locked
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

    // Lock the cards
    await prisma.cardLock.updateMany({
      where: { cardUuid: { in: cardUuids } },
      data: { isLocked: true },
    });

    try {
      // Validate cards by fetching their details first
      const invalidCards = [];
      for (const cardUuid of cardUuids) {
        try {
          const response = await axios.get(`https://api.epn.net/card/${cardUuid}/showpan`, {
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
              'X-CSRF-TOKEN': '',
            },
          });
          if (response.status !== 200) {
            invalidCards.push(cardUuid);
          }
        } catch (error) {
          invalidCards.push(cardUuid);
        }
      }

      if (invalidCards.length > 0) {
        // Unlock the valid cards
        const validCardUuids = cardUuids.filter(cardUuid => !invalidCards.includes(cardUuid));
        await prisma.cardLock.updateMany({
          where: { cardUuid: { in: validCardUuids } },
          data: { isLocked: false },
        });

        return NextResponse.json(
          { error: "Some cards are invalid", invalidCards },
          { status: 422 }
        );
      }

      // Delete cards from EPN
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
        throw new Error(`Error: ${response.status}, ${response.data}`);
      }

      // Update user balance
      const updatedUser = await prisma.$transaction(async (transaction) => {
        const user = await transaction.user.findUnique({
          where: { id: userId },
          select: { balance: true },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const newBalance = new Decimal(user.balance).plus(totalBalance);

        return await transaction.user.update({
          where: { id: userId },
          data: { balance: newBalance },
        });
      });

      // Log the single transaction
      await prisma.transaction.create({
        data: {
          userId,
          type: 'card close',
          description: `Card close and balance transfer`,
          amount: totalBalance.toNumber(),
        },
      });

      // Unlock the cards
      await prisma.cardLock.updateMany({
        where: { cardUuid: { in: cardUuids } },
        data: { isLocked: false },
      });

      return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
      // Unlock the cards in case of error
      await prisma.cardLock.updateMany({
        where: { cardUuid: { in: cardUuids } },
        data: { isLocked: false },
      });

      console.error("Error during card deletion and balance update:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error during card deletion and balance update:", error);
    return NextResponse.json(
      { error: "Error during card deletion and balance update", details: error.message },
      { status: 500 }
    );
  }
}
