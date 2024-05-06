import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    console.log('Received ID for deletion:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }

    const deletedRequest = await prisma.request.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
    console.log('Delete operation result:', deletedRequest);

    if (!deletedRequest) {
      return NextResponse.json(
        { error: 'No records found to delete' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      { message: 'Request deleted successfully' },
      { status: 200 }
    );
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
