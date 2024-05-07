import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId, cardUuid } = await request.json();

    // Ensure the necessary data is present
    if (!userId || !cardUuid) {
      return NextResponse.json(
        { error: "Missing userId or cardUuid" },
        { status: 400 }
      );
    }

    // Update the cardsIds array in the User model
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        cardsIds: {
          push: cardUuid,
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
