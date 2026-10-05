"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getTags } from "@/app/lib/api/tag";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const TAGS_PER_PAGE = 24;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function TagsPage() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLetter, setSelectedLetter] = useState("ALL");
    const [sortBy, setSortBy] = useState("popular"); // 'popular' | 'alpha'

    // Fetch initial tags
    useEffect(() => {
        let isMounted = true;

        async function fetchInitialTags() {
            setLoading(true);
            setError(null);
            try {
                const res = await getTags({
                    pageSize: TAGS_PER_PAGE,
                    status: "Active",
                    orderByField: sortBy === "alpha" ? "name" : "posts",
                    orderDirection: sortBy === "alpha" ? "asc" : "desc",
                });

                if (isMounted) {
                    if (res.status) {
                        setTags(res.data || []);
                        setLastDoc(res.lastDoc || null);
                        setHasMore(Boolean(res.hasMore));
                    } else {
                        setError(res.errorMessage || "Failed to load tags");
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Something went wrong loading tags");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchInitialTags();

        return () => {
            isMounted = false;
        };
    }, [sortBy]);

    // Handle load more
    const handleLoadMore = async () => {
        if (loadingMore || !hasMore || !lastDoc) return;

        setLoadingMore(true);
        try {
            const res = await getTags({
                pageSize: TAGS_PER_PAGE,
                lastDoc,
                status: "Active",
                orderByField: sortBy === "alpha" ? "name" : "posts",
                orderDirection: sortBy === "alpha" ? "asc" : "desc",
            });

            if (res.status && Array.isArray(res.data)) {
                setTags((prev) => {
                    const existing = new Set(prev.map((t) => t.id));
                    const newItems = res.data.filter((t) => !existing.has(t.id));
                    return [...prev, ...newItems];
                });
                setLastDoc(res.lastDoc || null);
                setHasMore(Boolean(res.hasMore));
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Failed to load more tags:", err);
        } finally {
            setLoadingMore(false);
        }
    };

    // Filter tags by search and alphabet letter
    const filteredTags = useMemo(() => {
        return tags.filter((t) => {
            const name = (t.name || "").toLowerCase();
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || name.includes(q) || (t.description && t.description.toLowerCase().includes(q));

            const matchesLetter =
                selectedLetter === "ALL" ||
                name.startsWith(selectedLetter.toLowerCase());

            return matchesSearch && matchesLetter;
        });
    }, [tags, searchQuery, selectedLetter]);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 pt-24">
            <div className="mx-auto max-w-6xl px-4">
                {/* Hero Header */}
                <div className="mb-8 text-center max-w-2xl mx-auto">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                        <span className="material-symbols-outlined text-[16px]">tag</span>
                        <span>Topic Index</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        All Tags
                    </h1>
                    <p className="mt-2 text-base text-gray-500">
                        Explore articles by specific technical keywords, frameworks, and programming topics.
                    </p>
                </div>

                {/* Search & Sort Controls */}
                <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                    {/* Search Input */}
                    <div className="relative w-full sm:max-w-md">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
                            search
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find a tag (e.g. javascript, react, css)..."
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
                            Most Used
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
                    </div>
                </div>

                {/* Alphabetical Quick Filter Bar (Great for browsing thousands of tags) */}
                <div className="mb-8 flex items-center gap-1 overflow-x-auto rounded-xl bg-white p-2.5 shadow-sm border border-gray-100 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => setSelectedLetter("ALL")}
                        className={`h-7 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                            selectedLetter === "ALL"
                                ? "bg-blue-600 text-white"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                        ALL
                    </button>
                    {ALPHABET.map((char) => (
                        <button
                            key={char}
                            type="button"
                            onClick={() => setSelectedLetter(char)}
                            className={`h-7 w-7 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                                selectedLetter === char
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                            {char}
                        </button>
                    ))}
                </div>

                {/* Tags Grid */}
                {loading ? (
                    <LoadingSpinner size={46} label="Loading tags..." />
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
                ) : filteredTags.length === 0 ? (
                    <div className="rounded-2xl bg-white py-16 text-center shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-2">tag</span>
                        <h3 className="text-lg font-bold text-gray-900">No tags found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No tags matched your search or letter filter.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedLetter("ALL");
                            }}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {filteredTags.map((tag) => {
                            const tagName = tag.name || "tag";
                            const tagSlug = tag.slug || tagName.toLowerCase();
                            const postCount = Number(tag.posts) || 0;

                            return (
                                <Link
                                    key={tag.id || tagSlug}
                                    href={`/blog?tag=${encodeURIComponent(tagSlug)}`}
                                    className="group flex flex-col justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-100 transition-all hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
                                >
                                    <div className="flex items-start gap-1 font-semibold text-gray-900 group-hover:text-blue-600 transition truncate">
                                        <span className="text-blue-500 font-mono text-sm">#</span>
                                        <span className="truncate text-sm">{tagName}</span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                                        <span>{postCount} {postCount === 1 ? "article" : "articles"}</span>
                                        <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 text-blue-600 transition">
                                            arrow_forward
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Load More Button for Scale (Thousands of Tags) */}
                {!loading && !error && filteredTags.length > 0 && hasMore && (
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
                                    <span>Loading more tags...</span>
                                </>
                            ) : (
                                <>
                                    <span>Load More Tags</span>
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
