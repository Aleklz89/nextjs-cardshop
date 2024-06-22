import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import validatePassword from '../../helpers/validatePassword';

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json();

    if (!validatePassword(password)) {
      return NextResponse.json({ error: 'Invalid password format' }, { status: 400 });
    }

    const hash = bcrypt.hashSync(password, 8);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hash },
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
