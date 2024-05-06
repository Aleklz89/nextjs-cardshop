import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany();
    console.log('Fetched users:', users);

    const response = NextResponse.json({ users }, { status: 200 });
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
