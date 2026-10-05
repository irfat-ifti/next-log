export const metadata = {
    title: "All Articles & Tutorials",
    description: "Read the latest engineering blogs, programming insights, tutorials, and deep-dive technical articles on NextLog.",
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "All Articles & Tutorials | NextLog",
        description: "Read the latest engineering blogs and technical articles on NextLog.",
        url: "/blog",
    },
};

export default function BlogLayout({ children }) {
    return children;
}
