import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, amount } = body;


    if (!cardId || typeof amount !== 'number') {
      return new NextResponse(
        JSON.stringify({ error: 'Missing or invalid cardId or amount' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }


    let type: string;
    let description: string;
    if (amount < 0) {
      type = 'withdraw';
      description = 'Withdrawal to an external service';
    } else {
      type = 'replenishment';
      description = 'Card purchase';
    }


    const newTransaction = await prisma.cardTransaction.create({
      data: {
        cardId,
        type,
        description,
        amount,
      },
    });

    return new NextResponse(
      JSON.stringify({ success: true, transaction: newTransaction }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating card transaction:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
