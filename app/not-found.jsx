import Link from "next/link";

const NotFound = () => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
            <div className="w-full max-w-2xl text-center">
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-12 shadow-sm sm:px-12 sm:py-16">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-100 opacity-60 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-gray-100 opacity-70 blur-3xl" />
                    <div className="relative">
                        <div className="mb-4">
                            <span className="text-7xl font-bold tracking-tight text-blue-600 sm:text-8xl">
                                404
                            </span>
                        </div>
                        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-blue-600 shadow-sm">
                            <span className="material-symbols-outlined text-[28px]">
                                search_off
                            </span>
                        </div>
                        <h1 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Page not found
                        </h1>
                        <p className="mx-auto mb-8 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                            The page you are looking for doesn&apos;t exist or may have been moved to
                            another location.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                href="/"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    home
                                </span>
                                <span>Back to Home</span>
                            </Link>
                            <Link
                                href="/blog"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    article
                                </span>
                                <span>Explore Articles</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <p className="mt-6 text-xs text-gray-400">
                    NextLog · A minimalist developer community
                </p>
            </div>
        </main>
    );
};

export default NotFound;
