import { PrismaClient } from '@prisma/client';
import Decimal from "decimal.js";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, balance, status, currentUserId } = await request.json();

    if (!userId || !currentUserId) {
      throw new Error("User ID and current user ID are required");
    }

    // Получаем текущего пользователя
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    // Проверяем разницу баланса
    const userToUpdate = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser || !userToUpdate) {
      throw new Error("User not found");
    }

    const balanceDifference = new Decimal(balance).minus(userToUpdate.balance);

    if (currentUser.balance.minus(balanceDifference).lt(0)) {
      throw new Error("Insufficient balance in the current user's account");
    }

    if (balanceDifference.gt(currentUser.balance)) {
      throw new Error("Cannot add more balance than available in the current user's account");
    }

    // Обновляем баланс текущего пользователя
    await prisma.user.update({
      where: { id: currentUserId },
      data: {
        balance: currentUser.balance.minus(balanceDifference),
      },
    });

    // Обновляем пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: new Decimal(balance),
        status,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
