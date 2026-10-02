import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/services/firebase";

/**
 * Sanitizes any string into a clean, URL-friendly slug.
 * Handles diacritics, special characters, whitespace, multiple hyphens, and trimming.
 *
 * @param {string} value - The raw text to convert
 * @param {object} options - Optional configuration
 * @param {boolean} options.allowTrailingHyphen - If true, keeps trailing hyphen (useful while user is typing in input)
 * @returns {string} - Clean slug
 */
export const sanitizeSlug = (value, options = {}) => {
    if (value === null || value === undefined) {
        return "";
    }

    const { allowTrailingHyphen = false } = options;

    let str = String(value)
        // Normalize Unicode diacritics/accents (e.g. é -> e, ö -> o)
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    // Replace whitespace and underscores with hyphen
    str = str.replace(/[\s_]+/g, "-");

    // Remove any character that is not lowercase alphanumeric or hyphen
    str = str.replace(/[^a-z0-9-]/g, "");

    // Collapse multiple consecutive hyphens into a single hyphen
    str = str.replace(/-+/g, "-");

    // Remove leading hyphens
    str = str.replace(/^-+/, "");

    // Remove trailing hyphens unless specifically requested (e.g. while typing)
    if (!allowTrailingHyphen) {
        str = str.replace(/-+$/, "");
    }

    return str;
};

/**
 * Checks whether a slug is unique in a given Firestore collection.
 *
 * @param {string} collectionName - 'posts', 'categories', 'tags', etc.
 * @param {string} slug - The slug to test
 * @param {string|null} excludeDocId - ID of document to exclude (e.g. when editing)
 * @returns {Promise<boolean>} - true if available, false if taken or invalid
 */
export async function isSlugAvailable(collectionName, slug, excludeDocId = null) {
    const cleanSlug = sanitizeSlug(slug);

    // Empty or whitespace slug is not available
    if (!cleanSlug) {
        return false;
    }

    try {
        const ref = collection(db, collectionName);
        const q = query(ref, where("slug", "==", cleanSlug));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return true;
        }

        // If excludeDocId is provided, check if any other document has this slug
        if (excludeDocId) {
            const isTakenByOther = snapshot.docs.some((doc) => doc.id !== excludeDocId);
            return !isTakenByOther;
        }

        return false;
    } catch (error) {
        console.error(`isSlugAvailable error for [${collectionName}]:`, error);
        return false;
    }
}
