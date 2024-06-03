import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fromAccountUuid, amount } = body;

        if (!fromAccountUuid || !amount) {
            return NextResponse.json(
                { error: "fromAccountUuid and amount are required" },
                { status: 400 }
            );
        }

        const response = await axios.post(
            'https://api.epn.net/transfer/transfer',
            {
                from_account_uuid: fromAccountUuid,
                to_account_uuid: "dd89adb8-3710-4f25-aefd-d7116eb66b6b",
                amount: amount,
            },
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Bearer 456134|96XNShj53SQXMMBY3xYsNGjvEHbU8TKCDbDqGGLJ',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': ''
                }
            }
        );

        return NextResponse.json(
            { message: 'Transfer successful', data: response.data },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during transfer:', error);
        return NextResponse.json(
            { error: 'Transfer failed', details: error.message },
            { status: 500 }
        );
    }
}
