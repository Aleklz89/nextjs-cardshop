import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, account_uuid, start_balance, description, bin, cards_count, external_id, totalCost } = body;

  // Fetch current rate limit information for the user
  const rateLimit = await prisma.rateLimit.findUnique({
    where: { userId: userId },
  });

  const now = new Date();

  if (rateLimit && now < rateLimit.nextBuyRequest) {
    const retryAfter = Math.ceil((rateLimit.nextBuyRequest.getTime() - now.getTime()) / 1000);
    return new Response(JSON.stringify({ message: `Повторіть спробу через ${retryAfter} секунд` }), { status: 429 });
  }

  try {
    // Update user's balance first
    const minResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/min', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, balanceChange: -parseFloat(totalCost) }),
    });

    if (!minResponse.ok) {
      throw new Error(`Error: ${minResponse.status}`);
    }

    // Process the buy request
    const response = await fetch("https://api.epn.net/card/buy", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ",
        "X-CSRF-TOKEN": "",
      },
      body: JSON.stringify({
        account_uuid,
        start_balance,
        description,
        bin,
        cards_count,
        external_id,
      }),
    });

    if (!response.ok) {
      // Revert balance update if error occurs during card issuance
      await fetch(process.env.NEXT_PUBLIC_ROOT_URL + '/api/min', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, balanceChange: parseFloat(totalCost) }),
      });

      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    // Update user with new card
    const updateUserResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, cardUuid: external_id }),
    });

    if (!updateUserResponse.ok) {
      throw new Error(`Error updating user: ${updateUserResponse.status}`);
    }

    // Log transaction
    const transactionResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/newtrans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        type: "replenishment",
        description: "Card replenishment",
        amount: -parseFloat(totalCost),
      }),
    });

    if (!transactionResponse.ok) {
      throw new Error(`Error logging transaction: ${transactionResponse.status}`);
    }

    // Log card transaction
    const cardTransactionResponse = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/cardtrans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardId: external_id,
        amount: parseFloat(start_balance),
      }),
    });

    if (!cardTransactionResponse.ok) {
      throw new Error(`Error logging card transaction: ${cardTransactionResponse.status}`);
    }

    // Set the next allowed buy request time to 20 seconds in the future
    const nextBuyRequest = new Date(now.getTime() + 180 * 1000);

    if (rateLimit) {
      await prisma.rateLimit.update({
        where: { userId: userId },
        data: { nextBuyRequest: nextBuyRequest },
      });
    } else {
      await prisma.rateLimit.create({
        data: {
          userId: userId,
          nextBuyRequest: nextBuyRequest,
          nextDeleteRequest: now, // Initialize with current time or some other logic
        },
      });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error issuing card:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
  }
}
