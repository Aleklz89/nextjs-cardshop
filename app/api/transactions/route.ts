import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import axios from 'axios';
import Decimal from 'decimal.js';

export async function POST(request: NextRequest) {
  try {
    const { userId, cardUuids } = await request.json();

    console.log('Received data:', { userId, cardUuids });

    if (!userId || !cardUuids || cardUuids.length === 0) {
      console.log('Missing parameters:', { userId, cardUuids });
      return NextResponse.json(
        { error: 'Missing userId or cardUuids' },
        { status: 400 }
      );
    }

    const baseUrl = 'https://api.epn.net/transaction';
    const headers = {
      'Accept': 'application/json',
      'Authorization': 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
      'X-CSRF-TOKEN': '',
      'Content-Type': 'application/json',
    };

    const fetchTransactionsForUuid = async (uuid) => {
      try {
        const response = await axios.post(baseUrl, {
          account_uuid: uuid,
        }, { headers });

        if (response.status !== 200) {
          throw new Error(`Error fetching transactions for uuid ${uuid}: ${response.statusText}`);
        }

        return response.data.data;
      } catch (error) {
        console.error(`Error fetching transactions for uuid ${uuid}:`, error);
        return [];
      }
    };

    const transactions = (await Promise.all(cardUuids.map(fetchTransactionsForUuid))).flat();
    console.log('Fetched transactions:', transactions);

    const holdsToCreate = [];
    const transactionIds = transactions
      .filter(transaction => transaction.type_enum === 'Authorization' && transaction.response_text === 'Approved')
      .map(transaction => transaction.id);

    const existingHolds = await prisma.hold.findMany({
      where: {
        transactionId: {
          in: transactionIds
        }
      }
    });

    const existingHoldIds = new Set(existingHolds.map(hold => hold.transactionId));

    for (const transaction of transactions) {
      if (transaction.type_enum === 'Authorization' && transaction.response_text === 'Approved' && !existingHoldIds.has(transaction.id)) {
        const reverseTime = new Date();
        reverseTime.setHours(reverseTime.getHours() + 168);

        holdsToCreate.push({
          transactionId: transaction.id,
          userId,
          reverseTime,
          amount: Math.abs(parseFloat(transaction.amount)),
          isTransferred: false
        });
      }
    }

    if (holdsToCreate.length > 0) {
      await prisma.hold.createMany({
        data: holdsToCreate
      });
      console.log(`Created ${holdsToCreate.length} holds`);
    } else {
      console.log('No new holds to create');
    }

    const holds = await prisma.hold.findMany({
      where: { userId, isTransferred: false },
    });
    console.log('Fetched holds:', holds);

    const currentTime = new Date();
    let holdBalance = 0;
    let totalTransferredAmount = new Decimal(0);

    const holdsToUpdate = [];

    for (const hold of holds) {
      const holdReverseTime = new Date(hold.reverseTime);
      if (currentTime >= holdReverseTime) {
        totalTransferredAmount = totalTransferredAmount.plus(hold.amount);
        holdsToUpdate.push(hold.id);
        console.log(`Hold ready for transfer for transaction ${hold.transactionId}:`, hold.amount);
      } else {
        holdBalance += hold.amount;
        const remainingTime = holdReverseTime.getTime() - currentTime.getTime();
        const remainingMinutes = Math.ceil(remainingTime / 60000); // Конвертация миллисекунд в минуты
        console.log(`Hold balance not yet transferred for transaction ${hold.transactionId}:`, hold.amount);
        console.log(`Hold will be transferred in ${remainingMinutes} minutes`);
      }
    }

    if (totalTransferredAmount.greaterThan(0)) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const updatedBalance = new Decimal(user.balance).plus(totalTransferredAmount).toFixed(2);

      await prisma.user.update({
        where: { id: userId },
        data: { balance: updatedBalance },
      });

      await prisma.hold.updateMany({
        where: { id: { in: holdsToUpdate } },
        data: { isTransferred: true },
      });

      console.log(`Updated balance for user ${userId} by ${totalTransferredAmount.toFixed(2)}`);
      console.log(`Marked ${holdsToUpdate.length} holds as transferred`);
    }

    console.log('Final hold balance:', holdBalance);
    return NextResponse.json({ holdBalance });
  } catch (error) {
    console.error('Error processing transactions:', error);
    return NextResponse.json(
      { error: 'Error processing transactions', details: error.message },
      { status: 500 }
    );
  }
}
