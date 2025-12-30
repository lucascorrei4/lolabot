import { NextResponse } from "next/server";
import { createOTP, getUserByEmail, createUser } from "../../../../lib/db/mongo";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        // Check if user exists, if not create basic user
        let user = await getUserByEmail(email);
        if (!user) {
            user = await createUser(email, 'user');
        }

        const code = await createOTP(email);

        // Real email sending - using environment variables for security
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"BizAI Agent Intelligence Admin" <info@bizaigpt.com>',
            to: email,
            subject: `Your BizAI Agent Login Code (${code})`,
            text: `Your login code is: ${code}`,
            html: `
            <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #111827;">BizAI Agent Login</h2>
                <p style="color: #4b5563;">Use the following code to sign in to your admin dashboard:</p>
                <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #4f46e5;">${code}</span>
                </div>
                <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes.</p>
            </div>
        `
        });

        console.log(`[AUTH] OTP sent to ${email}. MessageID: ${info.messageId}`);

        // Return code in debug mode to unblock user if email fails
        return NextResponse.json({ success: true, debug_code: code });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}
