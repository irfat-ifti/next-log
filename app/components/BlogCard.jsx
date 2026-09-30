import Image from "next/image";
import Link from "next/link";
const BlogCard = ({ blog, variant }) => {
    if (variant === 'vertical') {
        return (

            <article
                className="article-item group flex flex-col items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md md:flex-row lg:gap-6 lg:p-6"
                data-cat="technology"
            >
                {/* Article Image */}
                <Link href={`/blog/${blog?.slug}`}>
                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-44 md:w-72 lg:w-80">
                        <Image
                            alt={blog?.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src={blog?.image}
                            width={320}
                            height={176}
                        />

                        <span className="absolute left-2.5 top-2.5 rounded bg-white/90 px-2.5 py-1 text-xs font-semibold text-blue-600 shadow-sm backdrop-blur">
                            {blog?.category}
                        </span>

                    </div>
                </Link>

                {/* Article Content */}
                <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
                    <div>
                        {/* Meta Info */}
                        <div className="mb-1.5 flex items-center gap-3 text-xs font-medium text-gray-500">
                            <span className="inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">
                                    schedule
                                </span>
                                {blog.readTime}
                            </span>
                        </div>

                        {/* Title */}
                        <Link href={`/blog/${blog.slug}`}>
                            <h2 className="line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                                {blog.title}
                            </h2>
                        </Link>

                        {/* Description */}
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                            {blog.excerpt}
                        </p>
                    </div>

                    {/* Author & Tags */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-gray-100 pt-3">
                        {/* Author */}
                        <div className="flex items-center gap-2.5">
                            <img
                                alt="Irfat Uddin Ifti avatar"
                                className="h-7 w-7 rounded-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoJRoLUBfzYJH7jutrOGj7WYtAmZXx8kqRf8SDU4w9rKnr97y_xCoAuQpllOaBuaSKgbLkiywP5LNT8c8GW2meLxMblEUAw7rkZ2Q5d4M8lerop7NwkZebtIQoaZtrIRcyLXaqmMw7tI46NdafE_eOu1QwELIZWukifuUQWtqIZQQo7OAfHr515Qfxgf6cnWKHlG9b1nMGYbMK5FcAypuHNQvrPXDrzuo9YsyunX1GDhwSRUFl1xY"
                            />

                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                <span>{blog.author.name}</span>

                                <span className="text-xs font-normal text-gray-500">
                                    • {blog.publishedAt}
                                </span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center gap-1.5">
                            {blog?.tags?.map((tag, i) => (
                                <span key={i} className="cursor-pointer rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 transition-colors hover:text-blue-600">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </article >
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

    return (
        <article key={blog.id} className="group flex flex-col justify-between overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
            <div>
                <Link href={`/blog/${blog.slug}`} className="relative block overflow-hidden">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={blog?.title || "Blog post"}
                            className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-52 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[48px] text-blue-300">article</span>
                        </div>
                    )}

                    {/* Category */}
                    {blog?.category && (
                        <span className="absolute left-4 top-4 rounded-md px-2.5 py-1 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur bg-white/70">
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
                    {/* Author initials avatar fallback */}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white flex-shrink-0">
                        {authorName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                    </span>

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
                </div>

                <button
                    type="button"
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600 cursor-pointer"
                    title="Bookmark article"
                >
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                </button>
            </div>
        </article>
    );
}

export default BlogCard;
