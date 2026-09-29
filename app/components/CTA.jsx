const CTA = () => {
    return (
        <section className="mb-16">
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-white p-8 text-center shadow-sm sm:p-10">
                {/* Decorative Background */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gray-200 opacity-40 blur-2xl" />

                <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-gray-100 opacity-50 blur-2xl" />

                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-blue-600 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">
                        stylus_note
                    </span>
                </div>

                {/* Heading */}
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                    Have something to share?
                </h2>

                {/* Description */}
                <p className="mb-8 max-w-lg text-base leading-6 text-gray-500">
                    Create an account and publish your first article. Join hundreds of
                    developers documenting their journey.
                </p>

                {/* Buttons */}
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                    {/* Start Writing */}
                    <a
                        href="#"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            add
                        </span>

                        <span>Start Writing</span>
                    </a>

                    {/* Explore Authors */}
                    <a
                        href="#"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-transparent px-5 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 sm:w-auto"
                    >
                        <span>Explore Authors</span>

                        <span className="material-symbols-outlined text-[16px]">
                            arrow_forward
                        </span>
                    </a>
                </div>
            </div>
        </section>

    );
}

export default CTA;
