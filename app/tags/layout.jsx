export const metadata = {
    title: "Browse All Tags",
    description: "Explore tech and programming tags on NextLog. Quickly locate articles, code tutorials, and guides matching your specific tech stack.",
    alternates: {
        canonical: "/tags",
    },
    openGraph: {
        title: "Browse All Tags | NextLog",
        description: "Explore tech and programming tags on NextLog.",
        url: "/tags",
    },
};

export default function TagsLayout({ children }) {
    return children;
}
