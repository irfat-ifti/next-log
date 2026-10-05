
"use client";

import { getPostsByAuthorUid, deletePost } from "@/app/lib/api/post";
import { useAuth } from "@/app/context/AuthProvider";
import { useState, useEffect } from "react";
import Link from "next/link";
import ShowToast from "@/app/lib/toast";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const INITIAL_POSTS_COUNT = 24;
const POSTS_BATCH_SIZE = 24;

const Page = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(INITIAL_POSTS_COUNT);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);

    useEffect(() => {
        if (!user?.uid) return;

        let isMounted = true;

        async function getPosts() {
            setLoading(true);

            try {
                const { data, status } = await getPostsByAuthorUid(user.uid);

                if (isMounted && status) {
                    setPosts(data || []);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        getPosts();

        return () => {
            isMounted = false;
        };
    }, [user?.uid]);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + POSTS_BATCH_SIZE);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;
        const postId = postToDelete.id;

        try {
            setDeletingId(postId);
            const res = await deletePost(postId);

            if (!res?.status) {
                throw new Error(res?.errorMessage || "Failed to delete post");
            }

            setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
            ShowToast({
                message: "Post deleted successfully!",
                type: "success",
            });
            setPostToDelete(null);
        } catch (error) {
            console.error("handleDelete error:", error);
            ShowToast({
                message: error.message || "Failed to delete post",
                type: "error",
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 w-full">
            <div className="mx-auto max-w-4xl">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            My Posts
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage and view your published posts.
                        </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        {posts.length} Posts
                    </span>
                </div>

                {loading ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-12 shadow-sm">
                        <LoadingSpinner size={42} label="Loading your posts..." />
                    </div>
                ) : posts.length === 0 ? (
                    /* Empty State */
                    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
                            <span className="material-symbols-outlined text-[28px]">article</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            No posts found
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                            You haven&apos;t created any articles yet. Share your knowledge with the community!
                        </p>
                        <Link
                            href="/dashboard/create-post"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            <span>Create Your First Post</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.slice(0, visibleCount).map((post) => (
                            <div
                                key={post.id}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-3 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                                {post.category || "Uncategorized"}
                                            </span>

                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${post.status === "published"
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-yellow-50 text-yellow-700"
                                                }`}>
                                                {post.status || "Draft"}
                                            </span>
                                        </div>

                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {post.title}
                                        </h2>

                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                                            {post.excerpt || "No excerpt available."}
                                        </p>

                                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                                            <span>
                                                By {post.author?.name || "Unknown"}
                                            </span>

                                            <span>
                                                {post.publishDate
                                                    ? new Date(post.publishDate).toLocaleDateString()
                                                    : "No date"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Link
                                            href={`/dashboard/posts/edit/${post.id}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                            <span>Edit</span>
                                        </Link>

                                        <button
                                            type="button"
                                            disabled={deletingId === post.id}
                                            onClick={() => setPostToDelete(post)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {deletingId === post.id ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                    <span>Deleting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    <span>Delete</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {posts.length > visibleCount && (
                            <div className="pt-4 flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleLoadMore}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                                >
                                    <span>Load More Posts</span>
                                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={Boolean(postToDelete)}
                onClose={() => !deletingId && setPostToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
                message={`Are you sure you want to delete "${postToDelete?.title || "this post"}"? This action cannot be undone.`}
                confirmText="Delete Post"
                cancelText="Keep Post"
                variant="danger"
                icon="delete"
                isLoading={Boolean(deletingId)}
            />
        </div>
    );
};

export default Page;
