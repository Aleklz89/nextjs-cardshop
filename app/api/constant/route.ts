// app/api/single-value/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
export const revalidate = 1

const prisma = new PrismaClient();


export async function GET(request: Request) {
  try {
    const valueRecord = await prisma.singleValue.findFirst();
    const value = valueRecord ? valueRecord.value : null;
    return NextResponse.json({ value });
  } catch (error) {
    console.error('Database query failed:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const { value } = await request.json();
    const updatedValue = await prisma.singleValue.upsert({
      where: { id: 1 },
      update: { value },
      create: { value },
    });
    return new NextResponse(JSON.stringify({ value: updatedValue.value }), { status: 200 });
  } catch (error) {
    console.error('Database query failed:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
