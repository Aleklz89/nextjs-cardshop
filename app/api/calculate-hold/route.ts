import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import Decimal from "decimal.js";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const holds = await prisma.hold.findMany({
      where: { userId },
    });

    let holdAmount = new Decimal(0);
    const now = new Date();

    for (const hold of holds) {
      const holdAmountDecimal = new Decimal(hold.amount);
      if (new Date(hold.reverseTime) > now) {
        holdAmount = holdAmount.plus(holdAmountDecimal);
      } else {
        // Reverse transaction logic
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        const newBalance = new Decimal(user.balance).plus(holdAmountDecimal);

        await prisma.user.update({
          where: { id: userId },
          data: { balance: newBalance },
        });

        await prisma.hold.delete({
          where: { id: hold.id },
        });
      }
    }

    return NextResponse.json({ holdAmount: holdAmount.toNumber() });
  } catch (error) {
    console.error("Error calculating hold amount:", error);
    return NextResponse.json(
      { error: "Error calculating hold amount" },
      { status: 500 }
    );
  }
}
