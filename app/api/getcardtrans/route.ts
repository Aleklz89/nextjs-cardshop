import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { cardId } = await request.json();

    // Проверка наличия cardId
    if (!cardId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing cardId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Получение транзакций по cardId
    const transactions = await prisma.cardTransaction.findMany({
      where: {
        cardId,
      },
    });

    return new NextResponse(
      JSON.stringify({ success: true, transactions }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
