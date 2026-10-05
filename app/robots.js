export default function robots() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://next-log.vercel.app";

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/blog", "/blog/*", "/categories", "/tags", "/author/*", "/about"],
                disallow: [
                    "/dashboard",
                    "/dashboard/*",
                    "/api/*",
                    "/login",
                    "/signup",
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
