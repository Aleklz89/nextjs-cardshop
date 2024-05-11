import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, type, description, amount } = await request.json();

    if (!userId || !type || !description || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }


    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        description,
        amount
      }
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 });
  }
}
