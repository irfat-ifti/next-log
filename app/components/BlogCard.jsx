import Link from "next/link";
import Image from "next/image";

const BlogCard = ({ blog, variant }) => {
    // Resolve author uid if available
    const authorUid =
        typeof blog?.author === "object" ? blog?.author?.uid : null;

    if (variant === 'vertical') {
        // Resolve fields from Firestore structure
        const verticalImageSrc = blog?.featuredImage?.displayUrl || blog?.featuredImage?.url || blog?.image || null;
        const verticalAuthorName = typeof blog?.author === "string" ? blog.author : blog?.author?.name || "Unknown";
        const verticalAuthorAvatar = blog?.author?.avatar || "/user.jpg";
        const verticalDate = blog?.publishDate
            ? new Date(blog.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : blog?.publishedAt || "";

        return (
            <article
                className="article-item group flex flex-col items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md md:flex-row lg:gap-6 lg:p-6"
                data-cat={blog?.category?.toLowerCase().replace(/\s+/g, "-") || "all"}
            >

                <Link href={`/blog/${blog?.slug}`}>
                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-44 md:w-72 lg:w-80">
                        {verticalImageSrc ? (
                            <Image
                                alt={blog?.title || "Post image"}
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                src={verticalImageSrc}
                                fill
                                sizes="(max-width: 768px) 100vw, 320px"
                            />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[48px] text-blue-300">article</span>
                            </div>
                        )}

                        <span className="absolute left-2.5 top-2.5 z-10 rounded bg-white/90 px-2.5 py-1 text-xs font-semibold text-blue-600 shadow-sm backdrop-blur">
                            {blog?.category || "Uncategorized"}
                        </span>
                    </div>
                </Link>

                <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
                    <div>

                        <Link href={`/blog/${blog.slug}`}>
                            <h2 className="line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                                {blog.title}
                            </h2>
                        </Link>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                            {blog.excerpt}
                        </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-gray-100 pt-3">

                        <div className="flex items-center gap-2.5">
                            {authorUid ? (
                                <Link href={`/author/${authorUid}`} className="group/author flex items-center gap-2.5">
                                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                                        <Image
                                            alt={verticalAuthorName}
                                            className="object-cover"
                                            src={verticalAuthorAvatar || "/user.jpg"}
                                            fill
                                            sizes="28px"
                                        />
                                    </div>

                                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                        <span className="group-hover/author:text-blue-600 transition-colors">{verticalAuthorName}</span>
                                        <span className="text-xs font-normal text-gray-500">
                                            • {verticalDate}
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <>
                                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                                        <Image
                                            alt={verticalAuthorName}
                                            className="object-cover"
                                            src={verticalAuthorAvatar || "/user.jpg"}
                                            fill
                                            sizes="28px"
                                        />
                                    </div>

                                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                        <span>{verticalAuthorName}</span>
                                        <span className="text-xs font-normal text-gray-500">
                                            • {verticalDate}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5">
                            {blog?.tags?.slice(0, 3).map((tag, i) => {
                                const tagName = typeof tag === "object" ? tag.name : tag;
                                const tagSlug = typeof tag === "object" ? tag.slug || tag.name : tag;
                                return (
                                    <Link
                                        key={i}
                                        href={`/blog?tag=${encodeURIComponent(tagSlug)}`}
                                        className="cursor-pointer rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 transition-colors hover:text-blue-600 hover:bg-blue-50"
                                    >
                                        #{tagName}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    // Resolve author name — can be string or object
    const authorName =
        typeof blog?.author === "string"
            ? blog.author
            : blog?.author?.name || "Unknown Author";

    // Resolve image src safely
    const imageSrc = blog?.featuredImage?.url || blog?.featuredImage?.displayUrl || null;

    // Format publish date
    const publishDate = blog?.publishDate
        ? new Date(blog.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : blog?.publishedAt || "";

    const gridAuthorAvatar =
        typeof blog?.author === "object" && blog?.author?.avatar
            ? blog.author.avatar
            : "/user.jpg";

    return (
        <article key={blog.id} className="group flex flex-col justify-between overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
            <div>
                <Link href={`/blog/${blog.slug}`} className="relative block overflow-hidden">
                    <div className="relative h-52 w-full">
                        {imageSrc ? (
                            <Image
                                src={imageSrc}
                                alt={blog?.title || "Blog post"}
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[48px] text-blue-300">article</span>
                            </div>
                        )}
                    </div>

                    {blog?.category && (
                        <span className="absolute left-4 top-4 z-10 rounded-md px-2.5 py-1 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur bg-white/70">
                            {blog.category}
                        </span>
                    )}
                </Link>

                <div className="p-6">
                    <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 line-clamp-2">
                        <Link href={`/blog/${blog?.slug}`}>
                            {blog?.title}
                        </Link>
                    </h3>

                    <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-500">
                        {blog?.excerpt}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between px-6 pb-6 pt-1 border-t border-gray-50">
                <div className="flex items-center gap-2.5">
                    {authorUid ? (
                        <Link href={`/author/${authorUid}`} className="group/author flex items-center gap-2.5">
                            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                                <Image
                                    alt={authorName}
                                    className="object-cover"
                                    src={gridAuthorAvatar}
                                    fill
                                    sizes="36px"
                                />
                            </div>

                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900 group-hover/author:text-blue-600 transition-colors">{authorName}</span>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span>{publishDate}</span>
                                    {blog?.readTime && (
                                        <>
                                            <span>•</span>
                                            <span>{blog.readTime}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <>
                            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                                <Image
                                    alt={authorName}
                                    className="object-cover"
                                    src={gridAuthorAvatar}
                                    fill
                                    sizes="36px"
                                />
                            </div>

                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">{authorName}</span>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span>{publishDate}</span>
                                    {blog?.readTime && (
                                        <>
                                            <span>•</span>
                                            <span>{blog.readTime}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}

export default BlogCard;
