import validateEmail from "../../helpers/validateEmail";
import validatePassword from "../../helpers/validatePassword";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

       
        if (!validateEmail(email) || !validatePassword(password)) {
            return new Response(
                JSON.stringify({
                    error: "Invalid email or password",
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

       
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

      
        const hash = bcrypt.hashSync(password, 8);

     
        try {
            await prisma.request.create({
                data: {
                    email,
                    password: hash,
                },
            });
        } catch (error) {
           
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