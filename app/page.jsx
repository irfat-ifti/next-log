import CTA from "@/app/components/CTA";
import Image from "next/image";
import BlogCard from "@/app/components/BlogCard"
import { getPosts } from "@/app/lib/api/post";

export default async function Home() {
  const posts = await getPosts();
  const imageSrc = "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg";

  return (
    <>

      <section className="mt-16.25 mx-auto flex max-w-3xl flex-col items-start py-16 text-left sm:items-center sm:text-center">
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
          {/* Explore Posts */}
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <span>Explore Posts</span>

            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </a>

          {/* Start Writing */}
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-[18px]">
              edit_note
            </span>

            <span>Start Writing</span>
          </a>
        </div>
      </section>
      <section className="mb-16 max-w-6xl mx-auto w-full">
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className="material-symbols-outlined text-[18px]">
              tag
            </span>
            <span>Popular Topics</span>
          </div>

          <a
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            href="#"
          >
            <span>View all tags</span>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
            href="#"
          >
            <span className="font-mono text-[12px] text-gray-400">#</span>
            <span>Technology</span>
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
              42
            </span>
          </a>

          <a
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
            href="#"
          >
            <span className="font-mono text-[12px] text-gray-400">#</span>
            <span>Programming</span>
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
              38
            </span>
          </a>

          <a
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
            href="#"
          >
            <span className="font-mono text-[12px] text-gray-400">#</span>
            <span>Web Development</span>
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
              64
            </span>
          </a>

          <a
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
            href="#"
          >
            <span className="font-mono text-[12px] text-gray-400">#</span>
            <span>Design</span>
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
              19
            </span>
          </a>

          <a
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-600"
            href="#"
          >
            <span className="font-mono text-[12px] text-gray-400">#</span>
            <span>Career</span>
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
              27
            </span>
          </a>
        </div>
      </section>

      {/* post grid starts */}
      <section className="mb-16 max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Articles
            </h2>

            <p className="text-sm text-gray-500">
              Fresh insights from developers writing on NextLog
            </p>
          </div>

          {/* Sort Buttons */}
          <div className="hidden items-center gap-1 rounded-lg bg-white p-1 text-sm text-gray-500 shadow-sm sm:flex">
            <button
              className="rounded bg-gray-100 px-3 py-1 font-medium text-blue-600"
              id="sortRecentBtn"
            >
              Recent
            </button>

            <button
              className="rounded px-3 py-1 transition-colors hover:text-gray-900"
              id="sortPopularBtn"
            >
              Trending
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
          {posts.data ?
            posts.data.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))
            : <p>No posts found</p>
          }

        </div>
        {/* Load More */}
        <div className="mt-8 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
          >
            <span>Load More Articles</span>

            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </a>
        </div>
      </section>
      {/* post grid ends */}
      <CTA />
    </>
  );
}
