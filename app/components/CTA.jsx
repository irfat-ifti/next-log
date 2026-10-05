import Link from "next/link";

const CTA = () => {
    return (
        <section className="mb-16 max-w-6xl mx-auto w-full px-4">
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50/50 p-8 text-center shadow-xs sm:p-12">

                <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-blue-100/50 opacity-60 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-indigo-100/40 opacity-60 blur-3xl" />

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs border border-blue-100/60">
                    <span className="material-symbols-outlined text-[28px]">
                        edit_document
                    </span>
                </div>

                <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    Share Your Engineering Discoveries
                </h2>

                <p className="mb-8 max-w-xl text-base leading-relaxed text-gray-600">
                    Whether you mastered a tricky concurrency bug, built a high-performance system, or learned a framework inside out—your story empowers thousands of developers.
                </p>

                <div className="flex flex-col items-center gap-3 sm:flex-row">

                    <Link
                        href="/dashboard/create-post"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow sm:w-auto"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            edit_note
                        </span>
                        <span>Start Writing</span>
                    </Link>

                    <Link
                        href="/categories"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 sm:w-auto"
                    >
                        <span>Browse Topics</span>
                        <span className="material-symbols-outlined text-[16px]">
                            arrow_forward
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTA;
