const BlogData = [
    {
        "id": 1,

        "title": "Getting Started with Next.js App Router and Server Components",

        "slug": "getting-started-with-nextjs-app-router-and-server-components",

        "excerpt": "Learn the fundamentals of building modern, ultra-fast web applications with Next.js 15, dynamic route segments, and React Server Components.",

        "category": "Technology",
        "categoryColor": "#4F9CF9",

        "author": {
            "id": 1,
            "name": "Irfat Uddin Ifti",
            "username": "irfat-uddin-ifti",
            "avatar": "https://images.pexels.com/photos/16283239/pexels-photo-16283239.jpeg",
            "bio": "Full-stack developer and open source enthusiast building clean web experiences with Next.js, TypeScript, and JavaScript.",
            "website": ""
        },

        "publishedAt": "2026-09-20T10:30:00+06:00",
        "updatedAt": "2026-09-24T15:20:00+06:00",

        "readTime": "5 min read",

        "icon": "⚡",

        "image": "https://images.pexels.com/photos/16283239/pexels-photo-16283239.jpeg",

        "imageAlt": "Developer working on a modern Next.js application",

        "tags": [
            "nextjs",
            "react",
            "webdev",
            "typescript"
        ],

        "status": "published",

        "allowComments": true,

        "views": 1248,

        "content": {
            "type": "doc",
            "content": [

                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Next.js dramatically redefined modern React development when introducing the App Router architecture. By leveraging React Server Components (RSC) natively from the ground up, developers can orchestrate high-performing server-first execution paradigms without sacrificing the rich declarative interactivity we expect from single-page applications."
                        }
                    ]
                },

                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "Understanding the Server-First Architecture"
                        }
                    ]
                },

                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "In traditional React single-page setups, browser runtimes download extensive JavaScript bundles, parse their AST, execute framework lifecycles, and then asynchronously query back-end APIs. This approach inevitably inflates Time to Interactive (TTI) and compromises Search Engine Optimization on dynamic payloads."
                        }
                    ]
                },

                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "With React Server Components, components default to executing strictly on the server. Their dependencies never get packaged into client bundles, resulting in dramatically bandwidth reductions and instant pre-rendered DOM trees ready for immediate paint:"
                        }
                    ]
                },

                {
                    "type": "codeBlock",
                    "attrs": {
                        "language": "tsx",
                        "filename": "app/blog/[slug]/page.tsx"
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "import { notFound } from 'next/navigation';\nimport type { Metadata } from 'next';\nimport { getPostBySlug } from '@/lib/posts';\n\nexport async function generateMetadata({\n  params\n}: {\n  params: Promise<{ slug: string }>\n}): Promise<Metadata> {\n  const { slug } = await params;\n  const post = await getPostBySlug(slug);\n\n  if (!post) return {};\n\n  return {\n    title: `${post.title} | NextLog`,\n    description: post.excerpt,\n    openGraph: {\n      title: post.title,\n      description: post.excerpt,\n      images: [{ url: post.image }]\n    }\n  };\n}"
                        }
                    ]
                },

                {
                    "type": "heading",
                    "attrs": {
                        "level": 2
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "SEO and Dynamic Routes in Next.js"
                        }
                    ]
                },

                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": "Building scalable publication platforms requires resilient automated SEO tooling. Dynamic route segments such as [slug] allow search engine crawlers to parse fully rendered HTML containing exact meta values on first contact."
                        }
                    ]
                },

                {
                    "type": "bulletList",
                    "content": [

                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "marks": [
                                                {
                                                    "type": "bold"
                                                }
                                            ],
                                            "text": "Automatic Canonical URLs: "
                                        },
                                        {
                                            "type": "text",
                                            "text": "Next.js can generate standardized canonical URLs to help avoid duplicate content issues."
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "marks": [
                                                {
                                                    "type": "bold"
                                                }
                                            ],
                                            "text": "Generated OpenGraph Previews: "
                                        },
                                        {
                                            "type": "text",
                                            "text": "Generate dynamic social sharing images and metadata based on the post."
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            "type": "listItem",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {
                                            "type": "text",
                                            "marks": [
                                                {
                                                    "type": "bold"
                                                }
                                            ],
                                            "text": "Built-in Sitemap Generation: "
                                        },
                                        {
                                            "type": "text",
                                            "text": "Generate sitemap files dynamically from your blog posts and database."
                                        }
                                    ]
                                }
                            ]
                        }

                    ]
                },

                {
                    "type": "callout",
                    "attrs": {
                        "variant": "tip",
                        "title": "Developer Tip"
                    },
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Keep database queries directly inside Server Components whenever possible. Because these components run exclusively on the server, you can securely query your ORM or query service without exposing API secrets or executing unnecessary network round-trips."
                                }
                            ]
                        }
                    ]
                }

            ]
        },

        "seo": {
            "metaTitle": "Getting Started with Next.js App Router and Server Components",
            "metaDescription": "Learn the fundamentals of Next.js App Router, React Server Components, dynamic routes, and modern server-first web development.",
            "keywords": [
                "Next.js",
                "Next.js App Router",
                "React Server Components",
                "Next.js tutorial",
                "Dynamic Routes",
                "Web Development"
            ],
            "ogImage": "https://images.pexels.com/photos/16283239/pexels-photo-16283239.jpeg"
        },

        "relatedPosts": [
            {
                "id": 2,
                "title": "Understanding React Server Components",
                "slug": "understanding-react-server-components",
                "image": "/images/blog/react-server-components.jpg"
            },
            {
                "id": 3,
                "title": "Next.js Dynamic Routing Explained",
                "slug": "nextjs-dynamic-routing-explained",
                "image": "/images/blog/nextjs-dynamic-routing.jpg"
            }
        ],

        "comments": {
            "count": 3
        },

        "createdAt": "2026-09-18T12:00:00+06:00",
        "updatedAt": "2026-09-24T15:20:00+06:00"
    },
    {
        "id": 2,
        "category": "Programming",
        "categoryColor": "#8B5CF6",
        "title": "A Practical Guide to TypeScript for React Developers",
        "excerpt": "Discover the essential TypeScript patterns that can make your React projects safer, cleaner, and easier to maintain.",
        "author": {
            "name": "Sadia Rahman",
            "avatar": "/images/authors/sadia.jpg"
        },
        "publishedAt": "Sep 20, 2026",
        "readTime": "6 min read",
        "icon": "⚡",
        "tags": ["typescript", "react", "frontend"],
        "image": "https://images.pexels.com/photos/39579441/pexels-photo-39579441.jpeg",
        "slug": "typescript-for-react-developers"
    },
    {
        "id": 3,
        "category": "Backend",
        "categoryColor": "#10B981",
        "title": "Connecting Supabase and Firebase Auth in Minutes",
        "excerpt": "A straightforward guide to connecting authentication services with your application while keeping your backend architecture simple.",
        "author": {
            "name": "Alex Rivera",
            "avatar": "/images/authors/alex.jpg"
        },
        "publishedAt": "Sep 15, 2026",
        "readTime": "6 min read",
        "icon": "⚡",
        "tags": ["supabase", "backend", "auth"],
        "image": "https://images.pexels.com/photos/33650529/pexels-photo-33650529.jpeg",
        "slug": "connecting-supabase-firebase-auth"
    },
    {
        "id": 4,
        "category": "Design",
        "categoryColor": "#F59E0B",
        "title": "Designing Clean and Responsive Dashboard Interfaces",
        "excerpt": "Explore practical UI design techniques for creating beautiful dashboards that feel consistent across desktop, tablet, and mobile.",
        "author": {
            "name": "Maya Chen",
            "avatar": "/images/authors/maya.jpg"
        },
        "publishedAt": "Sep 12, 2026",
        "readTime": "5 min read",
        "icon": "✦",
        "tags": ["uiux", "design", "dashboard"],
        "image": "https://images.pexels.com/photos/30574311/pexels-photo-30574311.jpeg",
        "slug": "clean-responsive-dashboard-design"
    },
    {
        "id": 5,
        "category": "DevOps",
        "categoryColor": "#EF4444",
        "title": "Deploying Your Next.js App with Docker and CI/CD",
        "excerpt": "Set up a reliable deployment workflow for your Next.js application using Docker, GitHub Actions, and automated production builds.",
        "author": {
            "name": "Imran Kabir",
            "avatar": "/images/authors/imran.jpg"
        },
        "publishedAt": "Sep 08, 2026",
        "readTime": "8 min read",
        "icon": "⚙",
        "tags": ["docker", "devops", "cicd"],
        "image": "https://images.pexels.com/photos/28210181/pexels-photo-28210181.jpeg",
        "slug": "deploying-nextjs-with-docker-cicd"
    },
    {
        "id": 6,
        "category": "JavaScript",
        "categoryColor": "#F7DF1E",
        "title": "JavaScript Async Patterns Every Developer Should Know",
        "excerpt": "Understand promises, async/await, error handling, and modern asynchronous patterns with practical examples.",
        "author": {
            "name": "Tanvir Ahmed",
            "avatar": "/images/authors/tanvir.jpg"
        },
        "publishedAt": "Sep 06, 2026",
        "readTime": "7 min read",
        "icon": "⚡",
        "tags": ["javascript", "async", "webdev"],
        "image": "https://images.pexels.com/photos/29506410/pexels-photo-29506410.jpeg",
        "slug": "javascript-async-patterns"
    },
    {
        "id": 7,
        "category": "React",
        "categoryColor": "#61DAFB",
        "title": "Building Reusable React Components from Scratch",
        "excerpt": "Learn how to create flexible and reusable React components that keep your codebase clean and maintainable.",
        "author": {
            "name": "Rafi Islam",
            "avatar": "/images/authors/rafi.jpg"
        },
        "publishedAt": "Sep 04, 2026",
        "readTime": "6 min read",
        "icon": "⚛",
        "tags": ["react", "components", "frontend"],
        "image": "https://images.pexels.com/photos/7633692/pexels-photo-7633692.jpeg",
        "slug": "building-reusable-react-components"
    },
    {
        "id": 8,
        "category": "AI",
        "categoryColor": "#A855F7",
        "title": "Getting Started with AI APIs in Modern Web Apps",
        "excerpt": "A beginner-friendly introduction to integrating AI-powered features into your web applications using modern APIs.",
        "author": {
            "name": "Nusrat Jahan",
            "avatar": "/images/authors/nusrat.jpg"
        },
        "publishedAt": "Sep 02, 2026",
        "readTime": "8 min read",
        "icon": "✦",
        "tags": ["ai", "api", "webapp"],
        "image": "https://images.pexels.com/photos/29568986/pexels-photo-29568986.jpeg",
        "slug": "ai-apis-modern-web-apps"
    },
    {
        "id": 9,
        "category": "CSS",
        "categoryColor": "#3B82F6",
        "title": "Mastering CSS Grid for Modern Layouts",
        "excerpt": "Build responsive and flexible layouts with CSS Grid without relying on complicated positioning hacks.",
        "author": {
            "name": "Fahim Chowdhury",
            "avatar": "/images/authors/fahim.jpg"
        },
        "publishedAt": "Aug 30, 2026",
        "readTime": "5 min read",
        "icon": "◇",
        "tags": ["css", "grid", "responsive"],
        "image": "https://images.pexels.com/photos/33535898/pexels-photo-33535898.jpeg",
        "slug": "mastering-css-grid"
    },
    {
        "id": 10,
        "category": "Database",
        "categoryColor": "#14B8A6",
        "title": "Choosing the Right Database for Your Next Project",
        "excerpt": "Compare SQL and NoSQL databases and learn how to choose the right storage solution for different application requirements.",
        "author": {
            "name": "Arif Hossain",
            "avatar": "/images/authors/arif.jpg"
        },
        "publishedAt": "Aug 27, 2026",
        "readTime": "9 min read",
        "icon": "◈",
        "tags": ["database", "sql", "nosql"],
        "image": "https://images.pexels.com/photos/17189473/pexels-photo-17189473.jpeg",
        "slug": "choosing-right-database"
    },
    {
        "id": 11,
        "category": "Performance",
        "categoryColor": "#F97316",
        "title": "How to Make Your Website Load Faster",
        "excerpt": "Discover practical techniques for improving page speed, reducing bundle size, optimizing images, and improving Core Web Vitals.",
        "author": {
            "name": "Siam Ahmed",
            "avatar": "/images/authors/siam.jpg"
        },
        "publishedAt": "Aug 24, 2026",
        "readTime": "7 min read",
        "icon": "⚡",
        "tags": ["performance", "seo", "web"],
        "image": "https://images.pexels.com/photos/17909253/pexels-photo-17909253.jpeg",
        "slug": "make-website-load-faster"
    },
    {
        "id": 12,
        "category": "Security",
        "categoryColor": "#EF4444",
        "title": "Essential Web Security Practices for Developers",
        "excerpt": "Learn the fundamentals of protecting web applications from common vulnerabilities and securing sensitive user data.",
        "author": {
            "name": "Adnan Karim",
            "avatar": "/images/authors/adnan.jpg"
        },
        "publishedAt": "Aug 21, 2026",
        "readTime": "8 min read",
        "icon": "🔒",
        "tags": ["security", "web", "backend"],
        "image": "https://images.pexels.com/photos/8145009/pexels-photo-8145009.jpeg",
        "slug": "essential-web-security-practices"
    },
    {
        "id": 13,
        "category": "Git",
        "categoryColor": "#F05032",
        "title": "A Clean Git Workflow for Small Development Teams",
        "excerpt": "Improve collaboration and reduce merge conflicts with a simple Git branching and pull request workflow.",
        "author": {
            "name": "Mehedi Hasan",
            "avatar": "/images/authors/mehedi.jpg"
        },
        "publishedAt": "Aug 18, 2026",
        "readTime": "5 min read",
        "icon": "⑂",
        "tags": ["git", "github", "workflow"],
        "image": "https://images.pexels.com/photos/18774634/pexels-photo-18774634.jpeg",
        "slug": "clean-git-workflow"
    },
    {
        "id": 14,
        "category": "Mobile",
        "categoryColor": "#06B6D4",
        "title": "Building Cross-Platform Apps with React Native",
        "excerpt": "Explore how React Native helps developers build mobile applications for multiple platforms using a shared codebase.",
        "author": {
            "name": "Sabbir Rahman",
            "avatar": "/images/authors/sabbir.jpg"
        },
        "publishedAt": "Aug 15, 2026",
        "readTime": "7 min read",
        "icon": "▣",
        "tags": ["reactnative", "mobile", "javascript"],
        "image": "https://images.pexels.com/photos/18774628/pexels-photo-18774628.jpeg",
        "slug": "building-cross-platform-react-native"
    },
    {
        "id": 15,
        "category": "Career",
        "categoryColor": "#8B5CF6",
        "title": "How to Build a Strong Developer Portfolio",
        "excerpt": "Learn what projects, skills, and content you should include to create a developer portfolio that clearly showcases your work.",
        "author": {
            "name": "Mahir Khan",
            "avatar": "/images/authors/mahir.jpg"
        },
        "publishedAt": "Aug 12, 2026",
        "readTime": "6 min read",
        "icon": "✦",
        "tags": ["career", "portfolio", "developer"],
        "image": "https://images.pexels.com/photos/4918082/pexels-photo-4918082.jpeg",
        "slug": "build-strong-developer-portfolio"
    }
]
export default BlogData;