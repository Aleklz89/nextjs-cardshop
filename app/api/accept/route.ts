import prisma from "../../lib/prisma";


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, telegram } = body;

        const newUser = await prisma.user.create({
            data: {
                email,
                password,
                telegram
            },
        });

        return new Response(JSON.stringify({ message: "User created successfully", user: newUser }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return new Response(JSON.stringify({ error: error.message || "An unexpected error occurred" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}