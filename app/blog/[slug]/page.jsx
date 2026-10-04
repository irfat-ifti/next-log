import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from "@/app/lib/api/post";
import { notFound } from "next/navigation";
import { cache } from "react";
import Comments from "@/app/blog/components/Comments";
import { getCommentsByPostId } from "@/app/lib/api/comment";


const getPost = cache(async (slug) => {
    return await getPostBySlug(slug)
})
export async function generateMetadata({ params }) {
    const { slug } = await params
    const res = await getPost(slug)
    const blog = res?.data
    if (!blog) {
        notFound();
    }
    return {
        title: blog.metaTitle || blog.title,
        description: blog.metaDesc || blog.excerpt,

        openGraph: {
            title: blog.metaTitle || blog.title,
            description: blog.metaDesc || blog.excerpt,
            images: blog?.featuredImage?.url ? [{ url: blog?.featuredImage?.url, width: 800, height: 600, alt: blog.title }] : [],
            type: "article",
        },

        twitter: {
            card: "summary_large_image",
            title: blog.metaTitle || blog.title,
            description: blog.metaDesc || blog.excerpt,
            images: blog?.featuredImage?.url ? [{ url: blog?.featuredImage?.url, width: 800, height: 600, alt: blog.title }] : [],
        },
    };
}


const Page = async ({ params }) => {
    const { slug } = await params;
    const res = await getPost(slug);
    const blog = res?.data;
    if (!blog) {
        notFound();
    }
    const serializeFirestoreData = (data) => {
        if (data == null) return data;

        if (typeof data?.toDate === "function") {
            return data.toDate().toISOString();
        }

        if (Array.isArray(data)) {
            return data.map(serializeFirestoreData);
        }

        if (typeof data === "object") {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    serializeFirestoreData(value),
                ])
            );
        }

        return data;
    };

    let comments = [];
    if (blog?.id) {
        const commentsRes = await getCommentsByPostId(blog.id);
        comments = commentsRes?.data || [];
    }

    const serializedBlog = serializeFirestoreData(blog);
    const serializedComments = serializeFirestoreData(comments);


    const authorName =
        typeof blog?.author === "object" ? blog?.author?.name : "";

    const authorAvatar =
        typeof blog?.author === "object" && blog?.author?.avatar
            ? blog?.author?.avatar
            : null;

    const authorBio =
        typeof blog?.author === "object" && blog?.author?.bio
            ? blog?.author?.bio
            : "";

    const publishedDate = blog?.publishDate
        ? new Date(blog.publishDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : blog?.createdAt?.seconds
            ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })
            : blog?.publishedAt || "Recently";

    const readingTime = blog?.readTime || "5 min read";
    const postDescription = blog?.excerpt || blog?.description || "";
    const categoryName = blog?.category || "Uncategorized";

    return (
        <div className='my-25'>
            <div className="mx-auto w-full max-w-6xl px-4">
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-sm text-gray-500"
                >
                    <Link
                        className="flex items-center gap-1 transition-colors hover:text-gray-900"
                        href="/"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            home
                        </span>
                        <span>Home</span>
                    </Link>

                    <span className="select-none text-gray-400">/</span>

                    <Link
                        className="transition-colors hover:text-gray-900"
                        href="/blog"
                    >
                        Blog
                    </Link>

                    <span className="select-none text-gray-400">/</span>

                    <span
                        className="max-w-60 truncate text-sm font-medium text-gray-900 sm:max-w-md"
                        title={blog?.title}
                    >
                        {blog?.title}
                    </span>
                </nav>
                <header className="flex flex-col gap-4 mt-8">
                    {/* Category & Subcategory */}
                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-blue-600">
                            {categoryName}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-gray-400" />

                        <span className="text-xs font-medium text-gray-500">
                            Architecture &amp; Performance
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                        {blog?.title}
                    </h1>

                    {/* Description */}
                    <p className="text-base leading-relaxed text-gray-500 sm:text-lg">
                        {postDescription}
                    </p>

                    {/* Author Metadata & Social Share Row */}
                    <div className="flex flex-col justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                        {/* Author */}
                        <div className="flex items-center gap-3">
                            {authorAvatar ? (
                                <img
                                    alt={authorName}
                                    className="h-11 w-11 rounded-full object-cover shadow-sm ring-2 ring-white"
                                    src={authorAvatar}
                                />
                            ) : (
                                <div className="h-11 w-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-white">
                                    {authorName.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {authorName}
                                    </span>

                                    <span
                                        className="material-symbols-outlined text-[18px] text-blue-600"
                                        title="Verified Author"
                                    >
                                        verified
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>Published on {publishedDate}</span>

                                    <span className="inline-block h-1 w-1 rounded-full bg-gray-400" />

                                    <span className="flex items-center gap-0.5">
                                        <span className="material-symbols-outlined text-[14px]">
                                            schedule
                                        </span>
                                        {readingTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Share Actions */}
                        <div className="flex items-center gap-2">
                            {/* X / Twitter */}
                            <button
                                aria-label="Share on X"
                                className="flex items-center justify-center rounded-lg bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900"
                                title="Share on Twitter / X"
                                type="button"
                            >
                                <svg
                                    className="h-4 w-4 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </button>

                            {/* LinkedIn */}
                            <button
                                aria-label="Share on LinkedIn"
                                className="flex items-center justify-center rounded-lg bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900"
                                title="Share on LinkedIn"
                                type="button"
                            >
                                <svg
                                    className="h-4 w-4 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.89 0-1.6.72-1.6 1.6 0 .89.72 1.6 1.6 1.6.89 0 1.6-.71 1.6-1.6 0-.88-.71-1.6-1.6-1.6Z" />
                                </svg>
                            </button>

                            {/* Copy Link */}
                            <button
                                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
                                id="copyLinkBtn"
                                type="button"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    link
                                </span>

                                <span id="copyLinkText">Copy Link</span>
                            </button>
                        </div>
                    </div>
                </header>
                <Image src={blog?.featuredImage?.url || "https://images.pexels.com/photos/28216688/pexels-photo-28216688.png?_gl=1*1ddrzpr*_ga*MTg0Mjc0ODg1My4xNzkwODc0Nzcw*_ga_8JE65Q40S6*czE3OTA4NzQ3NjkkbzEkZzEkdDE3OTA4NzQ3OTUkajM0JGwwJGgw"} alt={blog?.title} width={0}
                    height={0}
                    sizes="100vw" className="mt-10 w-full h-auto rounded-2xl object-cover shadow-md" />
                <article className="mt-10 flex flex-col gap-6 text-base leading-8 text-gray-700 sm:text-lg">
                    {!blog.content ? (
                        <div
                            className="blog-content flex flex-col gap-6"
                            dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
                        />
                    ) : (
                        blog?.content?.content?.map((node, index) => {
                            switch (node.type) {
                                case "paragraph":
                                    return (
                                        <p key={index}>
                                            {node.content?.map((item, i) => (
                                                item.marks?.some((m) => m.type === "bold") ? (
                                                    <strong key={i}>{item.text}</strong>
                                                ) : (
                                                    <span key={i}>{item.text}</span>
                                                )
                                            ))}
                                        </p>
                                    );

                                case "heading":
                                    if (node.attrs?.level === 1) {
                                        return (
                                            <h1
                                                key={index}
                                                className="text-3xl font-bold leading-tight tracking-[-0.02em] text-gray-950 md:text-4xl"
                                            >
                                                {node.content?.map((item, i) => (
                                                    item.marks?.some((m) => m.type === "bold") ? (
                                                        <strong key={i}>{item.text}</strong>
                                                    ) : (
                                                        <span key={i}>{item.text}</span>
                                                    )
                                                ))}
                                            </h1>
                                        );
                                    }

                                    if (node.attrs?.level === 2) {
                                        return (
                                            <h2
                                                key={index}
                                                className=" text-2xl font-bold leading-tight tracking-[-0.02em] text-gray-950 md:text-3xl"
                                            >
                                                {node.content?.map((item, i) => (
                                                    item.marks?.some((m) => m.type === "bold") ? (
                                                        <strong key={i}>{item.text}</strong>
                                                    ) : (
                                                        <span key={i}>{item.text}</span>
                                                    )
                                                ))}
                                            </h2>
                                        );
                                    }

                                    if (node.attrs?.level === 3) {
                                        return (
                                            <h3
                                                key={index}
                                                className=" text-xl font-semibold leading-tight tracking-[-0.01em] text-gray-900  md:text-2xl"
                                            >
                                                {node.content?.map((item, i) => (
                                                    item.marks?.some((m) => m.type === "bold") ? (
                                                        <strong key={i}>{item.text}</strong>
                                                    ) : (
                                                        <span key={i}>{item.text}</span>
                                                    )
                                                ))}
                                            </h3>
                                        );
                                    }

                                    return null;


                                case "codeBlock":
                                    return (
                                        <pre
                                            key={index}
                                            className="my-6 overflow-x-auto rounded-xl border border-zinc-800 bg-[#0d1117] p-5 text-[13px] leading-6 text-zinc-200 shadow-lg"
                                        >
                                            <code className="font-mono">
                                                {node.content?.map((item) => item.text).join("")}
                                            </code>
                                        </pre>
                                    );


                                case "bulletList":
                                    return (
                                        <ul key={index}>
                                            {node.content?.map((item, itemIndex) => (
                                                <li key={itemIndex}>
                                                    {item.content?.map((paragraph, paragraphIndex) => (
                                                        <span key={paragraphIndex}>
                                                            {paragraph.content?.map((text, textIndex) => (
                                                                <span key={textIndex}>
                                                                    {text.text}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    ))}
                                                </li>
                                            ))}
                                        </ul>
                                    );

                                case "orderedList":
                                case "numberList":
                                    return (
                                        <ol key={index}>
                                            {node.content?.map((item, itemIndex) => (
                                                <li key={itemIndex}>
                                                    {item.content?.map((paragraph, paragraphIndex) => (
                                                        <span key={paragraphIndex}>
                                                            {paragraph.content?.map((text, textIndex) => (
                                                                <span key={textIndex}>
                                                                    {text.text}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    ))}
                                                </li>
                                            ))}
                                        </ol>
                                    );

                                case "blockquote":
                                case "quote":
                                    return (
                                        <blockquote key={index}>
                                            {node.content?.map((paragraph, paragraphIndex) => (
                                                <span key={paragraphIndex}>
                                                    {paragraph.content?.map((text, textIndex) => (
                                                        <span key={textIndex}>
                                                            {text.text}
                                                        </span>
                                                    ))}
                                                </span>
                                            ))}
                                        </blockquote>
                                    );

                                case "callout":
                                    return (
                                        <div key={index} className={`callout callout-${node.attrs?.variant}`}>
                                            {node.attrs?.title && (
                                                <strong>{node.attrs.title}</strong>
                                            )}

                                            {node.content?.map((paragraph, paragraphIndex) => (
                                                <p key={paragraphIndex}>
                                                    {paragraph.content?.map((text, textIndex) => (
                                                        <span key={textIndex}>
                                                            {text.text}
                                                        </span>
                                                    ))}
                                                </p>
                                            ))}
                                        </div>
                                    );

                                default:
                                    return null;
                            }
                        })
                    )}
                </article>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                        {
                            blog?.tags?.map((tag, index) => {
                                const tagName = typeof tag === "object" ? tag.name : tag;
                                return (
                                    <div
                                        key={index}
                                        className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm transition-colors hover:bg-gray-100 hover:text-blue-600 cursor-default"
                                    >
                                        #{tagName}
                                    </div>
                                );
                            })
                        }
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Like */}
                        <button
                            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
                            id="likeBtn"
                            type="button"
                        >
                            <span
                                className="material-symbols-outlined text-[18px]"
                                id="likeIcon"
                            >
                                favorite_border
                            </span>

                            <span id="likeCount">142</span>
                        </button>

                        {/* Bookmark */}
                        <button
                            className="rounded-lg bg-white p-2 text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
                            id="bookmarkBtn"
                            title="Bookmark article"
                            type="button"
                        >
                            <span
                                className="material-symbols-outlined text-[18px]"
                                id="bookmarkIcon"
                            >
                                bookmark_border
                            </span>
                        </button>
                    </div>
                </div>
                <section className="mt-10 flex flex-col items-center gap-4 rounded-xl bg-white p-6 text-center shadow-sm sm:flex-row sm:items-start sm:text-left">
                    {authorAvatar ? (
                        <img
                            alt={authorName}
                            className="h-20 w-20 shrink-0 rounded-full object-cover shadow-sm ring-4 ring-gray-100"
                            src={authorAvatar}
                        />
                    ) : (
                        <div className="h-20 w-20 shrink-0 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-sm ring-4 ring-gray-100">
                            {authorName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
                        <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    Written by
                                </span>

                                <h3 className="text-xl font-bold text-gray-900">
                                    {authorName}
                                </h3>
                            </div>

                            <a
                                className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-200"
                                href="#"
                            >
                                <span>View Profile</span>

                                <span className="material-symbols-outlined text-[16px]">
                                    arrow_forward
                                </span>
                            </a>
                        </div>

                        <p className="text-base text-gray-500">
                            {authorBio}
                        </p>
                    </div>
                </section>
                <Comments blog={serializedBlog} comments={serializedComments} />
            </div>

        </div>
    );
}

export default Page;
