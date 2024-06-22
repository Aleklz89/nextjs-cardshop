import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export const revalidate = 1

export async function GET(request: NextRequest) {
  try {
    const maintenanceModeRecord = await prisma.maintenanceMode.findUnique({ where: { id: 1 } });
    const maintenanceMode = maintenanceModeRecord ? maintenanceModeRecord.enabled : false;
    return NextResponse.json({ maintenanceMode });
  } catch (error) {
    console.error('Error fetching maintenance mode:', error);
    return NextResponse.json({ error: 'Error fetching maintenance mode' }, { status: 500 });
  }
}
