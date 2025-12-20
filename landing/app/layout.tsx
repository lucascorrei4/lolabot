import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "LolaBot",
    description: "Typebot-like embeddable chatbot",
    icons: {
        icon: '/assets/img/favicon.png',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
