import BlogCard from '@/app/components/BlogCard'
import blogData from "@/app/data/blogData";

const Page = () => {
    return (
        <>
            <section className="mb-16 w-full max-w-6xl mx-auto mt-16.25 pt-16">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-blue-600">
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
                            <span>Curated Developer Articles</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            All Articles
                        </h1>
                        <p className="mt-1 text-base leading-7 text-gray-500">
                            Explore insights, tutorials, and practical dev experiences from
                            community authors.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
                        <div className="px-3 py-1 text-center">
                            <span className="block text-xl font-bold text-gray-900">
                                48
                            </span>
                            <span className="block text-xs font-medium text-gray-500">
                                Articles
                            </span>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div className="px-3 py-1 text-center">
                            <span className="block text-xl font-bold text-blue-600">
                                99.8%
                            </span>
                            <span className="block text-xs font-medium text-gray-500">
                                Avg Perf Score
                            </span>
                        </div>
                    </div>
                </div>
                {/* Live Search & Category Controller */}
                <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
                    {/* Search Input */}
                    <div className="relative w-full">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
                            search
                        </span>
                        <input
                            className="w-full rounded-lg py-2.5 pl-11 pr-10 text-sm placeholder:text-gray-400 shadow-inner transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="article-search"
                            placeholder="Search articles by title or keyword..."
                            type="search"
                        />
                        <button
                            className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-gray-400 hover:text-gray-900"
                            id="clear-search"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                close
                            </span>
                        </button>
                    </div>
                    {/* Category Filter Pills */}
                    <div
                        className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1 text-nowrap"
                        id="filter-container"
                    >
                        <button
                            className="category-pill inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
                            data-cat="all"
                            type="button"
                        >
                            <span>All</span>
                            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                                48
                            </span>
                        </button>
                        <button
                            className="category-pill inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-200"
                            data-cat="technology"
                            type="button"
                        >
                            <span>Technology</span>
                            <span className="rounded-full bg-white px-1.5 py-0.5 text-xs text-gray-500">
                                14
                            </span>
                        </button>
                        <button
                            className="category-pill inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-200"
                            data-cat="programming"
                            type="button"
                        >
                            <span>Programming</span>
                            <span className="rounded-full bg-white px-1.5 py-0.5 text-xs text-gray-500">
                                9
                            </span>
                        </button>
                        <button
                            className="category-pill inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-200"
                            data-cat="webdev"
                            type="button"
                        >
                            <span>Web Development</span>
                            <span className="rounded-full bg-white px-1.5 py-0.5 text-xs text-gray-500">
                                16
                            </span>
                        </button>
                        <button
                            className="category-pill inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-200"
                            data-cat="design"
                            type="button"
                        >
                            <span>Design</span>
                            <span className="rounded-full bg-white px-1.5 py-0.5 text-xs text-gray-500">
                                6
                            </span>
                        </button>
                        <button
                            className="category-pill inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-200"
                            data-cat="career"
                            type="button"
                        >
                            <span>Career</span>
                            <span className="rounded-full bg-white px-1.5 py-0.5 text-xs text-gray-500">
                                3
                            </span>
                        </button>
                    </div>
                </div>
            </section>
            <div className='w-full max-w-6xl mx-auto space-y-4'>
                {blogData.map((blog) => (


                    <BlogCard key={blog.id} blog={blog} variant={"vertical"} />

                ))}
            </div>

            {/* No Results */}
            <div
                className="max-w-6xl my-4 hidden w-full rounded-xl bg-white py-16 text-center shadow-sm"
                id="no-results"
            >
                <span className="material-symbols-outlined mb-2 text-5xl text-gray-400">
                    menu_book
                </span>

                <h3 className="text-xl font-bold text-gray-900">
                    No articles found
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
                    Try searching for a different keyword or switch to another category
                    tab above.
                </p>
            </div>

            {/* Pagination */}
            <section className="max-w-6xl mx-auto mt-16 flex w-full flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row mb-20">
                {/* Showing Count */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Showing</span>

                    <span className="text-sm font-semibold text-gray-900">
                        1 - 4
                    </span>

                    <span>of</span>

                    <span className="text-sm font-semibold text-gray-900">
                        48
                    </span>

                    <span>posts</span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Previous */}
                    <button
                        className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-gray-500 opacity-50 shadow-sm"
                        disabled
                        type="button"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            arrow_back
                        </span>

                        <span>Previous</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 px-2">
                        <button
                            className="h-8 w-8 rounded-lg bg-blue-600 text-xs font-semibold text-white shadow-sm"
                            type="button"
                        >
                            1
                        </button>

                        <button
                            className="h-8 w-8 rounded-lg bg-white text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            type="button"
                        >
                            2
                        </button>

                        <button
                            className="h-8 w-8 rounded-lg bg-white text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            type="button"
                        >
                            3
                        </button>

                        <span className="px-1 text-sm text-gray-500">…</span>

                        <button
                            className="h-8 w-8 rounded-lg bg-white text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            type="button"
                        >
                            12
                        </button>
                    </div>

                    {/* Next */}
                    <button
                        className="inline-flex items-center gap-1 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
                        type="button"
                    >
                        <span>Next</span>

                        <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                        </span>
                    </button>
                </div>
            </section>


        </>
    );
}

export default Page;
