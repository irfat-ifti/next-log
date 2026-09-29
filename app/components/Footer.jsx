import React from "react";

const Footer = () => {
    return (
        <footer className="mt-auto w-full border-t border-gray-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center">
                {/* Footer Info */}
                <div className="max-w-md">
                    <div className="mb-1 flex items-center gap-2">
                        <span className="text-lg font-semibold tracking-tight text-gray-900">
                            NextLog
                        </span>
                    </div>

                    <p className="text-sm text-gray-500">
                        A minimalist developer community built for learning Next.js
                        fundamentals.
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex flex-wrap items-center gap-x-8 gap-y-2">
                    <a
                        href="#"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        Home
                    </a>

                    <a
                        href="#"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        Blog
                    </a>

                    <a
                        href="#"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        Authors
                    </a>

                    <a
                        href="#"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        Privacy
                    </a>

                    <a
                        href="#"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        RSS Feed
                    </a>

                    <a
                        href="#"
                        className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                        Sitemap.xml
                    </a>
                </nav>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-200">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-gray-500 sm:flex-row">
                    <p>
                        © 2025 NextLog. Open-source editorial publishing platform.
                    </p>

                    <p>Powered by Next.js App Router</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;