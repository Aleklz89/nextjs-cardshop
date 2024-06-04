import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, cardId } = await request.json();
    console.log(userId);
    console.log(cardId);

    if (!userId || !cardId) {
      return NextResponse.json({ error: 'Missing userId or cardId' }, { status: 400 });
    }


    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cardsIds: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }


    const updatedCardsIds = user.cardsIds.filter((id) => id !== cardId);


    await prisma.user.update({
      where: { id: userId },
      data: { cardsIds: updatedCardsIds },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing card:', error);
    return NextResponse.json({ error: 'Error removing card' }, { status: 500 });
  }
}
