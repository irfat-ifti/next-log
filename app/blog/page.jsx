"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import BlogCard from "@/app/components/BlogCard";
import { getPosts } from "@/app/lib/api/post";
import { getPopularCategories } from "@/app/lib/api/category";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const POSTS_PER_PAGE = 6;

function BlogContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryParam = searchParams.get("category") || "all";
    const tagParam = searchParams.get("tag") || "";
    const qParam = searchParams.get("q") || searchParams.get("search") || "";

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);

    const [activeCategory, setActiveCategory] = useState(categoryParam);
    const [activeTag, setActiveTag] = useState(tagParam);
    const [searchQuery, setSearchQuery] = useState(qParam);
    const [categoryList, setCategoryList] = useState([]);

    // Keep active filters in sync if URL query parameters change
    useEffect(() => {
        setActiveCategory(categoryParam);
    }, [categoryParam]);

    useEffect(() => {
        setActiveTag(tagParam);
    }, [tagParam]);

    useEffect(() => {
        setSearchQuery(qParam);
    }, [qParam]);

    // Fetch popular/top categories once on mount
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await getPopularCategories(12);
                if (res.status && Array.isArray(res.data)) {
                    setCategoryList(res.data);
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        }
        fetchCategories();
    }, []);

    // Fetch initial batch of posts whenever activeCategory or activeTag changes
    useEffect(() => {
        let isMounted = true;

        async function fetchInitialPosts() {
            setLoading(true);
            setError(null);
            setLastDoc(null);
            setHasMore(false);

            try {
                const result = await getPosts({
                    pageSize: POSTS_PER_PAGE,
                    category: activeCategory !== "all" ? activeCategory : null,
                    tag: activeTag || null,
                });

                if (isMounted) {
                    if (result.status) {
                        setPosts(result.data || []);
                        setLastDoc(result.lastDoc || null);
                        setHasMore(Boolean(result.hasMore));
                    } else {
                        setError(result.errorMessage || "Failed to load posts");
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Something went wrong loading posts");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchInitialPosts();

        return () => {
            isMounted = false;
        };
    }, [activeCategory, activeTag]);

    // Handle "Load More" click
    const handleLoadMore = async () => {
        if (loadingMore || !hasMore || !lastDoc) return;

        setLoadingMore(true);
        try {
            const result = await getPosts({
                pageSize: POSTS_PER_PAGE,
                lastDoc: lastDoc,
                category: activeCategory !== "all" ? activeCategory : null,
                tag: activeTag || null,
            });

            if (result.status && Array.isArray(result.data)) {
                // Prevent duplicate posts by ID
                setPosts((prev) => {
                    const existingIds = new Set(prev.map((p) => p.id));
                    const newItems = result.data.filter((p) => !existingIds.has(p.id));
                    return [...prev, ...newItems];
                });
                setLastDoc(result.lastDoc || null);
                setHasMore(Boolean(result.hasMore));
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Failed to load more posts:", err);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleCategoryChange = (slug) => {
        setActiveCategory(slug);
        const params = new URLSearchParams(searchParams.toString());
        if (slug === "all") {
            params.delete("category");
        } else {
            params.set("category", slug);
        }
        router.push(`/blog?${params.toString()}`, { scroll: false });
    };

    const handleClearTag = () => {
        setActiveTag("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("tag");
        router.push(`/blog?${params.toString()}`, { scroll: false });
    };

    const handleClearAllFilters = () => {
        setSearchQuery("");
        setActiveCategory("all");
        setActiveTag("");
        router.push("/blog", { scroll: false });
    };

    // Filter displayed posts in real time if search query is typed
    const displayedPosts = useMemo(() => {
        if (!searchQuery.trim()) return posts;
        const q = searchQuery.toLowerCase().trim();
        return posts.filter((post) => {
            const titleMatch = post.title?.toLowerCase().includes(q);
            const excerptMatch = post.excerpt?.toLowerCase().includes(q);
            const tagMatch = post.tags?.some((t) =>
                (typeof t === "object" ? t.name : t)?.toLowerCase().includes(q)
            );
            return titleMatch || excerptMatch || tagMatch;
        });
    }, [posts, searchQuery]);

    // Check if the current active category is already in the top categoryList
    const isCustomActiveCategory =
        activeCategory !== "all" &&
        !categoryList.some(
            (c) =>
                (c.slug || c.name.toLowerCase().replace(/\s+/g, "-")) === activeCategory ||
                c.name.toLowerCase() === activeCategory.toLowerCase()
        );

    return (
        <>
            <section className="mb-8 w-full max-w-6xl mx-auto mt-16.25 pt-16 px-4">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                            <span>Curated Developer Articles</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            All Articles
                        </h1>
                        <p className="mt-1 text-base leading-7 text-gray-500">
                            Explore insights, tutorials, and practical dev experiences from community authors.
                        </p>
                    </div>

                    {/* Quick navigation to All Categories / All Tags */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/categories"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-blue-600"
                        >
                            <span className="material-symbols-outlined text-[18px]">category</span>
                            <span>All Categories</span>
                        </Link>
                        <Link
                            href="/tags"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-blue-600"
                        >
                            <span className="material-symbols-outlined text-[18px]">tag</span>
                            <span>All Tags</span>
                        </Link>
                    </div>
                </div>

                {/* Active Tag Banner if filtered by tag */}
                {activeTag && (
                    <div className="mb-4 flex items-center justify-between rounded-xl bg-blue-50/80 border border-blue-100 px-4 py-3 text-sm text-blue-900">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600 text-[20px]">filter_alt</span>
                            <span>Filtered by tag:</span>
                            <span className="font-semibold text-blue-700">#{activeTag}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleClearTag}
                            className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-900 text-xs bg-white px-2.5 py-1 rounded-md shadow-xs transition"
                        >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                            Clear tag
                        </button>
                    </div>
                )}

                {/* Search & Category Filter Bar */}
                <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                    {/* Search Input */}
                    <div className="relative w-full">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
                            search
                        </span>
                        <input
                            className="w-full rounded-lg bg-gray-50 py-2.5 pl-11 pr-2.5 text-sm placeholder:text-gray-400 border border-gray-200 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            id="article-search"
                            placeholder="Search articles by title, keyword or tag..."
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Filter Pills (Top / Active Categories) */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1 text-nowrap max-w-full">
                            <button
                                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all cursor-pointer ${
                                    activeCategory === "all"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                type="button"
                                onClick={() => handleCategoryChange("all")}
                            >
                                <span>All Topics</span>
                            </button>

                            {/* Custom active category pill if arrived via URL param */}
                            {isCustomActiveCategory && (
                                <button
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium bg-blue-600 text-white shadow-sm cursor-pointer"
                                    type="button"
                                    onClick={() => handleCategoryChange(activeCategory)}
                                >
                                    <span className="capitalize">{activeCategory.replace(/-/g, " ")}</span>
                                    <span className="material-symbols-outlined text-[14px]">check</span>
                                </button>
                            )}

                            {categoryList.map((cat) => {
                                const catSlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
                                const isActive =
                                    activeCategory.toLowerCase() === catSlug.toLowerCase() ||
                                    activeCategory.toLowerCase() === cat.name.toLowerCase();

                                return (
                                    <button
                                        key={cat.id || cat.name}
                                        className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                        type="button"
                                        onClick={() => handleCategoryChange(catSlug)}
                                    >
                                        <span>{cat.name}</span>
                                        {cat.posts > 0 && (
                                            <span
                                                className={`rounded-full px-1.5 py-0.2 text-[11px] ${
                                                    isActive ? "bg-white/20" : "bg-white text-gray-500"
                                                }`}
                                            >
                                                {cat.posts}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Link to see all categories */}
                        <Link
                            href="/categories"
                            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5 ml-auto shrink-0"
                        >
                            <span>Browse all categories</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Posts List */}
            <div className="w-full max-w-6xl mx-auto px-4 min-h-[350px]">
                {loading ? (
                    <LoadingSpinner size={46} label="Loading articles..." />
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow-sm p-6">
                        <span className="material-symbols-outlined text-[48px] text-red-300">error</span>
                        <p className="mt-3 text-base font-medium text-red-500">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
                        >
                            Retry
                        </button>
                    </div>
                ) : displayedPosts.length === 0 ? (
                    <div className="my-4 w-full rounded-xl bg-white py-16 text-center shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined mb-2 text-5xl text-gray-300">menu_book</span>
                        <h3 className="text-xl font-bold text-gray-900">No articles found</h3>
                        <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
                            Try searching for a different keyword or reset filters to see all articles.
                        </p>
                        <button
                            onClick={handleClearAllFilters}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 cursor-pointer transition"
                        >
                            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayedPosts.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} variant="vertical" />
                        ))}
                    </div>
                )}

                {/* Load More Button Section */}
                {!loading && !error && displayedPosts.length > 0 && (
                    <div className="mt-12 mb-20 flex flex-col items-center justify-center gap-3">
                        {hasMore ? (
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:opacity-60 cursor-pointer"
                            >
                                {loadingMore ? (
                                    <>
                                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Loading more articles...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Load More Articles</span>
                                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 py-4">
                                <span className="h-px w-12 bg-gray-200" />
                                <span>You have reached the end of the articles</span>
                                <span className="h-px w-12 bg-gray-200" />
                            </div>
                        )}

                        <span className="text-xs text-gray-400">
                            Showing {displayedPosts.length} article{displayedPosts.length === 1 ? "" : "s"}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}

export default function BlogPage() {
    return (
        <Suspense fallback={<LoadingSpinner fullScreen label="Loading articles..." size={42} />}>
            <BlogContent />
        </Suspense>
    );
}
