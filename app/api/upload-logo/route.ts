import { existsSync, mkdirSync, writeFileSync } from "fs";
import { NextResponse } from "next/server";
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

export async function POST(request: Request) {
  console.log("Starting POST request");

  const formData = await request.formData();
  console.log("Form data received");

  const file = formData.get("logo") as File;
  if (!file) {
    console.log("Missing file");
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }
  console.log("File received:", file.name);

  const userId = formData.get("userId") as string;
  const teamName = formData.get("team") as string;

  if (!userId || !teamName) {
    console.log("Missing user ID or team name");
    return NextResponse.json({ error: 'Missing user ID or team name' }, { status: 400 });
  }
  console.log("User ID:", userId);
  console.log("Team Name:", teamName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filePath = path.join(uploadDir, `${Date.now()}${path.extname(file.name)}`);
  writeFileSync(filePath, buffer);
  console.log("File saved to:", filePath);

  const fileUrl = `/uploads/${path.basename(filePath)}`;

  try {
    const team = await prisma.team.findUnique({
      where: { name: teamName },
    });
    console.log("Team found:", team);

    if (!team) {
      console.log("Team not found");
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    await prisma.team.update({
      where: { name: teamName },
      data: { logoUrl: fileUrl },
    });
    console.log("Team logo updated");

    return NextResponse.json({ logoUrl: fileUrl });
  } catch (error) {
    console.error("Error updating team logo:", error);
    return NextResponse.json({ error: 'Error updating team logo' }, { status: 500 });
  }
}
