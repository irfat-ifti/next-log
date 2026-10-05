"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BlogCard from "@/app/components/BlogCard";
import { getPostsByAuthorUid } from "@/app/lib/api/post";
import { useAuth } from "@/app/context/AuthProvider";
import { getUserById } from "@/app/lib/api/auth";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function AuthorProfilePage({ params }) {
    const { uid } = use(params);
    const { user: authUser, profile: authProfile } = useAuth();

    const [authorInfo, setAuthorInfo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAuthorData() {
            if (!uid) return;
            try {
                setLoading(true);
                setError(null);

                // Fetch posts by this author uid
                const postsRes = await getPostsByAuthorUid(uid);
                const authorPosts = postsRes.status ? postsRes.data : [];
                setPosts(authorPosts);

                // If currently logged-in user is the author, get info directly from AuthProvider
                if (authUser && authUser.uid === uid) {
                    setAuthorInfo({
                        name: authProfile?.name || authUser?.displayName || "Author",
                        avatar: authProfile?.avatar || authUser?.photoURL || null,
                        bio: authProfile?.bio || "",
                        role: authProfile?.role || "Author",
                        socialLinks: authProfile?.socialLinks || {
                            x: authProfile?.x || "",
                            linkedin: authProfile?.linkedin || "",
                        },
                    });
                } else {
                    // Otherwise fetch author from Firestore or post fallback
                    const userRes = await getUserById(uid);
                    if (userRes.status && userRes.data) {
                        setAuthorInfo(userRes.data);
                    } else if (authorPosts.length > 0 && authorPosts[0].author) {
                        const pAuthor = authorPosts[0].author;
                        setAuthorInfo({
                            name: typeof pAuthor === "object" ? pAuthor.name : pAuthor,
                            avatar: typeof pAuthor === "object" ? pAuthor.avatar : null,
                            bio: typeof pAuthor === "object" ? pAuthor.bio : "",
                            role: "Author",
                            socialLinks: typeof pAuthor === "object" ? pAuthor.socialLinks || {} : {},
                        });
                    } else {
                        setAuthorInfo({
                            name: "Author",
                            avatar: null,
                            bio: "",
                            role: "Author",
                            socialLinks: {},
                        });
                    }
                }
            } catch (err) {
                console.error("Error loading author profile:", err);
                setError(err.message || "Failed to load author profile");
            } finally {
                setLoading(false);
            }
        }

        fetchAuthorData();
    }, [uid, authUser, authProfile]);

    const authorName = authorInfo?.name || "Author";
    const authorAvatar = authorInfo?.avatar || "/user.jpg";
    const authorBio = authorInfo?.bio || "";
    const authorRole = authorInfo?.role || "Author";
    const socialLinks = authorInfo?.socialLinks || {};

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 pt-24">
            <div className="mx-auto max-w-5xl px-4">
                {/* Back to Blog */}
                <div className="mb-6">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        <span>Back to all articles</span>
                    </Link>
                </div>

                {/* Author Info Card */}
                <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 sm:p-8">
                    {loading ? (
                        <LoadingSpinner size={36} label="Loading author profile..." />
                    ) : (
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start text-center sm:text-left">
                            {/* Avatar */}
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full shadow-sm ring-4 ring-gray-100">
                                <Image
                                    src={authorAvatar}
                                    alt={authorName}
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                                {authorName}
                                            </h1>
                                            <span
                                                className="material-symbols-outlined text-[20px] text-blue-600"
                                                title="Verified Author"
                                            >
                                                verified
                                            </span>
                                        </div>
                                        <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-wider text-blue-600">
                                            {authorRole}
                                        </span>
                                    </div>

                                    {/* Article count */}
                                    <div className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 self-center sm:self-start">
                                        <span className="material-symbols-outlined text-[16px]">article</span>
                                        <span>
                                            {posts.length} {posts.length === 1 ? "article" : "articles"}
                                        </span>
                                    </div>
                                </div>

                                {authorBio && (
                                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
                                        {authorBio}
                                    </p>
                                )}

                                {/* Social Connections */}
                                {(socialLinks.x || socialLinks.linkedin) && (
                                    <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
                                        {socialLinks.x && (
                                            <a
                                                href={socialLinks.x.startsWith("http") ? socialLinks.x : `https://${socialLinks.x}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                                <span>X / Twitter</span>
                                            </a>
                                        )}
                                        {socialLinks.linkedin && (
                                            <a
                                                href={socialLinks.linkedin.startsWith("http") ? socialLinks.linkedin : `https://${socialLinks.linkedin}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                </svg>
                                                <span>LinkedIn</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Posts Heading */}
                <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[22px] text-gray-700">menu_book</span>
                        <h2 className="text-xl font-bold text-gray-900">
                            Articles by {authorName}
                        </h2>
                    </div>
                    {!loading && (
                        <span className="text-xs font-medium text-gray-400">
                            Total {posts.length} article{posts.length === 1 ? "" : "s"}
                        </span>
                    )}
                </div>

                {/* Author's Posts */}
                {loading ? (
                    <LoadingSpinner size={42} label="Loading articles..." />
                ) : error ? (
                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                        <span className="material-symbols-outlined text-[48px] text-red-300">error</span>
                        <p className="mt-2 text-sm font-medium text-red-500">{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="rounded-2xl bg-white py-16 text-center shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-2">article</span>
                        <h3 className="text-lg font-bold text-gray-900">No articles found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            This author has not published any articles yet.
                        </p>
                        <Link
                            href="/blog"
                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
                        >
                            Explore other articles
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} variant="vertical" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

