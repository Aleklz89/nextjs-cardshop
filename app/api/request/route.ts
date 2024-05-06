import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export const revalidate = 1

export async function GET(request: Request) {
  try {
    const applications = await prisma.request.findMany();
    console.log('Fetched applications:', applications);

    const response = NextResponse.json({ applications }, { status: 200 });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
