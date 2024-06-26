
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }


  try {

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: parseInt(userId),
      },
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

