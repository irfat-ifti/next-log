import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-16 mt-16">
            <div className="w-full max-w-2xl mx-auto text-center">

                <div className="mb-6">
                    <span className="text-[100px] sm:text-[140px] font-black leading-none tracking-tighter bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        404
                    </span>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                        Page not found
                    </h1>

                    <p className="max-w-md mx-auto text-base sm:text-lg leading-7 text-slate-500">
                        The article you are looking for doesn&apos;t exist,
                        may have been removed, or the link might be incorrect.
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>

                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
