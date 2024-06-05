import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: "Missing transactionId" },
        { status: 400 }
      );
    }

    const hold = await prisma.hold.findUnique({
      where: { transactionId },
    });

    return NextResponse.json({ holdExists: !!hold });
  } catch (error) {
    console.error("Error checking hold:", error);
    return NextResponse.json(
      { error: "Error checking hold" },
      { status: 500 }
    );
  }
}
