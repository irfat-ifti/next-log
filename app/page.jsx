"use client";

import { useEffect, useState } from "react";
import CTA from "@/app/components/CTA";
import BlogCard from "@/app/components/BlogCard";
import { getPosts } from "@/app/lib/api/post";
import { getPopularTags } from "@/app/lib/api/tag";
import Link from "next/link";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const HOME_POSTS_LIMIT = 4;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Call getPosts with exact limit desired for home page
        const [postsResult, tagsResult] = await Promise.all([
          getPosts({ pageSize: HOME_POSTS_LIMIT }),
          getPopularTags(8),
        ]);

        if (postsResult.status) {
          setPosts(postsResult.data);
        } else {
          setError(postsResult.errorMessage || "Failed to load posts");
        }

        if (tagsResult?.status && tagsResult.data.length > 0) {
          setPopularTags(tagsResult.data);
        } else {
          // Fallback popular topics if no tags in database yet
          setPopularTags([
            { id: "1", name: "Technology", slug: "technology" },
            { id: "2", name: "Programming", slug: "programming" },
            { id: "3", name: "Web Development", slug: "web-development" },
            { id: "4", name: "Design", slug: "design" },
            { id: "5", name: "Career", slug: "career" },
          ]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="mt-16.25 mx-auto flex max-w-4xl flex-col items-start py-16 text-left sm:items-center sm:text-center px-4">
        {/* Editorial Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
          <span>Engineering Thought Leadership &bull; Open Platform</span>
        </div>

        {/* Heading */}
        <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl sm:leading-[1.15]">
          Where Modern Developers Write, Think, and Build in Public.
        </h1>

        {/* Editorial Subtitle */}
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
          Deep-dives into architecture patterns, modern frameworks, and hard-earned engineering insights. Crafted by software engineers, read by passionate builders worldwide.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5">
          <a
            href="#latest"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
          >
            <span>Explore Dispatches</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>

          <Link
            href="/dashboard/create-post"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-xs transition hover:bg-gray-50 hover:border-gray-300"
          >
            <span className="material-symbols-outlined text-[18px] text-blue-600">edit_note</span>
            <span>Publish an Article</span>
          </Link>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="mb-16 max-w-6xl mx-auto w-full px-4">
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className="material-symbols-outlined text-[18px]">tag</span>
            <span>Popular Topics</span>
          </div>
          <Link className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline" href="/tags">
            <span>View all tags</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {popularTags.map((tag) => {
            const tagName = typeof tag === "object" ? tag.name : tag;
            const tagSlug = typeof tag === "object" ? tag.slug || tag.name : tag;
            return (
              <Link
                key={tag.id || tagSlug}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
                href={`/blog?tag=${encodeURIComponent(tagSlug)}`}
              >
                <span className="font-mono text-[12px] text-gray-400">#</span>
                <span>{tagName}</span>
                {tag.posts > 0 && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {tag.posts}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Articles */}
      <section id="latest" className="mb-16 max-w-6xl mx-auto w-full px-4">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Latest Editorial Dispatches</h2>
            <p className="mt-1 text-sm text-gray-500">Curated, peer-reviewed knowledge written by engineers across the community.</p>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <LoadingSpinner size={44} label="Loading latest articles..." />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-red-300">error</span>
            <p className="mt-3 text-base font-medium text-red-500">{error}</p>
            <button
              onClick={() => { setLoading(true); setError(null); getPosts({ pageSize: HOME_POSTS_LIMIT }).then(r => { setPosts(r.data || []); setLoading(false); }).catch(e => { setError(e.message); setLoading(false); }); }}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-gray-300">article</span>
            <p className="mt-3 text-base font-medium text-gray-700">No published dispatches yet.</p>
            <p className="text-sm text-gray-400">Be the first to share an in-depth breakdown or tutorial!</p>
            <Link
              href="/dashboard/create-post"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              Publish First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && !error && posts.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
            >
              <span>See More Articles</span>
              <span className="material-symbols-outlined text-[18px]">read_more</span>
            </Link>
          </div>
        )}
      </section>

      <CTA />
    </>
  );
}
