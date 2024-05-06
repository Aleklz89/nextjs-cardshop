import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
    try {
      const id = new URL(request.url).searchParams.get('id');

      console.log('Received ID for deletion:', id);

      if (!id) {
        return new Response(JSON.stringify({ error: "ID parameter is required" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }


      const result = await sql`
        DELETE FROM "Request" WHERE id = ${id};
      `;

      console.log('Delete operation result:', result);


      if (result.rowCount === 0) {
        return new Response(JSON.stringify({ error: "No records found to delete" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }

  
      const response = new Response(JSON.stringify({ message: "Application deleted successfully" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      response.headers.set('Cache-Control', 'no-store, max-age=0');

      return response;
    } catch (error) {
      console.error('Database query failed:', error);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
