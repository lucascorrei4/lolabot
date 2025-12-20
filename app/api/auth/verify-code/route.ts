import { NextResponse } from "next/server";
import { verifyOTP, getUserByEmail } from "../../../../lib/db/mongo";
import { setSession } from "../../../../lib/auth";

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const isValid = await verifyOTP(email, code);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Set HTTP-only cookie
        await setSession(user.email, user.role, user.allowedBotIds || []);

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
