// app/api/team-logo/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get('team');

  if (!team) {
    return NextResponse.json({ error: 'Missing team parameter' }, { status: 400 });
  }

  try {
    const teamData = await prisma.team.findUnique({
      where: { name: team },
      select: { logoUrl: true },
    });

    if (!teamData) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ logoUrl: teamData.logoUrl }, { status: 200 });
  } catch (error) {
    console.error('Error fetching team logo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
