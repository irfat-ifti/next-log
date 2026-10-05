"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthProvider";
import { getPostsByAuthorUid } from "@/app/lib/api/post";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function DashboardOverviewPage() {
    const { user, profile } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) return;
        let isMounted = true;

        async function fetchDashboardData() {
            setLoading(true);
            try {
                const res = await getPostsByAuthorUid(user.uid);
                if (isMounted && res.status) {
                    setPosts(res.data || []);
                }
            } catch (err) {
                console.error("Dashboard data error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchDashboardData();
        return () => {
            isMounted = false;
        };
    }, [user?.uid]);

    const displayName = profile?.name || user?.displayName || "Author";
    const publishedCount = posts.filter((p) => p.status === "published").length;
    const draftCount = posts.filter((p) => p.status === "draft").length;
    const recentPosts = posts.slice(0, 5);

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-md sm:p-8">
                <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="capitalize">{profile?.role || "Author"} Workspace</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Welcome back, {displayName}!
                        </h1>
                        <p className="max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
                            Track your articles, manage published content, and draft your next great story.
                        </p>
                    </div>

                    <div className="flex shrink-0 gap-3">
                        <Link
                            href="/dashboard/create-post"
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>Write Post</span>
                        </Link>
                    </div>
                </div>

                {/* Decorative background glow */}
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Posts */}
                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Total Articles</span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <span className="material-symbols-outlined text-[22px]">article</span>
                        </span>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold tracking-tight text-gray-900">
                            {loading ? "..." : posts.length}
                        </span>
                        <p className="mt-1 text-xs text-gray-400">Created across all time</p>
                    </div>
                </div>

                {/* Published */}
                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Published</span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <span className="material-symbols-outlined text-[22px]">check_circle</span>
                        </span>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold tracking-tight text-emerald-600">
                            {loading ? "..." : publishedCount}
                        </span>
                        <p className="mt-1 text-xs text-gray-400">Live for community readers</p>
                    </div>
                </div>

                {/* Drafts */}
                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Drafts</span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <span className="material-symbols-outlined text-[22px]">draft</span>
                        </span>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold tracking-tight text-amber-600">
                            {loading ? "..." : draftCount}
                        </span>
                        <p className="mt-1 text-xs text-gray-400">Works in progress</p>
                    </div>
                </div>

                {/* Author Profile */}
                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Account Role</span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <span className="material-symbols-outlined text-[22px]">badge</span>
                        </span>
                    </div>
                    <div className="mt-4">
                        <span className="text-2xl font-bold tracking-tight text-gray-900 capitalize">
                            {profile?.role || "Author"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Articles Section */}
            <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:px-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Recent Articles</h2>
                        <p className="text-xs text-gray-500">Your latest written articles</p>
                    </div>
                    <Link
                        href="/dashboard/posts"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        <span>View all</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="p-12">
                        <LoadingSpinner size={36} label="Loading recent posts..." />
                    </div>
                ) : recentPosts.length === 0 ? (
                    <div className="p-10 text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-300">note_stack</span>
                        <p className="mt-2 text-sm text-gray-500">No articles created yet.</p>
                        <Link
                            href="/dashboard/create-post"
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            <span>Start writing</span>
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recentPosts.map((post) => (
                            <div
                                key={post.id}
                                className="flex flex-col gap-3 p-5 transition-colors hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600">
                                            {post.category || "General"}
                                        </span>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                                                post.status === "published"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-amber-50 text-amber-700"
                                            }`}
                                        >
                                            {post.status || "draft"}
                                        </span>
                                    </div>
                                    <h3 className="mt-1.5 truncate text-sm font-semibold text-gray-900">
                                        {post.title}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-gray-400">
                                        {post.publishDate
                                            ? new Date(post.publishDate).toLocaleDateString("en-US", {
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              })
                                            : "Unpublished"}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <Link
                                        href={`/dashboard/posts/edit/${post.id}`}
                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                        <span>Edit</span>
                                    </Link>
                                    {post.slug && (
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                                            <span>View</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
