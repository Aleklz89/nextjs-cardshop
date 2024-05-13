import validateEmail from "../../helpers/validateEmail";
import validatePassword from "../../helpers/validatePassword";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, telegram } = body;

        // Validation for email
        if (!validateEmail(email)) {
            return new Response(
                JSON.stringify({ error: "Invalid email format" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Validation for password
        if (!validatePassword(password)) {
            return new Response(
                JSON.stringify({ error: "Invalid password format" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Validation for telegram
        if (!telegram || telegram.trim() === "") {
            return new Response(
                JSON.stringify({ error: "Telegram username is required" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if the email is already in use
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUserByEmail) {
            return new Response(
                JSON.stringify({ error: "Email is already in use" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if the telegram username is already in use
        const existingUserByTelegram = await prisma.user.findUnique({
            where: { telegram },
        });

        if (existingUserByTelegram) {
            return new Response(
                JSON.stringify({ error: "Telegram username is already in use" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Проверка, что email уже не использован в запросах регистрации
        const existingRequestByEmail = await prisma.request.findUnique({
            where: { email },
        });

        if (existingRequestByEmail) {
            return new Response(
                JSON.stringify({ error: "Email is already in use" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Проверка, что telegram уже не использован в запросах регистрации
        const existingRequestByTelegram = await prisma.request.findUnique({
            where: { telegram },
        });

        if (existingRequestByTelegram) {
            return new Response(
                JSON.stringify({ error: "Telegram username is already in use" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }


        // Hash the password
        const hash = bcrypt.hashSync(password, 8);

        // Create a registration request
        await prisma.request.create({
            data: {
                email,
                password: hash,
                telegram,
            },
        });

        // Success response
        return new Response(
            JSON.stringify({ message: "Registration request created successfully" }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error handling registration request:', error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

