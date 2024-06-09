import prisma from "../../lib/prisma";
import Decimal from "decimal.js";

export async function POST(request: Request) {
  try {
    const { id, balance } = await request.json();


    const newBalance = new Decimal(balance);

    const user = await prisma.user.update({
      where: { id },
      data: { balance: newBalance },
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error updating user balance:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update user balance" }),
      { status: 500 }
    );
  }
}
