import { NextResponse } from 'next/server';
import axios from 'axios';
import prisma from '../../lib/prisma';
import Decimal from 'decimal.js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromAccountUuid, userId, amount } = body;

    if (!fromAccountUuid || !amount || !userId) {
      return NextResponse.json(
        { error: "fromAccountUuid, userId, and amount are required" },
        { status: 400 }
      );
    }

    const amountDecimal = new Decimal(amount);

    // Perform the transfer and update the balance atomically
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.$queryRawUnsafe<{ id: number, balance: string }[]>(`
        SELECT * FROM "User" WHERE id = $1 FOR UPDATE
      `, userId);

      if (!user || user.length === 0) {
        throw new Error("User not found");
      }

      const currentUser = user[0];
      const updatedBalance = new Decimal(currentUser.balance).plus(amountDecimal);

      // Perform the transfer first
      const transferResponse = await axios.post(
        'https://api.epn.net/transfer/transfer',
        {
          from_account_uuid: fromAccountUuid,
          to_account_uuid: "dd89adb8-3710-4f25-aefd-d7116eb66b6b",
          amount: amount,
        },
        {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': ''
          }
        }
      );

      if (!transferResponse.data) {
        throw new Error('Transfer failed');
      }

      // Update the user's balance
      await prisma.user.update({
        where: { id: userId },
        data: { balance: updatedBalance.toFixed(2) },
      });

      // Create a transaction record
      await prisma.transaction.create({
        data: {
          userId,
          type: 'transfer',
          description: 'Transfer from card',
          amount: amountDecimal.toNumber(),
        }
      });

      return updatedBalance;
    });

    return NextResponse.json(
      { message: 'Transfer successful', newBalance: result.toFixed(2) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during transfer:', error);
    return NextResponse.json(
      { error: 'Transfer failed', details: error.message },
      { status: 500 }
    );
  }
}
