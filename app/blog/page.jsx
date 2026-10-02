"use client";

import { useState, useEffect, useMemo } from "react";
import BlogCard from "@/app/components/BlogCard";
import { getPosts } from "@/app/lib/api/post";

const POSTS_PER_PAGE = 6;

const Page = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoading(true);
                const result = await getPosts();
                if (result.status) {
                    setAllPosts(result.data);
                } else {
                    setError(result.errorMessage || "Failed to load posts");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    // Build unique category list from posts
    const categories = useMemo(() => {
        const cats = new Set();
        allPosts.forEach((p) => {
            if (p.category) cats.add(p.category);
        });
        return Array.from(cats);
    }, [allPosts]);

    // Filter by category + search
    const filteredPosts = useMemo(() => {
        return allPosts.filter((post) => {
            const matchCat =
                activeCategory === "all" ||
                post.category?.toLowerCase().replace(/\s+/g, "-") ===
                    activeCategory;

            const q = searchQuery.toLowerCase().trim();
            const matchSearch =
                !q ||
                post.title?.toLowerCase().includes(q) ||
                post.excerpt?.toLowerCase().includes(q) ||
                post.tags?.some((t) =>
                    (typeof t === "object" ? t.name : t)
                        ?.toLowerCase()
                        .includes(q)
                );

            return matchCat && matchSearch;
        });
    }, [allPosts, activeCategory, searchQuery]);

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
    // Clamp page so filters never leave you on a non-existent page
    const effectivePage = Math.min(currentPage, totalPages);
    const paginatedPosts = filteredPosts.slice(
        (effectivePage - 1) * POSTS_PER_PAGE,
        effectivePage * POSTS_PER_PAGE
    );

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setCurrentPage(1);
    };

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setActiveCategory("all");
        setCurrentPage(1);
    };

    // Generate page numbers for pagination UI
    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages = [];
        if (effectivePage <= 3) {
            pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (effectivePage >= totalPages - 2) {
            pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, "...", effectivePage - 1, effectivePage, effectivePage + 1, "...", totalPages);
        }
        return pages;
    };

    return (
        <>
            <section className="mb-8 w-full max-w-6xl mx-auto mt-16.25 pt-16 px-4">
                {/* Header */}
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
                            Explore insights, tutorials, and practical dev experiences from community authors.
                        </p>
                    </div>

                    {/* Stats */}
                    {!loading && (
                        <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm shrink-0">
                            <div className="px-3 py-1 text-center">
                                <span className="block text-xl font-bold text-gray-900">
                                    {allPosts.length}
                                </span>
                                <span className="block text-xs font-medium text-gray-500">Articles</span>
                            </div>
                            <div className="h-8 w-px bg-gray-200" />
                            <div className="px-3 py-1 text-center">
                                <span className="block text-xl font-bold text-blue-600">
                                    {categories.length}
                                </span>
                                <span className="block text-xs font-medium text-gray-500">Categories</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search & Category Filter */}
                <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
                    {/* Search Input */}
                    <div className="relative w-full">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
                            search
                        </span>
                        <input
                            className="w-full rounded-lg py-2.5 pl-11 pr-10 text-sm placeholder:text-gray-400 shadow-inner transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="article-search"
                            placeholder="Search articles by title, keyword or tag..."
                            type="search"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 cursor-pointer"
                                type="button"
                                onClick={() => handleSearchChange("")}
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        )}
                    </div>

                    {/* Category Filter Pills */}
                    <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1 text-nowrap">
                        <button
                            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium shadow-sm transition-all cursor-pointer ${
                                activeCategory === "all"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            type="button"
                            onClick={() => handleCategoryChange("all")}
                        >
                            <span>All</span>
                            <span className={`rounded-full px-1.5 py-0.5 text-xs ${activeCategory === "all" ? "bg-white/20" : "bg-white text-gray-500"}`}>
                                {allPosts.length}
                            </span>
                        </button>

                        {categories.map((cat) => {
                            const slug = cat.toLowerCase().replace(/\s+/g, "-");
                            const count = allPosts.filter((p) => p.category === cat).length;
                            const isActive = activeCategory === slug;
                            return (
                                <button
                                    key={cat}
                                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all cursor-pointer ${
                                        isActive
                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                    type="button"
                                    onClick={() => handleCategoryChange(slug)}
                                >
                                    <span>{cat}</span>
                                    <span className={`rounded-full px-1.5 py-0.5 text-xs ${isActive ? "bg-white/20" : "bg-white text-gray-500"}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Posts List */}
            <div className="w-full max-w-6xl mx-auto px-4">
                {loading ? (
                    /* Loading Skeletons */
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse flex flex-col md:flex-row gap-4 rounded-xl bg-white p-4 shadow-sm"
                            >
                                {/* Image placeholder */}
                                <div className="h-44 w-full md:w-72 rounded-lg bg-gray-200 flex-shrink-0" />
                                {/* Content placeholders */}
                                <div className="flex-1 flex flex-col gap-3 py-2">
                                    <div className="h-5 bg-gray-200 rounded-full w-3/4" />
                                    <div className="h-3.5 bg-gray-200 rounded-full w-full" />
                                    <div className="h-3.5 bg-gray-200 rounded-full w-5/6" />
                                    <div className="mt-auto flex items-center gap-3 pt-2">
                                        <div className="h-7 w-7 rounded-full bg-gray-200 flex-shrink-0" />
                                        <div className="h-3 bg-gray-200 rounded-full w-24" />
                                        <div className="ml-auto h-3 bg-gray-200 rounded-full w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-[48px] text-red-300">error</span>
                        <p className="mt-3 text-base font-medium text-red-500">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="my-4 w-full rounded-xl bg-white py-16 text-center shadow-sm">
                        <span className="material-symbols-outlined mb-2 text-5xl text-gray-400">menu_book</span>
                        <h3 className="text-xl font-bold text-gray-900">No articles found</h3>
                        <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
                            Try searching for a different keyword or switch to another category.
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paginatedPosts.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} variant="vertical" />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && !error && filteredPosts.length > POSTS_PER_PAGE && (
                <section className="max-w-6xl mx-auto mt-10 flex w-full flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row mb-20 px-4">
                    {/* Showing Count */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span>Showing</span>
                        <span className="font-semibold text-gray-900">
                            {Math.min((effectivePage - 1) * POSTS_PER_PAGE + 1, filteredPosts.length)}
                            {" – "}
                            {Math.min(effectivePage * POSTS_PER_PAGE, filteredPosts.length)}
                        </span>
                        <span>of</span>
                        <span className="font-semibold text-gray-900">{filteredPosts.length}</span>
                        <span>posts</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        {/* Previous */}
                        <button
                            className="inline-flex items-center gap-1 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-gray-500 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            disabled={effectivePage <= 1}
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            <span>Previous</span>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1 px-1">
                            {getPageNumbers().map((page, idx) =>
                                page === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="px-1 text-sm text-gray-400">
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setCurrentPage(page)}
                                        className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                            effectivePage === page
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Next */}
                        <button
                            className="inline-flex items-center gap-1 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            disabled={effectivePage >= totalPages}
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        >
                            <span>Next</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </div>
                </section>
            )}
        </>
    );
};

export default Page;
