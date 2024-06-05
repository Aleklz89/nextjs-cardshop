import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { holds } = await request.json();

    if (!holds || !Array.isArray(holds)) {
      return NextResponse.json(
        { error: "Invalid holds data" },
        { status: 400 }
      );
    }

    const addedHolds = await prisma.hold.createMany({
      data: holds,
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, addedHolds });
  } catch (error) {
    console.error("Error adding holds:", error);
    return NextResponse.json(
      { error: "Error adding holds" },
      { status: 500 }
    );
  }
}
