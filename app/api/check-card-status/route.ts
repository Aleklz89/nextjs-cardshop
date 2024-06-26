import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { cardUuid, userId, cardBalance } = await request.json();

    console.log("Received data:", { cardUuid, userId, cardBalance });

    if (!cardUuid || !userId || cardBalance === undefined) {
      console.log("Missing parameters:", { cardUuid, userId, cardBalance });
      return NextResponse.json(
        { error: "Missing cardUuid, userId, or cardBalance" },
        { status: 400 }
      );
    }

    const now = new Date();
    const rateLimit = await prisma.rateLimit.findUnique({
      where: { userId: userId },
    });

    if (rateLimit && now < rateLimit.nextDeleteRequest) {
      const retryAfter = Math.ceil((rateLimit.nextDeleteRequest.getTime() - now.getTime()) / 1000);
      return NextResponse.json({ message: `Повторіть спробу через ${retryAfter} секунд` }, { status: 429 });
    }

    // Check card status
    const cardLock = await prisma.cardLock.findUnique({
      where: { cardUuid },
      select: { isLocked: true },
    });

    if (cardLock && cardLock.isLocked) {
      console.log("Card is already locked:", cardUuid);

      // Attempt to delete the card from external API even if it's already locked
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
        console.log("Failed to delete the card from external API");
        throw new Error('Failed to delete the card from external API');
      }

      console.log("Card deleted from external API:", cardUuid);

      return NextResponse.json(
        { error: "Card has already been deleted or locked" },
        { status: 400 }
      );
    }

    console.log("Locking card:", cardUuid);

    // Lock the card
    await prisma.cardLock.upsert({
      where: { cardUuid },
      update: { isLocked: true },
      create: { cardUuid, isLocked: true },
    });

    console.log("Deleting card from external API:", cardUuid);

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
      console.log("Failed to delete the card from external API");
      throw new Error('Failed to delete the card from external API');
    }

    console.log("Card deleted from external API:", cardUuid);

    const cardBalanceDecimal = new Decimal(cardBalance);

    // Update user balance and create a transaction
    const updatedUser = await prisma.$transaction(async (prisma) => {
      console.log("Fetching user:", userId);
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        console.log("User not found:", userId);
        throw new Error("User not found");
      }

      const updatedBalance = new Decimal(user.balance).plus(cardBalanceDecimal).toFixed(2);

      console.log("Updating user balance:", { userId, updatedBalance });

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { balance: updatedBalance },
      });

      console.log("Creating transaction:", { userId, amount: cardBalanceDecimal.toNumber() });

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

    console.log("Card deletion process completed successfully");

    const nextDeleteRequest = new Date(now.getTime() + 60 * 1000);

    if (rateLimit) {
      await prisma.rateLimit.update({
        where: { userId: userId },
        data: { nextDeleteRequest: nextDeleteRequest },
      });
    } else {
      await prisma.rateLimit.create({
        data: {
          userId: userId,
          nextBuyRequest: now, // Initialize with current time or some other logic
          nextDeleteRequest: nextDeleteRequest,
        },
      });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error during card deletion process:", error);
    return NextResponse.json(
      { error: "Error during card deletion process", details: error.message },
      { status: 500 }
    );
  }
}
