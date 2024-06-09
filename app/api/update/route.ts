import prisma from "../../lib/prisma";
import Decimal from "decimal.js";

export async function POST(request: Request) {
  try {
    const { id, balanceChange } = await request.json();

    if (!id || balanceChange === undefined) {
      return new Response(
        JSON.stringify({ error: "id and balanceChange are required" }),
        { status: 400 }
      );
    }

    const balanceChangeDecimal = new Decimal(balanceChange);

    const updatedUser = await prisma.$transaction(async (prisma) => {
      // Lock the user row for update to prevent race conditions
      const users = await prisma.$queryRaw<
        Array<{ id: number, balance: string }>
      >`SELECT * FROM "User" WHERE id = ${id} FOR UPDATE`;

      if (!users || users.length === 0) {
        throw new Error("User not found");
      }

      const user = users[0];
      const newBalance = new Decimal(user.balance).plus(balanceChangeDecimal);

      // Update the user's balance
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { balance: newBalance.toFixed(2) },
      });

      // Create a transaction record
      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: 'transfer',
          description: 'Transfer from card',
          amount: balanceChangeDecimal.toNumber(),
        },
      });

      return updatedUser;
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating user balance:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update user balance" }),
      { status: 500 }
    );
  }
}
