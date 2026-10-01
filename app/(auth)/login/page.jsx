"use client";
import { login } from "@/app/lib/api/auth";
import ShowToast from "@/app/lib/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
const Page = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("password");

        const response = await login(email, password);
        setLoading(false);
        if (response.error) {
            ShowToast({ message: response.error, type: "error" });
        } else {
            ShowToast({ message: response.message, type: "success" });
            success();
        }
    };
    const success = () => {
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        router.push("/dashboard/profile");
    };
    return (
        <main className="min-h-screen bg-gray-50 px-4 py-16">
            <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center">
                <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">

                        <a
                            href="/"
                            className="mb-4 inline-block text-2xl font-bold tracking-tight text-gray-900"
                        >
                            NextLog
                        </a>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to continue to your NextLog account.
                        </p>
                    </div>
                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <a
                                    href="/forgot-password"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {loading ? (
                                <>
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>
                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                    {/* Google Login */}
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            login
                        </span>
                        Continue with Google
                    </button>
                    {/* Signup Link */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?
                        <a
                            href="/signup"
                            className="font-medium text-blue-600 hover:text-blue-700"
                        >
                            Create an account
                        </a>
                    </p>
                </div>
            </div>
        </main>

    );
}

export default Page;
