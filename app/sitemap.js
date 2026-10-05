import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/services/firebase";

export default async function sitemap() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://next-log.vercel.app";

    // Static core pages
    const routes = [
        "",
        "/blog",
        "/categories",
        "/tags",
        "/about",
    ].map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: route === "" || route === "/blog" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/blog" ? 0.9 : 0.8,
    }));

    try {
        // Fetch all published posts from Firestore
        const postsQuery = query(
            collection(db, "posts"),
            where("status", "==", "published")
        );
        const postsSnap = await getDocs(postsQuery);

        const safeIsoDate = (val) => {
            if (!val) return new Date().toISOString();
            if (typeof val?.toDate === "function") return val.toDate().toISOString();
            const parsed = new Date(val);
            return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
        };

        const postUrls = postsSnap.docs.map((docSnap) => {
            const data = docSnap.data();
            const slug = data.slug || docSnap.id;
            const updatedDate = safeIsoDate(data.updatedAt || data.publishDate || data.createdAt);

            return {
                url: `${siteUrl}/blog/${slug}`,
                lastModified: updatedDate,
                changeFrequency: "weekly",
                priority: 0.9,
            };
        });

        // Fetch categories
        let categoryUrls = [];
        try {
            const categoriesSnap = await getDocs(collection(db, "categories"));
            categoryUrls = categoriesSnap.docs
                .map((docSnap) => {
                    const data = docSnap.data();
                    const slug = data.slug || data.name?.toLowerCase().replace(/\s+/g, "-");
                    if (!slug) return null;
                    return {
                        url: `${siteUrl}/blog?category=${encodeURIComponent(slug)}`,
                        lastModified: new Date().toISOString(),
                        changeFrequency: "weekly",
                        priority: 0.7,
                    };
                })
                .filter(Boolean);
        } catch (catErr) {
            console.error("Sitemap categories fetch error:", catErr);
        }

        // Fetch tags
        let tagUrls = [];
        try {
            const tagsSnap = await getDocs(collection(db, "tags"));
            tagUrls = tagsSnap.docs
                .map((docSnap) => {
                    const data = docSnap.data();
                    const slug = data.slug || data.name?.toLowerCase().replace(/\s+/g, "-");
                    if (!slug) return null;
                    return {
                        url: `${siteUrl}/blog?tag=${encodeURIComponent(slug)}`,
                        lastModified: new Date().toISOString(),
                        changeFrequency: "weekly",
                        priority: 0.6,
                    };
                })
                .filter(Boolean);
        } catch (tagErr) {
            console.error("Sitemap tags fetch error:", tagErr);
        }

        return [...routes, ...postUrls, ...categoryUrls, ...tagUrls];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return routes;
    }
}
