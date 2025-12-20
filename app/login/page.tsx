"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LockClosedIcon, EnvelopeIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function LoginPage() {
    const [step, setStep] = useState<"email" | "otp">("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.toLowerCase() }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send code");

            // For dev convenience, if code is returned in debug
            if (data.debug_code) {
                console.log("OTP Code:", data.debug_code);
            }

            setStep("otp");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.toLowerCase(), code }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Verification failed");

            // Success - Redirect
            router.push("/admin/portal");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center px-4 font-sans text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 z-10 shadow-2xl relative">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700 shadow-inner">
                        <LockClosedIcon className="w-8 h-8 text-indigo-400" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <div className="text-center flex justify-center items-center gap-3 mb-1">
                        <Image
                            src="/assets/img/favicon.png"
                            alt="LolaBot"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            LolaBot Intelligence
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                        {step === "email" ? "Enter your email to continue" : `Code sent to ${email}`}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {step === "email" ? (
                    <form onSubmit={handleSendCode} className="space-y-4">
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-600"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                            ) : (
                                <>
                                    Get Login Code
                                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                maxLength={6}
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="123456"
                                className="w-full bg-gray-950 border border-gray-800 text-white text-center text-2xl tracking-[0.5em] font-mono rounded-xl py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-700/50"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                            ) : "Verify & Sign In"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep("email")}
                            className="w-full text-gray-500 text-sm hover:text-gray-300 transition-colors py-2"
                        >
                            Use a different email
                        </button>
                    </form>
                )}
            </div>

            <div className="mt-8 text-xs text-gray-600">
                &copy; {new Date().getFullYear()} LolaBot Intelligence
            </div>
        </div>
    );
}
