import "@/app/globals.css";
import { Inter } from "next/font/google";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { AuthProvider } from "@/app/context/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://next-log.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NextLog - Modern Tech, Web Development & Software Engineering Blog",
    template: "%s | NextLog",
  },
  description: "NextLog is a modern publishing platform exploring cutting-edge technology, web development, JavaScript, React, Next.js, software design patterns, and engineering insights.",
  keywords: [
    "Next.js",
    "React",
    "Web Development",
    "JavaScript",
    "TypeScript",
    "Frontend",
    "Backend",
    "Tech Blog",
    "Programming Tutorials",
  ],
  authors: [{ name: "NextLog Authors" }],
  creator: "NextLog",
  publisher: "NextLog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "NextLog",
    title: "NextLog - Modern Tech & Web Development Blog",
    description: "Discover deep-dive articles, best practices, and engineering insights on Next.js, React, and modern web development.",
    images: [
      {
        url: "/screen.png",
        width: 1200,
        height: 630,
        alt: "NextLog Blog Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextLog - Modern Tech & Web Development Blog",
    description: "Discover deep-dive articles, best practices, and engineering insights on Next.js, React, and modern web development.",
    images: ["/screen.png"],
    creator: "@nextlog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NextLog",
    url: siteUrl,
    description: "Modern Tech, Web Development & Software Engineering Blog Platform",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NextLog",
    url: siteUrl,
    logo: `${siteUrl}/screen.png`,
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
