"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getCategories } from "@/app/lib/api/category";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const CATEGORIES_PER_PAGE = 12;

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("popular"); // 'popular' | 'alpha' | 'newest'

    // Fetch initial categories
    useEffect(() => {
        let isMounted = true;

        async function fetchInitialCategories() {
            setLoading(true);
            setError(null);
            try {
                const res = await getCategories({
                    pageSize: CATEGORIES_PER_PAGE,
                    status: "Active",
                    orderByField: sortBy === "alpha" ? "name" : sortBy === "newest" ? "createdAtTimestamp" : "posts",
                    orderDirection: sortBy === "alpha" ? "asc" : "desc",
                });

                if (isMounted) {
                    if (res.status) {
                        setCategories(res.data || []);
                        setLastDoc(res.lastDoc || null);
                        setHasMore(Boolean(res.hasMore));
                    } else {
                        setError(res.errorMessage || "Failed to load categories");
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Something went wrong loading categories");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchInitialCategories();

        return () => {
            isMounted = false;
        };
    }, [sortBy]);

    // Handle load more
    const handleLoadMore = async () => {
        if (loadingMore || !hasMore || !lastDoc) return;

        setLoadingMore(true);
        try {
            const res = await getCategories({
                pageSize: CATEGORIES_PER_PAGE,
                lastDoc,
                status: "Active",
                orderByField: sortBy === "alpha" ? "name" : sortBy === "newest" ? "createdAtTimestamp" : "posts",
                orderDirection: sortBy === "alpha" ? "asc" : "desc",
            });

            if (res.status && Array.isArray(res.data)) {
                setCategories((prev) => {
                    const existing = new Set(prev.map((c) => c.id));
                    const newItems = res.data.filter((c) => !existing.has(c.id));
                    return [...prev, ...newItems];
                });
                setLastDoc(res.lastDoc || null);
                setHasMore(Boolean(res.hasMore));
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Failed to load more categories:", err);
        } finally {
            setLoadingMore(false);
        }
    };

    // Filter categories by search
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;
        const q = searchQuery.toLowerCase().trim();
        return categories.filter(
            (c) =>
                (c.name && c.name.toLowerCase().includes(q)) ||
                (c.slug && c.slug.toLowerCase().includes(q)) ||
                (c.description && c.description.toLowerCase().includes(q))
        );
    }, [categories, searchQuery]);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 pt-24">
            <div className="mx-auto max-w-6xl px-4">
                {/* Hero Header */}
                <div className="mb-8 text-center max-w-2xl mx-auto">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                        <span className="material-symbols-outlined text-[16px]">category</span>
                        <span>Topic Directory</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        All Categories
                    </h1>
                    <p className="mt-2 text-base text-gray-500">
                        Browse our extensive collection of technical topics, curated developer guides, and architectural deep-dives.
                    </p>
                </div>

                {/* Search & Sort Controls */}
                <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                    {/* Search */}
                    <div className="relative w-full sm:max-w-md">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
                            search
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search categories by name or keyword..."
                            className="w-full rounded-xl bg-gray-50 py-2.5 pl-11 pr-10 text-sm text-gray-900 placeholder:text-gray-400 border border-gray-200 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        )}
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <span className="text-xs font-medium text-gray-400 mr-1 hidden sm:inline">Sort:</span>
                        <button
                            type="button"
                            onClick={() => setSortBy("popular")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                sortBy === "popular"
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Popular
                        </button>
                        <button
                            type="button"
                            onClick={() => setSortBy("alpha")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                sortBy === "alpha"
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            A - Z
                        </button>
                        <button
                            type="button"
                            onClick={() => setSortBy("newest")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                sortBy === "newest"
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Newest
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                {loading ? (
                    <LoadingSpinner size={46} label="Loading categories..." />
                ) : error ? (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-[48px] text-red-300">error</span>
                        <p className="mt-3 text-base font-medium text-red-500">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="rounded-2xl bg-white py-16 text-center shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-2">category</span>
                        <h3 className="text-lg font-bold text-gray-900">No categories found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No categories matched your search criteria.
                        </p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
                        >
                            Reset search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCategories.map((category) => {
                            const catSlug = category.slug || category.name.toLowerCase().replace(/\s+/g, "-");
                            const postCount = Number(category.posts) || 0;

                            return (
                                <Link
                                    key={category.id || catSlug}
                                    href={`/blog?category=${encodeURIComponent(catSlug)}`}
                                    className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                                    <span className="material-symbols-outlined text-[20px]">folder</span>
                                                </div>
                                                <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                                                    {category.name}
                                                </h2>
                                            </div>
                                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                                                {postCount} {postCount === 1 ? "article" : "articles"}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                            {category.description || "Discover high quality articles, tutorials, and discussions in this category."}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                                        <span>View Articles</span>
                                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Load More Button for Scale (Thousands of Categories) */}
                {!loading && !error && filteredCategories.length > 0 && hasMore && (
                    <div className="mt-12 flex justify-center">
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-blue-600 disabled:opacity-60 cursor-pointer"
                        >
                            {loadingMore ? (
                                <>
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                                    <span>Loading more categories...</span>
                                </>
                            ) : (
                                <>
                                    <span>Load More Categories</span>
                                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
