import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, account_uuid, start_balance, description, bin, cards_count, external_id } = body;

    // Fetch current rate limit information for the user
    const rateLimit = await prisma.rateLimit.findUnique({
      where: { userId: userId },
    });

    const now = new Date();

    if (rateLimit && now < rateLimit.nextBuyRequest) {
      const retryAfter = Math.ceil((rateLimit.nextBuyRequest.getTime() - now.getTime()) / 1000);
      return new Response(JSON.stringify({ message: `Повторіть спробу через ${retryAfter} секунд` }), { status: 429 });
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
      const errorData = await response.json();
      return new Response(JSON.stringify(errorData), { status: response.status });
    }

    const data = await response.json();

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
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
