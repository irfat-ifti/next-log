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
    const { slug } = await params;
    const res = await getPost(slug);
    const blog = res?.data;
    if (!blog) {
        notFound();
    }

    const title = blog.metaTitle || blog.title;
    const description = blog.metaDesc || blog.excerpt;
    const imageUrl = blog?.featuredImage?.displayUrl || blog?.featuredImage?.url || "/screen.png";
    const authorName = typeof blog?.author === "object" ? blog?.author?.name : blog?.author || "NextLog Author";

    return {
        title: title,
        description: description,
        keywords: Array.isArray(blog.keywords) ? blog.keywords : [],
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: title,
            description: description,
            url: `/blog/${slug}`,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                },
            ],
            type: "article",
            publishedTime: blog.publishDate
                ? (typeof blog.publishDate?.toDate === "function" ? blog.publishDate.toDate().toISOString() : !isNaN(new Date(blog.publishDate).getTime()) ? new Date(blog.publishDate).toISOString() : undefined)
                : undefined,
            modifiedTime: blog.updatedAt
                ? (typeof blog.updatedAt?.toDate === "function" ? blog.updatedAt.toDate().toISOString() : !isNaN(new Date(blog.updatedAt).getTime()) ? new Date(blog.updatedAt).toISOString() : undefined)
                : undefined,
            authors: [authorName],
            tags: Array.isArray(blog.tags)
                ? blog.tags.map((t) => (typeof t === "object" ? t.name : t))
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [imageUrl],
            creator: "@nextlog",
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

    const authorUid =
        typeof blog?.author === "object" ? blog?.author?.uid : "";

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

    const safeIsoDate = (val) => {
        if (!val) return new Date().toISOString();
        if (typeof val?.toDate === "function") return val.toDate().toISOString();
        if (typeof val === "number") {
            const ms = val < 1e11 ? val * 1000 : val;
            return new Date(ms).toISOString();
        }
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
    };

    const postDescription = blog?.excerpt || blog?.description || "";
    const categoryName = blog?.category || "Uncategorized";

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://next-log.vercel.app";
    const postUrl = `${siteUrl}/blog/${slug}`;
    const postImage = blog?.featuredImage?.displayUrl || blog?.featuredImage?.url || `${siteUrl}/screen.png`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": postDescription,
        "image": [postImage],
        "datePublished": safeIsoDate(blog.publishDate || blog.createdAt),
        "dateModified": safeIsoDate(blog.updatedAt || blog.publishDate || blog.createdAt),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl,
        },
        "author": {
            "@type": "Person",
            "name": authorName || "NextLog Author",
            "url": authorUid ? `${siteUrl}/author/${authorUid}` : siteUrl,
        },
        "publisher": {
            "@type": "Organization",
            "name": "NextLog",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/screen.png`,
            },
        },
        "keywords": Array.isArray(blog.keywords) ? blog.keywords.join(", ") : "",
        "articleSection": categoryName,
    };

    return (
        <div className='my-25'>
            {/* JSON-LD Structured Data for Search Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

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
                        <Link
                            href={`/blog?category=${encodeURIComponent((categoryName || "").toLowerCase().trim().replace(/\s+/g, "-"))}`}
                            className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-blue-600 hover:bg-blue-100 transition"
                        >
                            {categoryName}
                        </Link>

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
                            {authorUid ? (
                                <Link href={`/author/${authorUid}`} className="group/author flex items-center gap-3">
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white group-hover/author:ring-blue-600 transition">
                                        <Image
                                            alt={authorName}
                                            className="object-cover"
                                            src={authorAvatar || "/user.jpg"}
                                            fill
                                            sizes="44px"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-semibold text-gray-900 group-hover/author:text-blue-600 transition">
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

                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <>
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white">
                                        <Image
                                            alt={authorName}
                                            className="object-cover"
                                            src={authorAvatar || "/user.jpg"}
                                            fill
                                            sizes="44px"
                                        />
                                    </div>

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
                                </>
                            )}
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
                                const tagSlug = typeof tag === "object" ? tag.slug || tag.name : tag;
                                return (
                                    <Link
                                        key={index}
                                        href={`/blog?tag=${encodeURIComponent(tagSlug)}`}
                                        className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-gray-500 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        #{tagName}
                                    </Link>
                                );
                            })
                        }
                    </div>

                </div>
                <section className="mt-10 flex flex-col items-center gap-4 rounded-xl bg-white p-6 text-center shadow-sm sm:flex-row sm:items-start sm:text-left">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full shadow-sm ring-4 ring-gray-100">
                        <Image
                            alt={authorName}
                            className="object-cover"
                            src={authorAvatar || "/user.jpg"}
                            fill
                            sizes="80px"
                        />
                    </div>

                    <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
                        <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    Written by
                                </span>

                                <h3 className="text-xl font-bold text-gray-900">
                                    {authorUid ? (
                                        <Link href={`/author/${authorUid}`} className="hover:text-blue-600 transition">
                                            {authorName}
                                        </Link>
                                    ) : (
                                        authorName
                                    )}
                                </h3>
                            </div>

                            {authorUid && (
                                <Link
                                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-200"
                                    href={`/author/${authorUid}`}
                                >
                                    <span>View Profile</span>

                                    <span className="material-symbols-outlined text-[16px]">
                                        arrow_forward
                                    </span>
                                </Link>
                            )}
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
