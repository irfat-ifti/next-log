import { getUserById } from "@/app/lib/api/auth";

export async function generateMetadata({ params }) {
    const { uid } = await params;
    const userRes = await getUserById(uid);
    const author = userRes?.status ? userRes.data : null;
    const authorName = author?.name || "Author";

    return {
        title: `${authorName}'s Profile & Articles`,
        description: author?.bio || `Read articles, tutorials, and engineering insights written by ${authorName} on NextLog.`,
        alternates: {
            canonical: `/author/${uid}`,
        },
        openGraph: {
            title: `${authorName} - Author Profile | NextLog`,
            description: author?.bio || `Articles and insights written by ${authorName}.`,
            url: `/author/${uid}`,
            images: author?.avatar ? [{ url: author.avatar }] : ["/screen.png"],
        },
    };
}

export default function AuthorLayout({ children }) {
    return children;
}
