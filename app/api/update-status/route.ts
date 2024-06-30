import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return new Response(JSON.stringify({ message: 'Invalid input' }), { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { status: status },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error('Error updating user status:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
