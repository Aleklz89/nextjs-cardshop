import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { status, teamId } = await request.json();

    console.log(status);
    console.log(teamId);

    if (!status || !teamId) {
      return NextResponse.json({ error: 'Missing status or teamId' }, { status: 400 });
    }

    const language = 'uk';
    const inviteId = uuidv4();
    const inviteUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/${language}?invite=${inviteId}`;

    const invite = await prisma.invite.create({
      data: {
        id: inviteId,
        status,
        teamId,
        inviteUrl,
      },
    });

    return NextResponse.json({ inviteUrl: invite.inviteUrl });
  } catch (error) {
    console.error('Error generating invite link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
