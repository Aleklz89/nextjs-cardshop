import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export const revalidate = 1

export async function GET(request: Request) {
    try {
      
      const applications = await sql`
        SELECT  * FROM "Request";
      `;



      const response = new Response(JSON.stringify(applications), { status: 200, headers: { 'Content-Type': 'application/json' } });

      response.headers.set('Cache-Control', 'no-store, max-age=0');

      return response;
    } catch (error) {
      console.error('Database query failed:', error); 
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
