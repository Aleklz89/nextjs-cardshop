import validateEmail from "../../helpers/validateEmail";
import validatePassword from "../../helpers/validatePassword";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Separate validation for email
        if (!validateEmail(email)) {
            return new Response(
                JSON.stringify({
                    error: "Invalid email format",
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Separate validation for password
        if (!validatePassword(password)) {
            return new Response(
                JSON.stringify({
                    error: "Invalid password format",
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if the email is already in use
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({
                    error: "Email is already in use",
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Hash the password
        const hash = bcrypt.hashSync(password, 8);

        // Try to create a registration request
        try {
            await prisma.request.create({
                data: {
                    email,
                    password: hash,
                },
            });
        } catch (error) {
            // Handle unique constraint violations
            if (error.code === "P2002" && error.meta?.target.includes("email")) {
                return new Response(
                    JSON.stringify({
                        error: "You have already submitted a registration request.",
                    }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            } else {
                console.error("Database insertion error:", error);
                return new Response(
                    JSON.stringify({
                        error: "Internal server error",
                    }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        // Return success response
        return new Response(
            JSON.stringify({
                message: "Registration request created successfully",
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error handling registration request:', error);
        return new Response(
            JSON.stringify({
                error: "Internal server error",
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
