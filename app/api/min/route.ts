import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import Decimal from "decimal.js";

export async function POST(request: NextRequest) {
  try {
    const { userId, balanceChange } = await request.json();

    if (!userId || balanceChange === undefined) {
      return NextResponse.json(
        { error: "Missing userId or balanceChange" },
        { status: 400 }
      );
    }

    const balanceChangeDecimal = new Decimal(balanceChange);

    const updatedUser = await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const newBalance = new Decimal(user.balance).plus(balanceChangeDecimal);

      if (newBalance.lt(0)) {
        throw new Error("Insufficient balance");
      }

      return await transaction.user.update({
        where: { id: userId },
        data: { balance: newBalance.toFixed(2) },
      });
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating balance:", error);
    return NextResponse.json(
      { error: "Error updating balance" },
      { status: 500 }
    );
  }
}
