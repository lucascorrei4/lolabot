import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getGlobalSetting, setGlobalSetting, getAllGlobalSettings } from "../../../lib/db/mongo";
import { verifySession } from "../../../lib/auth";

// GET - Fetch global settings (super admin only)
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await verifySession(token);
        if (!user || user.role !== 'super_admin') {
            return NextResponse.json({ error: "Forbidden - Super admin access required" }, { status: 403 });
        }

        // Check for specific key in query params
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (key) {
            const setting = await getGlobalSetting(key);
            return NextResponse.json({ setting });
        }

        // Return all global settings
        const settings = await getAllGlobalSettings();
        return NextResponse.json({ settings });
    } catch (error) {
        console.error("Error fetching global settings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT - Update a global setting (super admin only)
export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await verifySession(token);
        if (!user || user.role !== 'super_admin') {
            return NextResponse.json({ error: "Forbidden - Super admin access required" }, { status: 403 });
        }

        const body = await request.json();
        const { key, value, description } = body;

        if (!key || typeof value !== 'string') {
            return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
        }

        const setting = await setGlobalSetting(key, value, user.email, description);
        return NextResponse.json({ setting, success: true });
    } catch (error) {
        console.error("Error updating global setting:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
