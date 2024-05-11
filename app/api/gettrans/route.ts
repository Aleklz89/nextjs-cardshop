// File: /app/api/transactions/route.js
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET(request) {
  try {
    // Fetch all transactions with user data from the database
    const transactions = await prisma.transaction.findMany({
      include: {
        user: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
  }
}
