"use client";

import { useState } from "react";
import Link from "next/link";
import LeftColumn from "@/app/dashboard/create-post/components/LeftColumn";
import RightColumn from "@/app/dashboard/create-post/components/RightColumn";
import { createPost } from "@/app/lib/api/post";
import ShowToast from "@/app/lib/toast";

const Page = () => {
    const [content, setContent] = useState({ html: "", json: null });
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [category, setCategory] = useState("");
    const [author, setAuthor] = useState("");
    const [tags, setTags] = useState([]);
    const [featuredImage, setFeaturedImage] = useState(null);
    const [isFeatured, setIsFeatured] = useState(false);
    const [status, setStatus] = useState("published");
    const [publishDate, setPublishDate] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDesc, setMetaDesc] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [ogImage, setOgImage] = useState("");
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [allowComments, setAllowComments] = useState(true);

    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null); // 'publish' | 'draft'

    const resetForm = () => {
        setTitle("");
        setSlug("");
        setExcerpt("");
        setContent({ html: "", json: null });
        setCategory("");
        setTags([]);
        setFeaturedImage(null);
        setIsFeatured(false);
        setMetaTitle("");
        setMetaDesc("");
        setKeywords([]);
        setOgImage("");
        // Reset file input element if exists
        const fileInput = document.getElementById("featured-image");
        if (fileInput) fileInput.value = "";
    };

    const handlePublish = async (actionType = "published") => {
        if (!title.trim()) {
            ShowToast({
                message: "Please enter a post title before publishing",
                type: "warning",
            });
            return;
        }

        try {
            setLoading(true);
            setLoadingAction(actionType);

            // Auto-fallback slug from title if empty
            const generatedSlug =
                slug.trim() ||
                title
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-");

            const postData = {
                title: title.trim(),
                slug: generatedSlug,
                excerpt: excerpt.trim(),
                content: content.json || content.html || "",
                contentHtml: content.html || "",
                category: category || "",
                tags: Array.isArray(tags) ? tags : [],
                featuredImage,
                isFeatured: Boolean(isFeatured),
                status: actionType === "draft" ? "draft" : status || "published",
                publishDate: publishDate || new Date().toISOString(),
                metaTitle: metaTitle.trim(),
                metaDesc: metaDesc.trim(),
                keywords: Array.isArray(keywords) ? keywords : [],
                ogImage: ogImage || "",
                author: author || "Admin",
                allowComments: Boolean(allowComments),
            };

            const result = await createPost(postData);

            if (!result?.status) {
                throw new Error(result?.errorMessage || "Failed to create post");
            }

            ShowToast({
                message:
                    actionType === "draft"
                        ? "Draft saved successfully!"
                        : "Post published successfully!",
                type: "success",
            });

            resetForm();
        } catch (error) {
            console.error("handlePublish error:", error);
            ShowToast({
                message: error.message || "Failed to create post",
                type: "error",
            });
        } finally {
            setLoading(false);
            setLoadingAction(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0">
            {/* Header & Actions */}
            <div className="px-8 py-5 border-b border-slate-200/80 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link
                        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 mb-1.5 transition-colors"
                        href="/dashboard/posts"
                    >
                        <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                        Back to Posts
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Create New Post
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Write and publish a great story
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {/* Save Draft */}
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        type="button"
                        disabled={loading}
                        onClick={() => handlePublish("draft")}
                    >
                        {loading && loadingAction === "draft" ? (
                            <span className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg
                                className="w-4 h-4 text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            </svg>
                        )}
                        <span>{loading && loadingAction === "draft" ? "Saving..." : "Save Draft"}</span>
                    </button>

                    {/* Publish */}
                    <button
                        className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        type="button"
                        disabled={loading}
                        onClick={() => handlePublish("published")}
                    >
                        {loading && loadingAction === "published" ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Publishing...</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                <span>Publish</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Form */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <LeftColumn
                        setContent={setContent}
                        title={title}
                        setTitle={setTitle}
                        slug={slug}
                        setSlug={setSlug}
                        excerpt={excerpt}
                        setExcerpt={setExcerpt}
                        category={category}
                        setCategory={setCategory}
                        author={author}
                        setAuthor={setAuthor}
                        tags={tags}
                        setTags={setTags}
                        featuredImage={featuredImage}
                        setFeaturedImage={setFeaturedImage}
                        isFeatured={isFeatured}
                        setIsFeatured={setIsFeatured}
                    />
                    <RightColumn
                        metaTitle={metaTitle}
                        setMetaTitle={setMetaTitle}
                        metaDesc={metaDesc}
                        setMetaDesc={setMetaDesc}
                        keywords={keywords}
                        setKeywords={setKeywords}
                        ogImage={ogImage}
                        setOgImage={setOgImage}
                        relatedPosts={relatedPosts}
                        setRelatedPosts={setRelatedPosts}
                        allowComments={allowComments}
                        setAllowComments={setAllowComments}
                        status={status}
                        setStatus={setStatus}
                        publishDate={publishDate}
                        setPublishDate={setPublishDate}
                    />
                </div>
            </main>
        </div>
    );
};

export default Page;
