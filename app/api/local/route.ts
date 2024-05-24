import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';


export async function GET() {
  try {
    const secondValue = await prisma.singleValue.findUnique({
      where: { id: 2 },
    });

    if (!secondValue) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ value: secondValue.value });
  } catch (error) {
    console.error('Error fetching second value:', error);
    return NextResponse.json({ error: 'Error fetching second value' }, { status: 500 });
  }
}


export async function PATCH(request: NextRequest) {
  try {
    const { value } = await request.json();

    if (typeof value !== 'number') {
      return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
    }

    const updatedValue = await prisma.singleValue.update({
      where: { id: 2 },
      data: { value },
    });

    return NextResponse.json({ value: updatedValue.value });
  } catch (error) {
    console.error('Error updating second value:', error);
    return NextResponse.json({ error: 'Error updating second value' }, { status: 500 });
  }
}
