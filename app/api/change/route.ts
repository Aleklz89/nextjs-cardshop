import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import validatePassword from "../../helpers/validatePassword";

const SALT_ROUNDS = 10;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, oldPassword, newPassword } = body;

 
        if (!userId || !oldPassword || !newPassword) {
            return new Response(
                JSON.stringify({ error: "Missing userId, oldPassword, or newPassword" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }


        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId, 10) },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }


        const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return new Response(
                JSON.stringify({ error: "Incorrect old password" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }


        if (!validatePassword(newPassword)) {
            return new Response(
                JSON.stringify({ error: "Invalid password format" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }


        const newPasswordHash = bcrypt.hashSync(newPassword, SALT_ROUNDS);
        await prisma.user.update({
            where: { id: parseInt(userId, 10) },
            data: { password: newPasswordHash },
        });

        return new Response(
            JSON.stringify({ success: true, message: "Password successfully updated" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error updating password:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
