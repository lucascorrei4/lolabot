import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { getUserByEmail } from "../../../../lib/db/mongo";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await getUserByEmail(session.email);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                email: user.email,
                role: user.role,
                allowedBotIds: user.allowedBotIds,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch user" },
            { status: 500 }
        );
    }
}
