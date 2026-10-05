import Link from "next/link";

export const metadata = {
    title: "About NextLog — The Engineering Publication Platform",
    description: "Learn about the mission, architecture, and engineering principles behind NextLog.",
};

export default function AboutPage() {
    return (
        <div className="w-full pt-20 pb-16">

            <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:py-16">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                    <span>Our Mission &amp; Philosophy</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                    Built for Engineers Who Care About Craftsmanship.
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl max-w-2xl mx-auto">
                    NextLog is a publication space designed to strip away the noise of modern content aggregators and bring back high-signal, peer-to-peer technical writing.
                </p>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <span className="material-symbols-outlined text-[24px]">terminal</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Developer First</h2>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            Equipped with markdown tooling, code block clarity, and syntax preservation. We build with the dev workflow in mind.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <span className="material-symbols-outlined text-[24px]">bolt</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Blazing Performance</h2>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            Powered by Next.js Server Components, Turbopack, and edge-optimized assets for near-instant rendering and Core Web Vitals perfection.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <span className="material-symbols-outlined text-[24px]">public</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Open Knowledge</h2>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            No paywalls. No clickbait headlines. Just genuine architectural breakdowns, post-mortems, and engineering breakthroughs.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-12">
                <div className="rounded-3xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/70 p-8 sm:p-12 shadow-xs space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-950">
                        Why We Created NextLog
                    </h3>
                    <p>
                        In an era dominated by algorithmic feeds and micro-blogging, comprehensive technical documentation has become rare. Developers frequently spend days debugging an obscure concurrency race or scaling database indexes, only for that solution to remain locked in internal Slack threads.
                    </p>
                    <p>
                        NextLog was conceived as a permanent, searchable engineering repository where developers can document their real-world discoveries. When you write on NextLog, you are not merely publishing content—you are helping another engineer across the world save days of trial and error.
                    </p>
                    <div className="pt-4 flex flex-wrap items-center gap-4">
                        <Link
                            href="/dashboard/create-post"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                        >
                            <span>Join As an Author</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </Link>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            <span>Read All Articles</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
