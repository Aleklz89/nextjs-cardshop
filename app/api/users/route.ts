import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teamName = searchParams.get('team');
  const status = searchParams.get('status');

  if (!teamName || !status) {
    return new NextResponse(JSON.stringify({ message: "Missing team or status parameter" }), { status: 400 });
  }

  try {
    const statuses = ["buyer", "team lead", "head", "owner"];
    const statusIndex = statuses.indexOf(status.toLowerCase());

    if (statusIndex === -1) {
      return new NextResponse(JSON.stringify({ message: "Invalid status parameter" }), { status: 400 });
    }

    const filteredStatuses = statuses.slice(0, statusIndex);

    const team = await prisma.team.findUnique({
      where: { name: teamName },
    });

    if (!team) {
      return new NextResponse(JSON.stringify({ message: "Team not found" }), { status: 404 });
    }

    const users = await prisma.user.findMany({
      where: {
        teamId: team.id,
        status: {
          in: filteredStatuses,
        },
      },
    });

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
