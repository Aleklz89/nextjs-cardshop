import { NextResponse } from 'next/server';
import prisma from "../../lib/prisma";
import axios from 'axios';
import Decimal from 'decimal.js';

export async function POST(request) {
  try {
    const { userId, cardUuid, balanceChange } = await request.json();

    if (!userId || !cardUuid || balanceChange === undefined) {
      return NextResponse.json(
        { error: "Missing userId, cardUuid, or balanceChange" },
        { status: 400 }
      );
    }

    const balanceChangeDecimal = new Decimal(balanceChange);

    // Check if the card is already locked
    const cardLock = await prisma.cardLock.findUnique({
      where: { cardUuid },
    });

    if (cardLock && cardLock.isLocked) {
      return NextResponse.json(
        { error: "Card is already being processed" },
        { status: 400 }
      );
    }

    // Lock the card
    await prisma.cardLock.upsert({
      where: { cardUuid },
      update: { isLocked: true },
      create: { cardUuid, isLocked: true },
    });

    try {
      // Delete card from EPN
      const response = await axios.delete('https://api.epn.net/card', {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': '',
        },
        data: { card_uuids: [cardUuid] },
      });

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
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

        const newBalance = new Decimal(user.balance).plus(balanceChangeDecimal);

        return await transaction.user.update({
          where: { id: userId },
          data: { balance: newBalance },
        });
      });

      // Log the transaction
      await prisma.transaction.create({
        data: {
          userId,
          type: 'card close',
          description: 'Card close and balance transfer',
          amount: balanceChangeDecimal.toNumber(),
        },
      });

      // Unlock the card
      await prisma.cardLock.update({
        where: { cardUuid },
        data: { isLocked: false },
      });

      return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
      // Unlock the card in case of error
      await prisma.cardLock.update({
        where: { cardUuid },
        data: { isLocked: false },
      });

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
