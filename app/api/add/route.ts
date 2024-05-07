import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId, id: binId } = await request.json();

    // Ensure the necessary data is present
    if (!userId || !binId) {
      return NextResponse.json(
        { error: "Missing userId or binId" },
        { status: 400 }
      );
    }

    // Update the cardsIds array in the User model
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        cardsIds: {
          push: binId,
        },
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error updating cardsIds:", error);
    return NextResponse.json(
      { error: "Error updating cardsIds" },
      { status: 500 }
    );
  }
}