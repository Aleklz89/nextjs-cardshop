import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  const { userId, newBalance, currentUserId } = await request.json();

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });

    const balanceDifference = parseFloat(newBalance) - user.balance.toNumber();
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: parseFloat(newBalance) },
    });

    const updatedCurrentUser = await prisma.user.update({
      where: { id: currentUserId },
      data: { balance: currentUser.balance.toNumber() - balanceDifference },
    });

    return new Response(JSON.stringify({ updatedUser, updatedCurrentUser }), { status: 200 });
  } catch (error) {
    console.error('Error updating user balance:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
