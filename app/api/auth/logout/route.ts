import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Delete the session cookie
        cookieStore.delete("session");

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Logout failed" },
            { status: 500 }
        );
    }
}
