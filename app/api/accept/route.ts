import prisma from "../../lib/prisma";


export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;


    await prisma.user.create({
        data: {
            email,
            password
        },
    })

    return Response.json({})
  }