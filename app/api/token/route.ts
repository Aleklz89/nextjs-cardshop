import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { cookies } from 'next/headers';

export const revalidate = 1

export async function GET(request: NextRequest) {
  try {

    const cookie = cookies().get('Authorization');

    if (!cookie) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }


    const jwt = cookie.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);


    const { payload } = await jose.jwtVerify(jwt, secret);

 
    const userId = payload.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { userId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
