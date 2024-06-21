import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { enable } = await request.json();
    console.log('Received request for toggling maintenance mode:', enable);

    // Обновление состояния в базе данных
    const maintenanceMode = await prisma.maintenanceMode.upsert({
      where: { id: 1 },
      update: { enabled: enable },
      create: { id: 1, enabled: enable },
    });

    console.log('Updated maintenance mode:', maintenanceMode);

    return NextResponse.json({ message: 'Maintenance mode toggled', enable });
  } catch (error) {
    console.error('Error toggling maintenance mode:', error);
    return NextResponse.json({ error: 'Error toggling maintenance mode' }, { status: 500 });
  }
}
