import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId, balance } = await request.json();

    // Ensure the necessary data is present
    if (!userId || balance === undefined) {
      return NextResponse.json(
        { error: "Missing userId or balance" },
        { status: 400 }
      );
    }

    // Update the user's balance
    const user = await prisma.user.update({
      where: { id: userId },
      data: { balance: parseFloat(balance) },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error updating balance:", error);
    return NextResponse.json(
      { error: "Error updating balance" },
      { status: 500 }
    );
  }
}
