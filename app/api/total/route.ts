import { NextResponse } from 'next/server';
export const revalidate = 1;

export async function GET(request: Request) {
  try {
    const response = await fetch('https://api.epn.net/account', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
        'X-CSRF-TOKEN': ''
      }
    });

    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({ error: `Error: ${response.statusText}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const responseData = new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=0' }
    });

    return responseData;
  } catch (error) {
    console.error('Fetch error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
