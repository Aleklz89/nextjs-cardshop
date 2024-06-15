import { NextResponse } from 'next/server';
import axios from 'axios';
import prisma from '../../lib/prisma';
import Decimal from 'decimal.js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, toAccountUuids, amountPerCard } = body;

    if (!userId || !toAccountUuids || !amountPerCard) {
      return NextResponse.json(
        { error: "userId, toAccountUuids, and amountPerCard are required" },
        { status: 400 }
      );
    }

    const totalAmount = new Decimal(amountPerCard).times(toAccountUuids.length);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (new Decimal(user.balance).lt(totalAmount)) {
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 }
      );
    }

    // Proceed with the transfer
    const response = await axios.post(
      'https://api.epn.net/transfer/transfer',
      {
        from_account_uuid: "dd89adb8-3710-4f25-aefd-d7116eb66b6b",
        to_account_uuids: toAccountUuids,
        amount: amountPerCard,
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

    // Update user balance
    const newBalance = new Decimal(user.balance).minus(totalAmount);
    await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance.toFixed(2) },
    });

    // Log the transaction
    await prisma.transaction.create({
      data: {
        userId,
        type: 'bulk replenishment',
        description: 'Bulk replenish of cards',
        amount: totalAmount.negated().toNumber(),
      },
    });

    return NextResponse.json(
      { message: 'Transfer successful', data: response.data },
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
