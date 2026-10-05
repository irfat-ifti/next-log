"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthProvider"
import { addComment } from "@/app/lib/api/comment"
import ShowToast from "@/app/lib/toast"
import AvatarPlaceholder from "@/public/user.jpg"
import { serverTimestamp } from "firebase/firestore"
import Image from "next/image"
import { span } from "framer-motion/client"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import ConfirmationModal from "@/app/components/ConfirmationModal"
import { deleteCommentById } from "@/app/lib/api/comment"

const Comments = ({ blog, comments }) => {
    const { user, profile, loading } = useAuth()
    const [commentList, setCommentList] = useState(comments)
    const [newComment, setNewComment] = useState('')
    const [mounted, setMounted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [deletingComment, setDeletingComment] = useState(false);

    useEffect(() => {
        setMounted(true)
        setCommentList(comments)
    }, [comments])

    const handleChange = (e) => {
        setNewComment(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) {
            ShowToast({ message: "Please login to comment", type: "error" });
            return
        }
        if (!newComment) {
            ShowToast({ message: "Please enter a comment", type: "error" });
            return
        }
        const newCommentData = {
            postId: blog.id,
            content: newComment,
            author: {
                uid: user.uid,
                name: profile.name || user.displayName,
                avatar: profile.avatar || user.photoURL,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        console.log("newCommentData", newCommentData);
        setSubmitting(true);
        const result = await addComment(newCommentData);
        setSubmitting(false);
        if (result.status) {
            setCommentList((prev) => [newCommentData, ...prev]);
            setNewComment("");
        } else {
            ShowToast({ message: "Failed to add comment", type: "error" });
        }
    }
    const requestDeleteComment = (commentId) => {
        setCommentToDelete(commentId);
    };

    const confirmDeleteComment = async () => {
        if (!commentToDelete) return;
        try {
            setDeletingComment(true);
            const result = await deleteCommentById(
                commentToDelete,
                user?.uid,
                blog?.author?.uid,
                user?.role
            );
            if (result.status) {
                setCommentList((prev) => prev.filter((comment) => comment.id !== commentToDelete));
                ShowToast({ message: "Comment deleted successfully", type: "success" });
                setCommentToDelete(null);
            } else {
                ShowToast({ message: "Failed to delete comment", type: "error" });
            }
        } catch (error) {
            ShowToast({ message: "Failed to delete comment", type: "error" });
        } finally {
            setDeletingComment(false);
        }
    };
    function timeAgo(timestamp) {
        if (!timestamp) return "";

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const diff = Math.floor((Date.now() - date.getTime()) / 1000);

        if (diff < 60) {
            return "just now";
        }

        const minutes = Math.floor(diff / 60);

        if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
        }

        const days = Math.floor(hours / 24);

        if (days < 30) {
            return `${days} day${days !== 1 ? "s" : ""} ago`;
        }

        const months = Math.floor(days / 30);

        if (months < 12) {
            return `${months} month${months !== 1 ? "s" : ""} ago`;
        }

        const years = Math.floor(days / 365);

        return `${years} year${years !== 1 ? "s" : ""} ago`;
    }



    return (
        <section className="flex flex-col gap-6 pt-4">
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <span>Discussion</span>

                    <span
                        className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-blue-600"
                        id="commentsCountLabel"
                    >
                        {commentList?.length || 0} {commentList?.length > 1 ? "Comments" : "Comment"}
                    </span>
                </h3>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : !user ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-8 text-center shadow-sm">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-9 4 3.5-3H17a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h.5L6 20Z"
                            />
                        </svg>
                    </div>

                    <p className="text-sm font-semibold text-gray-700">
                        You must login to comment.
                    </p>
                </div>
            ) : blog.allowComments ? (
                <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-sm">
                            <Image
                                alt="Current User Avatar"
                                fill
                                sizes="36px"
                                className="object-cover"
                                src={profile?.avatar || user?.photoURL || AvatarPlaceholder.src}
                            />
                        </div>

                        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
                            <textarea
                                value={newComment}
                                onChange={handleChange}
                                className="w-full resize-y rounded-lg p-3 text-base placeholder:text-gray-500 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="newCommentInput"
                                placeholder="Share your thoughts or ask a question..."
                                rows={3}
                            />

                            <div className="flex flex-col justify-between gap-2 pt-1 sm:flex-row sm:items-center">
                                <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                    <span className="material-symbols-outlined text-[16px]">
                                        info
                                    </span>
                                    Markdown supported. Be respectful and constructive.
                                </span>

                                <button
                                    className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    id="submitCommentBtn"
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? <LoadingSpinner size={16} color="#fff" inline={true} label="Submitting..." /> : "Submit Comment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-8 text-center shadow-sm">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-9 4 3.5-3H17a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h.5L6 20Z"
                            />
                        </svg>
                    </div>

                    <p className="text-sm font-semibold text-gray-700">
                        Comments are currently turned off
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
                        The author has disabled comments for this post.
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-4" id="commentsContainer">
                {commentList.map((comment, idx) => (
                    <div key={idx} className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Image src={comment.author.avatar || AvatarPlaceholder.src} alt="" width={36} height={36} className="rounded-full" />

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {comment.author.name}
                                        </span>

                                        <span className="text-xs font-medium text-gray-500">
                                            · {mounted ? timeAgo(comment.createdAt) : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {(
                                user?.uid === comment.author?.uid ||
                                user?.uid === blog?.author?.uid ||
                                user?.role === "admin"
                            ) && (
                                    <button
                                        className="rounded p-1 text-gray-500 transition-colors hover:text-red-400 cursor-pointer"
                                        title="Delete comment"
                                        type="button"
                                        onClick={() => requestDeleteComment(comment.id)}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            Delete
                                        </span>
                                    </button>
                                )}

                        </div>

                        <p className="pl-11 text-base text-gray-900">
                            {comment.content}
                        </p>
                    </div>
                ))}
            </div>

            {/* Delete Comment Confirmation Modal */}
            <ConfirmationModal
                isOpen={Boolean(commentToDelete)}
                onClose={() => !deletingComment && setCommentToDelete(null)}
                onConfirm={confirmDeleteComment}
                title="Delete Comment"
                message="Are you sure you want to delete this comment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                icon="delete"
                isLoading={deletingComment}
            />
        </section>
    );
}

export default Comments;
