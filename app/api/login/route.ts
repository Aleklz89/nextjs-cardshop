import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import validateEmail from "../../helpers/validateEmail";
import validatePassword from "../../helpers/validatePassword";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    if (!validateEmail(email) || !validatePassword(password)) {
        return new Response(
            JSON.stringify({ error: "Invalid email or password" }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const user = await prisma.user.findFirst({
        where: { email },
    });

    if (!user) {
        return new Response(
            JSON.stringify({ error: "Invalid email or password" }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const isCorrectPassword = bcrypt.compareSync(password, user.password);
    if (!isCorrectPassword) {
        return new Response(
            JSON.stringify({ error: "Invalid email or password" }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = 'HS256';


    const jwt = await new jose.SignJWT({ id: user.id })
        .setProtectedHeader({ alg })
        .setExpirationTime('72h')
        .sign(secret);


    return new Response(JSON.stringify({ token: jwt }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `Authorization=${jwt}; Path=/; HttpOnly; Secure; SameSite=Strict;`
        }
    });
}
