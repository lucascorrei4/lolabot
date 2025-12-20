import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.AUTH_SECRET || "change-me-in-production-please-super-secret-key-123";
const key = new TextEncoder().encode(SECRET_KEY);

export async function signSession(payload: { email: string; role: string; allowedBotIds: string[] }) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function verifySession(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload as { email: string; role: string; allowedBotIds: string[] };
    } catch (e) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return await verifySession(token);
}

export async function setSession(email: string, role: string, allowedBotIds: string[]) {
    const token = await signSession({ email, role, allowedBotIds });
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 // 24 hours
    });
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
}
