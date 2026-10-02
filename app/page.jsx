"use client";

import { useEffect, useState } from "react";
import CTA from "@/app/components/CTA";
import BlogCard from "@/app/components/BlogCard";
import { getPosts } from "@/app/lib/api/post";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const result = await getPosts();
        if (result.status) {
          setPosts(result.data);
        } else {
          setError(result.errorMessage || "Failed to load posts");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="mt-16.25 mx-auto flex max-w-3xl flex-col items-start py-16 text-left sm:items-center sm:text-center px-4">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-blue-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
          <span>Next.js 15 &amp; RSC Community Edition</span>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Share your ideas. Discover something new.
        </h1>

        {/* Description */}
        <p className="mb-8 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
          A simple community where authors can publish articles and readers can
          discover and discuss interesting ideas.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#latest"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <span>Explore Posts</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>

          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>Start Writing</span>
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
          <a className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline" href="#">
            <span>View all tags</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {["Technology", "Programming", "Web Development", "Design", "Career"].map((tag) => (
            <a
              key={tag}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
              href="#"
            >
              <span className="font-mono text-[12px] text-gray-400">#</span>
              <span>{tag}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section id="latest" className="mb-16 max-w-6xl mx-auto w-full px-4">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <p className="text-sm text-gray-500">Fresh insights from developers writing on NextLog</p>
          </div>

          <div className="hidden items-center gap-1 rounded-lg bg-white p-1 text-sm text-gray-500 shadow-sm sm:flex">
            <button className="rounded bg-gray-100 px-3 py-1 font-medium text-blue-600" id="sortRecentBtn">
              Recent
            </button>
            <button className="rounded px-3 py-1 transition-colors hover:text-gray-900" id="sortPopularBtn">
              Trending
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-xl bg-white shadow-sm flex flex-col overflow-hidden">
                {/* Image placeholder */}
                <div className="h-48 w-full flex-shrink-0 bg-gray-200" />
                {/* Content placeholder */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-full w-full" />
                  <div className="h-3 bg-gray-200 rounded-full w-5/6" />
                  <div className="mt-auto pt-3 flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="h-3 bg-gray-200 rounded-full w-24" />
                    <div className="ml-auto h-3 bg-gray-200 rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-red-300">error</span>
            <p className="mt-3 text-base font-medium text-red-500">{error}</p>
            <button
              onClick={() => { setLoading(true); setError(null); getPosts().then(r => { setPosts(r.data || []); setLoading(false); }).catch(e => { setError(e.message); setLoading(false); }); }}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-gray-300">article</span>
            <p className="mt-3 text-base font-medium text-gray-500">No articles yet.</p>
            <p className="text-sm text-gray-400">Be the first to write something!</p>
            <Link
              href="/dashboard/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              Write a Post
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
