import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="mt-auto w-full border-t border-gray-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center">

                <div className="max-w-md">
                    <div className="mb-1 flex items-center gap-2">
                        <span className="text-lg font-semibold tracking-tight text-gray-900">
                            NextLog
                        </span>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-500">
                        An open-access editorial platform designed for engineers, architects, and technical leaders documenting the modern web.
                    </p>
                </div>

                <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <Link
                        href="/"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        Home
                    </Link>

                    <Link
                        href="/blog"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        Articles
                    </Link>

                    <Link
                        href="/categories"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        Categories
                    </Link>

                    <Link
                        href="/tags"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        Tags
                    </Link>

                    <Link
                        href="/about"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        About
                    </Link>
                </nav>
            </div>

            <div className="border-t border-gray-200">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-gray-500 sm:flex-row">
                    <p>
                        © {new Date().getFullYear()} NextLog Editorial. Open-source publication for engineers.
                    </p>

                    <p>Crafted with Next.js App Router &amp; Firebase</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
