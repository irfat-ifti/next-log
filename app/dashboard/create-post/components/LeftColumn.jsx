'use client';

import { useEffect, useMemo, useState, useRef } from "react";
import TextEditor from "@/app/dashboard/create-post/components/TextEditor";
import { getCategories } from "@/app/lib/api/category";
import { getTags } from "@/app/lib/api/tag";
import TagSelector from "@/app/dashboard/components/TagSelector";
import ShowToast from "@/app/lib/toast";
import { isSlugAvailable, sanitizeSlug } from "@/app/lib/slug";

const LeftColumn = ({
    setContent,
    title,
    setTitle,
    slug,
    setSlug,
    excerpt,
    setExcerpt,
    category,
    setCategory,
    tags,
    setTags,
    featuredImage,
    setFeaturedImage,
    isFeatured,
    setIsFeatured,
    slugAvailable,
    setSlugAvailable,
    initialContent = "",
    isEdit = false,
    currentPostId = null,
}) => {
    const [categoryList, setCategoryList] = useState([]);
    const [tagList, setTagList] = useState([]);
    const debounceRef = useRef(null);
    const [isSlugChecking, setIsSlugChecking] = useState(false);

    // Derive image preview directly without cascading renders
    const imagePreview = useMemo(() => {
        if (!featuredImage) return null;
        if (typeof window !== "undefined" && featuredImage instanceof File) {
            return URL.createObjectURL(featuredImage);
        }
        if (typeof featuredImage === "string") {
            return featuredImage;
        }
        if (typeof featuredImage === "object" && (featuredImage.url || featuredImage.displayUrl)) {
            return featuredImage.displayUrl || featuredImage.url;
        }
        return null;
    }, [featuredImage]);

    // Clean up created object URL
    useEffect(() => {
        if (imagePreview && typeof imagePreview === "string" && imagePreview.startsWith("blob:")) {
            return () => {
                URL.revokeObjectURL(imagePreview);
            };
        }
    }, [imagePreview]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                if (typeof getCategories === "function") {
                    const res = await getCategories();
                    if (isMounted && res?.status && Array.isArray(res.data)) {
                        setCategoryList(res.data);
                    }
                }
                if (typeof getTags === "function") {
                    const res = await getTags();
                    if (isMounted && res?.status && Array.isArray(res.data)) {
                        setTagList(res.data);
                    }
                }
            } catch (err) {
                console.error(`Failed to load categories/tags:`, err);
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, []);

    const isSlugManualRef = useRef(Boolean(isEdit && slug));

    const debounceCheckAvailability = (value) => {
        clearTimeout(debounceRef.current);
        const clean = sanitizeSlug(value);

        if (!clean) {
            setSlugAvailable(null);
            setIsSlugChecking(false);
            return;
        }

        setIsSlugChecking(true);
        setSlugAvailable(null);

        debounceRef.current = setTimeout(() => {
            checkAvailability(clean);
        }, 400);
    };

    const handleTitleChange = (val) => {
        setTitle(val);

        // If in edit mode and slug already exists, or user manually customized slug, do not auto-overwrite
        if (isEdit && isSlugManualRef.current) {
            return;
        }

        if (!isSlugManualRef.current) {
            // allowTrailingHyphen:true so that mid-word typing doesn't strip the hyphen separator
            // (e.g. "hello world" → "hello-world", not "hello" after first space)
            const nextGenerated = sanitizeSlug(val, { allowTrailingHyphen: true });
            setSlug(nextGenerated);
            debounceCheckAvailability(nextGenerated);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 5MB validation
        if (file.size > 5 * 1024 * 1024) {
            ShowToast({ message: "Image must be less than 5MB", type: "warning" });
            return;
        }

        // Image validation
        if (!file.type.startsWith("image/")) {
            ShowToast({ message: "Please select a valid image file", type: "warning" });
            return;
        }

        setFeaturedImage(file);
    };

    const handleRemoveImage = () => {
        setFeaturedImage(null);
        const fileInput = document.getElementById("featured-image");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleSlugChange = (e) => {
        const rawVal = e.target.value;

        // If user clears the slug completely, allow re-syncing from title
        if (!rawVal.trim()) {
            isSlugManualRef.current = false;
            setSlug("");
            setSlugAvailable(null);
            setIsSlugChecking(false);
            return;
        }

        isSlugManualRef.current = true;
        const sanitized = sanitizeSlug(rawVal, { allowTrailingHyphen: true });
        setSlug(sanitized);
        debounceCheckAvailability(sanitized);
    };

    const handleSlugBlur = () => {
        const finalSlug = sanitizeSlug(slug);
        if (finalSlug !== slug) {
            setSlug(finalSlug);
            debounceCheckAvailability(finalSlug);
        }
    };

    const checkAvailability = async (value) => {
        const clean = sanitizeSlug(value);
        if (!clean) {
            setIsSlugChecking(false);
            setSlugAvailable(null);
            return;
        }

        try {
            const available = await isSlugAvailable("posts", clean, currentPostId);
            setSlugAvailable(available);
        } catch (error) {
            console.error("Slug availability check failed:", error);
            setSlugAvailable(false);
        } finally {
            setIsSlugChecking(false);
        }
    };

    return (
        <div className="lg:col-span-8 space-y-6">
            {/* Card: Basic Information */}
            <section
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5"
                data-purpose="basic-information-card"
            >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            </svg>
                        </span>
                        <h2 className="text-base font-bold text-slate-900">
                            Basic Information
                        </h2>
                    </div>

                    {/* Featured Post checkbox */}
                    {/* <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={Boolean(isFeatured)}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-700">
                            Featured Post
                        </span>
                    </label> */}
                </div>

                {/* Title Field */}
                <div>
                    <label
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                        htmlFor="post-title"
                    >
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter post title"
                        className="w-full border border-slate-200 text-sm font-medium text-slate-900 rounded-lg py-2.5 px-3.5 outline-none focus:border-blue-500 transition"
                        id="post-title"
                        type="text"
                    />
                </div>

                {/* Slug Field with Availability Badge */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                            htmlFor="post-slug"
                        >
                            Slug <span className="text-red-500">*</span>
                        </label>
                        {/* Only show badge when slug field has a value */}
                        {slug && slug.trim() ? (
                            isSlugChecking ? (
                                <span className="inline-flex items-center text-xs font-medium text-slate-500 gap-1.5">
                                    <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                    Checking...
                                </span>
                            ) : slugAvailable === true ? (
                                <span className="inline-flex items-center text-xs font-medium text-emerald-600 gap-1">
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M5 13l4 4L19 7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2.5"
                                        />
                                    </svg>
                                    Slug ready
                                </span>
                            ) : slugAvailable === false ? (
                                <span className="inline-flex items-center text-xs font-medium text-red-600 gap-1">
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M6 18L18 6M6 6l12 12"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                    Slug is already taken
                                </span>
                            ) : null
                        ) : null}
                    </div>
                    <input
                        value={slug}
                        onChange={handleSlugChange}
                        onBlur={handleSlugBlur}
                        placeholder="post-slug"
                        className="w-full border border-slate-200 text-sm font-medium text-slate-900 rounded-lg py-2.5 px-3.5 outline-none focus:border-blue-500 transition"
                        id="post-slug"
                        type="text"
                    />
                </div>

                {/* Excerpt Field */}
                <div>
                    <label
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                        htmlFor="post-excerpt"
                    >
                        Excerpt <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="w-full border border-slate-200 text-sm font-medium text-slate-900 rounded-lg py-2.5 px-3.5 outline-none focus:border-blue-500 resize-none transition"
                        id="post-excerpt"
                        rows={4}
                        placeholder="Write a short summary of your post"
                    />
                </div>

                {/* Meta Row: Category, Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Category Select */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-slate-200 text-sm font-medium text-slate-900 rounded-lg py-2.5 px-3.5 outline-none focus:border-blue-500 bg-white cursor-pointer"
                            >
                                <option value="">Uncategorized</option>
                                {categoryList?.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tags Multi-Select Input Box (synced with parent tags state) */}
                    <TagSelector
                        tagList={tagList}
                        selectedTags={tags || []}
                        setSelectedTags={setTags}
                    />
                </div>

                {/* Featured Image Upload Container */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Featured Image
                    </label>

                    <div className="border border-slate-200 rounded-xl p-4 bg-white">
                        {imagePreview ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                {/* Image preview */}
                                <div className="relative w-56 h-32 shrink-0">
                                    <img
                                        src={imagePreview}
                                        alt="Featured post preview"
                                        className="w-full h-full object-cover rounded-lg border border-slate-200"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-900 text-white text-sm hover:bg-red-600 transition shadow"
                                        title="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Info */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            document
                                                .getElementById("featured-image")
                                                ?.click()
                                        }
                                        className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700 transition"
                                    >
                                        Change Image
                                    </button>

                                    <p className="text-xs text-slate-500 mt-2">
                                        Recommended size: 1200 × 630 (16:9)
                                    </p>

                                    <p className="text-xs text-slate-500 mt-1">
                                        Max size: 5MB
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="featured-image"
                                className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition"
                            >
                                <svg
                                    className="w-8 h-8 text-slate-400 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M4 16l4.5-4.5a2 2 0 012.8 0L16 16m-2-2l1.5-1.5a2 2 0 012.8 0L20 14"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="16"
                                        rx="2"
                                        strokeWidth="1.5"
                                    />
                                </svg>

                                <span className="text-sm font-medium text-slate-600">
                                    Click to upload featured image
                                </span>

                                <span className="text-xs text-slate-400 mt-1">
                                    PNG, JPG, WEBP · Max 5MB
                                </span>
                            </label>
                        )}

                        <input
                            id="featured-image"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
            </section>

            {/* Card: Content Rich Editor */}
            <TextEditor onChange={setContent} initialContent={initialContent} />
        </div>
    );
};

export default LeftColumn;
