"use client";
import { signup } from "@/app/lib/api/auth";
import ShowToast from "@/app/lib/toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthProvider";

const Page = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            router.replace("/dashboard/profile");
        }
    }, [user, router]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");
        if (password !== confirmPassword) {
            ShowToast({ message: "Password and confirm password do not match", type: "error" });
            setLoading(false);
            return;
        }
        const response = await signup(name, email, password);
        setLoading(false);
        if (response.error) {
            ShowToast({ message: response.error, type: "error" });
        } else {
            ShowToast({ message: response.message, type: "success" });
            router.push("/dashboard/profile");
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-16">

            <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center">

                <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                    <div className="mb-8 text-center">

                        <Link
                            href="/"
                            className="mb-4 inline-block text-2xl font-bold tracking-tight text-gray-900"
                        >
                            NextLog
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">

                            Create your account
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">

                            Join NextLog and start sharing your ideas.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSignup}>

                        <div>

                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >

                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Irfat Uddin Ifti"
                                required
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

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

                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >

                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Create a password"
                                minLength={6}
                                required
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >

                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Confirm your password"
                                minLength={6}
                                required
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-700"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Page;
