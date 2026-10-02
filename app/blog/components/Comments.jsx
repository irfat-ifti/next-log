"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthProvider"
import { addComment } from "@/app/lib/api/comment"
import ShowToast from "@/app/lib/toast"
import AvatarPlaceholder from "@/public/user.jpg"
import { serverTimestamp } from "firebase/firestore"
import Image from "next/image"

const Comments = ({ blog, comments }) => {
    const { user, profile } = useAuth()
    const [commentList, setCommentList] = useState(comments)
    const [newComment, setNewComment] = useState('')
    useEffect(() => {
        setCommentList(comments)
    }, [comments])
    const handleChange = (e) => {
        setNewComment(e.target.value)
    }
    const handleSubmit = (e) => {
        if (!user) {
            ShowToast("Please login to comment", "error")
            return
        }
        if (!newComment) {
            ShowToast("error", "Please enter a comment")
            return
        }
        e.preventDefault()
        const newCommentData = {
            postId: blog.id,
            content: newComment,
            author: {
                uid: user.uid,
                name: profile.name || user.displayName,
                avatar: profile.avatar || user.photoURL,
            },
            createdAt: new Date().toISOString(),
            updatedAt: serverTimestamp(),
        }
        addComment(newCommentData)
        setCommentList((prev) => [...prev, newCommentData])
        setNewComment("")
    }
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
            {/* Write a Comment Form Box */}
            {blog.allowComments ? (
                <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                        <img
                            alt="Current User Avatar"
                            className="h-9 w-9 shrink-0 rounded-full object-cover shadow-sm"
                            src={profile?.avatar || user?.photoURL || AvatarPlaceholder.src}
                        />

                        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
                            <textarea value={newComment} onChange={handleChange}
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
                                    className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:self-auto"
                                    id="submitCommentBtn"
                                    type="submit"
                                >
                                    Submit Comment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>) : (<>
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

                </>)}

            {/* Existing Comments Thread */}
            <div className="flex flex-col gap-4" id="commentsContainer">

                {/* Comment 1: Mark Davis */}
                {commentList.map((comment, idx) => (
                    <div key={idx} className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Image src={comment.author.avatar || AvatarPlaceholder.src} alt="" width={36} height={36} />

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {comment.author.name}
                                        </span>

                                        <span className="text-xs font-medium text-gray-500">
                                            · {timeAgo(comment.createdAt)}
                                        </span>
                                    </div>

                                    {/* <span className="text-xs font-medium text-gray-500">
                                        Frontend Architect
                                    </span> */}
                                </div>
                            </div>

                            <button
                                className="rounded p-1 text-gray-500 transition-colors hover:text-gray-900"
                                title="More actions"
                                type="button"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    more_horiz
                                </span>
                            </button>
                        </div>

                        <p className="pl-11 text-base text-gray-900">
                            {comment.content}
                        </p>

                        {/* <div className="flex items-center gap-4 pl-11 text-xs font-medium text-gray-500">
                            <button
                                className="flex items-center gap-1 transition-colors hover:text-blue-600"
                                type="button"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    thumb_up
                                </span>
                                <span>12</span>
                            </button>

                            <button
                                className="flex items-center gap-1 transition-colors hover:text-blue-600"
                                type="button"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    reply
                                </span>
                                <span>Reply</span>
                            </button>
                        </div> */}
                    </div>
                ))}
                <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
                                MD
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                        Mark Davis
                                    </span>

                                    <span className="text-xs font-medium text-gray-500">
                                        · 2 days ago
                                    </span>
                                </div>

                                <span className="text-xs font-medium text-gray-500">
                                    Frontend Architect
                                </span>
                            </div>
                        </div>

                        <button
                            className="rounded p-1 text-gray-500 transition-colors hover:text-gray-900"
                            title="More actions"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                more_horiz
                            </span>
                        </button>
                    </div>

                    <p className="pl-11 text-base text-gray-900">
                        Great breakdown of Server vs Client components! Super helpful for
                        anyone migrating from the Pages router. The architecture diagram
                        made the prop serialization flow instantly clear.
                    </p>

                    <div className="flex items-center gap-4 pl-11 text-xs font-medium text-gray-500">
                        <button
                            className="flex items-center gap-1 transition-colors hover:text-blue-600"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                thumb_up
                            </span>
                            <span>12</span>
                        </button>

                        <button
                            className="flex items-center gap-1 transition-colors hover:text-blue-600"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                reply
                            </span>
                            <span>Reply</span>
                        </button>
                    </div>
                </div>

                {/* Comment 2: Current User / Author with Delete Action */}
                {/* <div
                    className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-blue-600/20"
                    id="authorCommentRow"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <img
                                alt="Irfat Uddin Ifti"
                                className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-blue-600"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoJRoLUBfzYJH7jutrOGj7WYtAmZXx8kqRf8SDU4w9rKnr97y_xCoAuQpllOaBuaSKgbLkiywP5LNT8c8GW2meLxMblEUAw7rkZ2Q5d4M8lerop7NwkZebtIQoaZtrIRcyLXaqmMw7tI46NdafE_eOu1QwELIZWukifuUQWtqIZQQo7OAfHr515Qfxgf6cnWKHlG9b1nMGYbMK5FcAypuHNQvrPXDrzuo9YsyunX1GDhwSRUFl1xY"
                            />

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                        Irfat Uddin Ifti
                                    </span>

                                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-blue-600">
                                        Author
                                    </span>

                                    <span className="text-xs font-medium text-gray-500">
                                        · 1 day ago
                                    </span>
                                </div>

                                <span className="text-xs font-medium text-gray-500">
                                    Software Engineer
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                id="deleteAuthorCommentBtn"
                                title="Delete comment"
                                type="button"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    delete
                                </span>

                                <span className="hidden sm:inline">Delete</span>
                            </button>
                        </div>
                    </div>

                    <p className="pl-11 text-base text-gray-900">
                        Thanks Mark! In the next article we&apos;ll cover Server Actions with
                        form mutations and optimistic cache revalidations via{" "}
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-900">
                            revalidatePath()
                        </code>
                        . Stay tuned!
                    </p>

                    <div className="flex items-center gap-4 pl-11 text-xs font-medium text-gray-500">
                        <button
                            className="flex items-center gap-1 transition-colors hover:text-blue-600"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                thumb_up
                            </span>
                            <span>5</span>
                        </button>

                        <button
                            className="flex items-center gap-1 transition-colors hover:text-blue-600"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                reply
                            </span>
                            <span>Reply</span>
                        </button>
                    </div>
                </div> */}
            </div>
        </section>
    );
}

export default Comments;
