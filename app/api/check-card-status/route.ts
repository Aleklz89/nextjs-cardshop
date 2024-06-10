import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import axios from 'axios';
import Decimal from "decimal.js";

export async function POST(request: NextRequest) {
  try {
    const { cardUuid, userId, cardBalance } = await request.json();

    if (!cardUuid || !userId || cardBalance === undefined) {
      return NextResponse.json(
        { error: "Missing cardUuid, userId, or cardBalance" },
        { status: 400 }
      );
    }

    // Check card status
    const cardLock = await prisma.cardLock.findUnique({
      where: { cardUuid },
      select: { isLocked: true },
    });

    if (cardLock && cardLock.isLocked) {
      return NextResponse.json(
        { error: "Card has already been deleted or locked" },
        { status: 400 }
      );
    }

    // Lock the card
    await prisma.cardLock.upsert({
      where: { cardUuid },
      update: { isLocked: true },
      create: { cardUuid, isLocked: true },
    });

    // Delete the card from external API
    const deleteResponse = await axios.delete('https://api.epn.net/card', {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': '',
      },
      data: {
        card_uuids: [cardUuid],
      },
    });

    if (!deleteResponse.data) {
      throw new Error('Failed to delete the card from external API');
    }

    const cardBalanceDecimal = new Decimal(cardBalance);

    // Update user balance and create a transaction
    const updatedUser = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const updatedBalance = new Decimal(user.balance).plus(cardBalanceDecimal).toFixed(2);

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { balance: updatedBalance },
      });

      // Create a transaction record
      await prisma.transaction.create({
        data: {
          userId,
          type: 'card close',
          description: 'Card close and balance transfer',
          amount: cardBalanceDecimal.toNumber(),
        },
      });

      return updatedUser;
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error during card deletion process:", error);
    return NextResponse.json(
      { error: "Error during card deletion process", details: error.message },
      { status: 500 }
    );
  }
}
