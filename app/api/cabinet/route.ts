import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export const revalidate = 1

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    console.log('Received User ID:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id, 10)
      }
    });
    console.log('User fetch result:', user);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      { user },
      { status: 200 }
    );
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
