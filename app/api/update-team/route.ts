import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { newTeamName, currentTeamName, currentUserId } = await request.json();

    if (!newTeamName || !currentUserId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!user || user.status.toLowerCase() !== 'owner') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const existingTeam = await prisma.team.findUnique({
      where: { name: newTeamName },
    });

    if (existingTeam) {
      return NextResponse.json({ error: 'Team name already exists' }, { status: 400 });
    }

    let updatedTeam;

    if (currentTeamName) {
      const currentTeam = await prisma.team.findUnique({
        where: { name: currentTeamName },
      });

      if (!currentTeam) {
        return NextResponse.json({ error: 'Current team not found' }, { status: 404 });
      }

      updatedTeam = await prisma.team.update({
        where: { id: currentTeam.id },
        data: { name: newTeamName },
      });
    } else {
      updatedTeam = await prisma.team.create({
        data: { name: newTeamName },
      });

      await prisma.user.update({
        where: { id: currentUserId },
        data: { teamId: updatedTeam.id },
      });
    }

    await prisma.user.updateMany({
      where: { teamId: updatedTeam.id },
      data: { teamId: updatedTeam.id },
    });

    return NextResponse.json({ message: 'Team name updated successfully' });
  } catch (error) {
    console.error('Error updating team name:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
