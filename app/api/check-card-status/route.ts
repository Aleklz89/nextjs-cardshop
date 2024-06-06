import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { cardUuid } = await request.json();

    if (!cardUuid) {
      return NextResponse.json(
        { error: "Missing cardUuid" },
        { status: 400 }
      );
    }

    const cardLock = await prisma.cardLock.findUnique({
      where: { cardUuid },
      select: { isLocked: true },
    });

    // If cardLock is not found, we assume the card has not been locked/deleted
    if (!cardLock) {
      return NextResponse.json({ isLocked: false });
    }

    return NextResponse.json({ isLocked: cardLock.isLocked });
  } catch (error) {
    console.error("Error checking card status:", error);
    return NextResponse.json(
      { error: "Error checking card status" },
      { status: 500 }
    );
  }
}
