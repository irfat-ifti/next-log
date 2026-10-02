"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import LeftColumn from "@/app/dashboard/create-post/components/LeftColumn";
import RightColumn from "@/app/dashboard/create-post/components/RightColumn";
import { getPostById, updatePost } from "@/app/lib/api/post";
import ShowToast from "@/app/lib/toast";
import { useAuth } from "@/app/context/AuthProvider";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { sanitizeSlug, isSlugAvailable } from "@/app/lib/slug";

const EditPostPage = () => {
    const params = useParams();
    const router = useRouter();
    const postId = params?.id;
    const { user, profile } = useAuth();

    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const [content, setContent] = useState({ html: "", json: null });
    const [initialEditorContent, setInitialEditorContent] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [originalSlug, setOriginalSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [category, setCategory] = useState("");
    const [author, setAuthor] = useState(null);
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
    const [slugAvailable, setSlugAvailable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);
    // Increments after data loads so LeftColumn/RightColumn remount with correct data
    const [dataVersion, setDataVersion] = useState(0);

    // Fetch existing post details
    useEffect(() => {
        if (!postId) return;

        let isMounted = true;

        async function fetchPost() {
            setFetching(true);
            setFetchError(null);

            try {
                const res = await getPostById(postId);

                if (!res?.status || !res?.data) {
                    throw new Error(res?.errorMessage || "Post not found");
                }

                if (isMounted) {
                    const post = res.data;

                    setTitle(post.title || "");
                    setSlug(post.slug || "");
                    setOriginalSlug(post.slug || "");
                    setExcerpt(post.excerpt || "");
                    setCategory(post.category || "");
                    setAuthor(post.author || null);
                    setTags(Array.isArray(post.tags) ? post.tags : []);
                    setFeaturedImage(post.featuredImage || null);
                    setIsFeatured(Boolean(post.isFeatured));
                    setStatus(post.status || "published");
                    setPublishDate(post.publishDate || "");
                    setMetaTitle(post.metaTitle || "");
                    setMetaDesc(post.metaDesc || "");
                    setKeywords(Array.isArray(post.keywords) ? post.keywords : []);
                    setOgImage(post.ogImage || "");
                    setAllowComments(
                        post.allowComments !== undefined ? Boolean(post.allowComments) : true
                    );
                    setSlugAvailable(true);

                    // Set initial editor content
                    const editorVal = post.content || post.contentHtml || "";
                    setInitialEditorContent(editorVal);
                    setContent({
                        html: post.contentHtml || (typeof post.content === "string" ? post.content : ""),
                        json: typeof post.content === "object" ? post.content : null,
                    });

                    // Bump version so form columns remount with populated state
                    setDataVersion((v) => v + 1);
                }
            } catch (err) {
                console.error("fetchPost error:", err);
                if (isMounted) {
                    setFetchError(err.message || "Failed to load post");
                }
            } finally {
                if (isMounted) {
                    setFetching(false);
                }
            }
        }

        fetchPost();

        return () => {
            isMounted = false;
        };
    }, [postId]);

    const handleUpdate = async (actionType = "published") => {
        if (!title.trim()) {
            ShowToast({
                message: "Please enter a post title before saving",
                type: "warning",
            });
            return;
        }

        const cleanSlug = sanitizeSlug(slug || title);
        if (!cleanSlug) {
            ShowToast({
                message: "Please enter a valid title or slug",
                type: "warning",
            });
            return;
        }

        if (slugAvailable === "checking") {
            ShowToast({
                message: "Please wait while the slug is being checked.",
                type: "warning",
            });
            return;
        }

        if (slugAvailable === false) {
            ShowToast({
                message: "The chosen slug is already taken. Please enter a unique slug.",
                type: "error",
            });
            return;
        }

        if (!excerpt.trim()) {
            ShowToast({
                message: "Please enter a post summary before saving",
                type: "warning",
            });
            return;
        }

        try {
            setLoading(true);
            setLoadingAction(actionType);

            // Double check uniqueness if changed from original
            if (cleanSlug !== originalSlug) {
                const isUnique = await isSlugAvailable("posts", cleanSlug, postId);
                if (!isUnique) {
                    setSlugAvailable(false);
                    ShowToast({
                        message: "The slug is already taken. Please choose a unique slug.",
                        type: "error",
                    });
                    return;
                }
            }

            const postData = {
                title: title.trim(),
                slug: cleanSlug,
                excerpt: excerpt.trim(),
                content: content.json || content.html || initialEditorContent || "",
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
                author: author || {
                    uid: user?.uid,
                    name: profile?.name || user?.displayName,
                    avatar: profile?.avatar || user?.photoURL,
                    bio: profile?.bio || "",
                },
                allowComments: Boolean(allowComments),
            };

            const result = await updatePost(postId, postData);

            if (!result?.status) {
                throw new Error(result?.errorMessage || "Failed to update post");
            }

            ShowToast({
                message:
                    actionType === "draft"
                        ? "Draft saved successfully!"
                        : "Post updated successfully!",
                type: "success",
            });

            // Redirect back to dashboard posts list
            router.push("/dashboard/posts");
        } catch (error) {
            console.error("handleUpdate error:", error);
            ShowToast({
                message: error.message || "Failed to update post",
                type: "error",
            });
        } finally {
            setLoading(false);
            setLoadingAction(null);
        }
    };

    if (fetching) {
        return <LoadingSpinner fullScreen label="Loading post data..." size={44} />;
    }

    if (fetchError) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] px-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md text-center">
                    <h2 className="text-base font-semibold mb-1">Could not load post</h2>
                    <p className="text-sm text-red-600 mb-4">{fetchError}</p>
                    <Link
                        href="/dashboard/posts"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                        Back to Posts
                    </Link>
                </div>
            </div>
        );
    }

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
                        Edit Post
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Update and manage your post content
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {/* Save Draft */}
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        type="button"
                        disabled={loading}
                        onClick={() => handleUpdate("draft")}
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

                    {/* Update / Publish */}
                    <button
                        className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        type="button"
                        disabled={loading}
                        onClick={() => handleUpdate(status || "published")}
                    >
                        {loading && loadingAction !== "draft" ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Updating...</span>
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
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                                <span>Update Post</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Form */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <LeftColumn
                        key={`left-${postId}-${dataVersion}`}
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
                        slugAvailable={slugAvailable}
                        setSlugAvailable={setSlugAvailable}
                        initialContent={initialEditorContent}
                        isEdit={true}
                        currentPostId={postId}
                    />
                    <RightColumn
                        key={`right-${postId}-${dataVersion}`}
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

export default EditPostPage;
