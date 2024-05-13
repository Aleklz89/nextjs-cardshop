import prisma from "../../lib/prisma";

export async function POST(request: Request) {
    try {
        // Parse the incoming request data
        const { id, markup } = await request.json();

        // Update the user markup in the database
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { markup },
        });

        // Send a successful response back with the updated user data
        return new Response(JSON.stringify(updatedUser), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error updating user markup:", error);
        return new Response(JSON.stringify({ error: "Failed to update user markup" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
