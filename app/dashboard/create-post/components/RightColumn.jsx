'use client';

const RightColumn = ({
    metaTitle,
    setMetaTitle,
    metaDesc,
    setMetaDesc,
    keywords,
    setKeywords,
    ogImage,
    setOgImage,
    allowComments,
    setAllowComments,
    status,
    setStatus,
    publishDate,
    setPublishDate,
}) => {
    return (
        <div className="lg:col-span-4 space-y-6">
            {/* Card: Post Settings */}
            <section
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5"
                data-purpose="post-settings-sidebar"
            >
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <span className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Post Settings</h2>
                </div>

                {/* Status Selector */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Status
                    </label>
                    <div className="relative">
                        <select
                            value={status || "published"}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 shadow-sm bg-white outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>

                {/* Published At DateTime */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Published At
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            </svg>
                        </span>
                        <input
                            className="w-full pl-9 pr-3 text-xs text-slate-700 font-mono border border-slate-200 rounded-lg focus:border-blue-500 outline-none py-2"
                            type="datetime-local"
                            value={publishDate || ""}
                            onChange={(e) => setPublishDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Meta Title Field with Counter */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                            htmlFor="meta-title"
                        >
                            Meta Title
                        </label>
                        <span className="text-[11px] font-medium text-slate-400">
                            {(metaTitle || "").length}/60
                        </span>
                    </div>
                    <input
                        className="w-full border border-slate-200 text-sm font-medium text-slate-900 rounded-lg py-2.5 px-3.5 outline-none focus:border-blue-500 transition"
                        id="meta-title"
                        placeholder="SEO meta title"
                        value={metaTitle || ""}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        type="text"
                    />
                </div>

                {/* Meta Description Field with Counter */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                            htmlFor="meta-desc"
                        >
                            Meta Description
                        </label>
                        <span className="text-[11px] font-medium text-slate-400">
                            {(metaDesc || "").length}/160
                        </span>
                    </div>
                    <textarea
                        className="w-full border border-slate-200 text-sm font-medium text-slate-900 rounded-lg py-2.5 px-3.5 outline-none focus:border-blue-500 resize-none transition"
                        id="meta-desc"
                        rows={3}
                        placeholder="SEO meta description for search engines"
                        value={metaDesc || ""}
                        onChange={(e) => setMetaDesc(e.target.value)}
                    />
                </div>

                {/* Keywords Chips Area */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Keywords
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 rounded-lg bg-slate-50/50 min-h-10 items-center">
                        {Array.isArray(keywords) &&
                            keywords.map((kw, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 rounded font-medium"
                                >
                                    {kw}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setKeywords(
                                                keywords.filter((_, i) => i !== idx)
                                            )
                                        }
                                        className="hover:text-blue-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        <input
                            type="text"
                            placeholder="Add keyword + Enter"
                            className="flex-1 min-w-28 bg-transparent text-xs text-slate-700 outline-none"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === ",") {
                                    e.preventDefault();
                                    const val = e.currentTarget.value.trim().replace(/^,+|,+$/g, "");
                                    if (val && !keywords?.includes(val)) {
                                        setKeywords([...(keywords || []), val]);
                                        e.currentTarget.value = "";
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* OG Image Box */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        OG Image URL (Optional)
                    </label>
                    <input
                        type="text"
                        placeholder="https://example.com/og-image.jpg"
                        value={ogImage || ""}
                        onChange={(e) => setOgImage(e.target.value)}
                        className="w-full border border-slate-200 text-xs text-slate-800 rounded-lg py-2 px-3 outline-none focus:border-blue-500"
                    />
                </div>
            </section>

            {/* Card: Related Posts */}
            <section
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4"
                data-purpose="related-posts-card"
            >
                <div className="flex items-center gap-2 pb-2">
                    <span className="p-1 rounded-md bg-blue-50 text-blue-600">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Related Posts</h2>
                </div>

                {/* Search Filter Field */}
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                    </span>
                    <input
                        className="w-full pl-8 text-xs text-slate-700 border border-slate-200 rounded-lg focus:border-blue-500 outline-none py-1.5"
                        placeholder="Search related posts..."
                        type="text"
                    />
                </div>

                {/* Post Checkbox List */}
                <div className="space-y-3 pt-1">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            defaultChecked
                            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            type="checkbox"
                        />
                        <div className="leading-snug">
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                Understanding React Server Components
                            </p>
                            <p className="text-[11px] text-slate-400">
                                /blog/understanding-react-server-components
                            </p>
                        </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            type="checkbox"
                        />
                        <div className="leading-snug">
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                Next.js Dynamic Routing Explained
                            </p>
                            <p className="text-[11px] text-slate-400">
                                /blog/nextjs-dynamic-routing-explained
                            </p>
                        </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            type="checkbox"
                        />
                        <div className="leading-snug">
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                Getting Started with TypeScript
                            </p>
                            <p className="text-[11px] text-slate-400">
                                /blog/getting-started-typescript
                            </p>
                        </div>
                    </label>
                </div>
            </section>

            {/* Card: Comments Switch Setting */}
            <section
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between"
                data-purpose="comments-setting-card"
            >
                <div className="flex items-start gap-3">
                    <span className="p-1 rounded-md bg-blue-50 text-blue-600 mt-0.5">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                    </span>
                    <div>
                        <h2 className="text-xs font-bold text-slate-900">Comments</h2>
                        <p className="text-[11px] text-slate-500">
                            Allow comments on this post
                        </p>
                    </div>
                </div>

                {/* Active Toggle Button */}
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={Boolean(allowComments)}
                        onChange={(e) => setAllowComments(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
            </section>
        </div>
    );
};

export default RightColumn;
