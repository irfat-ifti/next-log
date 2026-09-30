import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/services/firebase";

export async function isSlugAvailable(collectionName, slug) {
    try {
        const ref = collection(db, collectionName);

        const q = query(
            ref,
            where("slug", "==", slug)
        );

        const snapshot = await getDocs(q);

        console.log("collection:", collectionName);
        console.log("checking slug:", JSON.stringify(slug));
        console.log("docs found:", snapshot.size);
        console.log("snapshot.empty:", snapshot.empty);

        return snapshot.empty;
    } catch (error) {
        console.error("Slug check error:", error);
        return false;
    }
}

export const sanitizeSlug = (value) => {
    return value
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};
