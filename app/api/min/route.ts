import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import Decimal from "decimal.js";

export async function POST(request: NextRequest) {
  try {
    const { userId, balanceChange } = await request.json();

    // Ensure the necessary data is present
    if (!userId || balanceChange === undefined) {
      return NextResponse.json(
        { error: "Missing userId or balanceChange" },
        { status: 400 }
      );
    }

    const balanceChangeDecimal = new Decimal(balanceChange);

    const result = await prisma.$transaction(async (prisma) => {
      // Fetch the current balance
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true }
      });

      if (!user) {
        throw new Error("User not found");
      }

      const updatedBalance = user.balance.plus(balanceChangeDecimal);

      // Update the user's balance
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { balance: updatedBalance }
      });

      return updatedUser;
    });

    return NextResponse.json({ success: true, user: result });
  } catch (error) {
    console.error("Error updating balance:", error);
    return NextResponse.json(
      { error: "Error updating balance" },
      { status: 500 }
    );
  }
}
