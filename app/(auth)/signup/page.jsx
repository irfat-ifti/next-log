"use client";
import { signup } from "@/app/lib/api/auth";
const Page = () => {
    const handleSignup = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        const response = await signup(name, email, password);
        if (response.error) {
            alert(response.error);
        }
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

                            Create your account
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">

                            Join NextLog and start sharing your ideas.
                        </p>
                    </div>
                    {/* Signup Form */}
                    <form className="space-y-5" onSubmit={handleSignup}>

                        {/* Name */}
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
                        {/* Confirm Password */}
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
                        {/* Submit */}
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >

                            Create account
                        </button>
                    </form>
                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">

                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                    {/* Google Signup */}
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >

                        <span className="material-symbols-outlined text-[18px]">

                            login
                        </span>
                        Continue with Google
                    </button>
                    {/* Login Link */}
                    <p className="mt-6 text-center text-sm text-gray-500">

                        Already have an account?
                        <a
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-700"
                        >

                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Page;
