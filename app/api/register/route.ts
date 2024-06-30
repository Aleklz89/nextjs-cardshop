import validateEmail from "../../helpers/validateEmail";
import validatePassword from "../../helpers/validatePassword";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, telegram, invite } = body;

    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!validatePassword(password)) {
      return new Response(
        JSON.stringify({ error: "Invalid password format" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!telegram || telegram.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Telegram username is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return new Response(
        JSON.stringify({ error: "Email is already in use" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingUserByTelegram = await prisma.user.findUnique({
      where: { telegram },
    });

    if (existingUserByTelegram) {
      return new Response(
        JSON.stringify({ error: "Telegram username is already in use" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (invite) {
      const inviteRecord = await prisma.invite.findUnique({
        where: { id: invite },
      });

      if (!inviteRecord) {
        return new Response(
          JSON.stringify({ error: "Invalid invite link" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const hash = bcrypt.hashSync(password, 8);

      await prisma.user.create({
        data: {
          email,
          password: hash,
          telegram,
          status: inviteRecord.status,
          teamId: inviteRecord.teamId,
        },
      });

      return new Response(
        JSON.stringify({ message: "User registered successfully" }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      const existingRequestByEmail = await prisma.request.findUnique({
        where: { email },
      });

      if (existingRequestByEmail) {
        return new Response(
          JSON.stringify({ error: "Email is already in use" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const existingRequestByTelegram = await prisma.request.findUnique({
        where: { telegram },
      });

      if (existingRequestByTelegram) {
        return new Response(
          JSON.stringify({ error: "Telegram username is already in use" }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const hash = bcrypt.hashSync(password, 8);

      await prisma.request.create({
        data: {
          email,
          password: hash,
          telegram,
        },
      });

      return new Response(
        JSON.stringify({ message: "Registration request created successfully" }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error handling registration request:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
