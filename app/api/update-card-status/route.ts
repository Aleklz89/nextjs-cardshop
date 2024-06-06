import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { cardUuid, isLocked } = await request.json();

    if (!cardUuid || isLocked === undefined) {
      return NextResponse.json(
        { error: "Missing cardUuid or isLocked" },
        { status: 400 }
      );
    }

    const cardLock = await prisma.cardLock.upsert({
      where: { cardUuid },
      update: { isLocked },
      create: { cardUuid, isLocked },
    });

    return NextResponse.json({ success: true, cardLock });
  } catch (error) {
    console.error("Error updating card status:", error);
    return NextResponse.json(
      { error: "Error updating card status" },
      { status: 500 }
    );
  }
}
