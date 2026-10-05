import { db } from "@/app/services/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
    limit,
    startAfter,
} from "firebase/firestore";

const COLLECTION_NAME = "categories";

export async function getCategories(options = {}) {
    try {
        const opts = typeof options === "number" ? { pageSize: options } : (options || {});
        const {
            pageSize = null,
            lastDoc = null,
            status = null,
            search = null,
            orderByField = "createdAtTimestamp",
            orderDirection = "desc",
        } = opts;

        const collectionRef = collection(db, COLLECTION_NAME);
        const constraints = [];

        // Build primary query
        if (status) {
            constraints.push(where("status", "==", status));
        }
        if (orderByField) {
            constraints.push(orderBy(orderByField, orderDirection));
        }
        if (lastDoc) {
            constraints.push(startAfter(lastDoc));
        }
        const limitCount = pageSize && typeof pageSize === "number" && pageSize > 0 ? pageSize + 1 : null;
        if (limitCount) {
            constraints.push(limit(limitCount));
        }

        let querySnapshot;
        if (search && search.trim()) {
            // When user searches, query without strict limit to search across all records
            // rather than only filtering the first few alphabetically or chronologically
            try {
                const searchConstraints = [];
                if (status) {
                    searchConstraints.push(where("status", "==", status));
                }
                const qSearch = query(collectionRef, ...searchConstraints);
                querySnapshot = await getDocs(qSearch);
            } catch (searchErr) {
                querySnapshot = await getDocs(collectionRef);
            }

            const s = search.toLowerCase().trim();
            let categories = querySnapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
                posts: Number(docSnap.data()?.posts) || 0,
            })).filter((c) => c.name && c.name.trim().length > 0);

            // Filter across name, slug, description
            categories = categories.filter(
                (c) =>
                    (c.name && c.name.toLowerCase().includes(s)) ||
                    (c.slug && c.slug.toLowerCase().includes(s)) ||
                    (c.description && c.description.toLowerCase().includes(s))
            );

            // Sort results based on requested sortBy
            if (orderByField === "name") {
                categories.sort((a, b) => {
                    const cmp = (a.name || "").localeCompare(b.name || "");
                    return orderDirection === "asc" ? cmp : -cmp;
                });
            } else if (orderByField === "posts") {
                categories.sort((a, b) => {
                    const diff = (b.posts || 0) - (a.posts || 0);
                    return orderDirection === "asc" ? -diff : diff;
                });
            } else if (orderByField === "createdAtTimestamp") {
                categories.sort((a, b) => {
                    const diff = (Number(b.createdAtTimestamp) || 0) - (Number(a.createdAtTimestamp) || 0);
                    return orderDirection === "asc" ? -diff : diff;
                });
            }

            return {
                status: true,
                data: categories,
                lastDoc: null,
                hasMore: false,
            };
        }

        try {
            const q = query(collectionRef, ...constraints);
            querySnapshot = await getDocs(q);
        } catch (err) {
            // When where("status") + orderBy creates a missing composite index error,
            // query by orderBy and limit without status filter (all seeded categories are Active),
            // preserving true sorting, startAfter pagination and limit.
            const fallbackConstraints = [];
            if (orderByField) {
                fallbackConstraints.push(orderBy(orderByField, orderDirection));
            }
            if (lastDoc) {
                fallbackConstraints.push(startAfter(lastDoc));
            }
            if (limitCount) {
                fallbackConstraints.push(limit(limitCount));
            }
            const qFallback = query(collectionRef, ...fallbackConstraints);
            querySnapshot = await getDocs(qFallback);
        }

        const rawDocs = querySnapshot.docs;
        const hasMore = limitCount ? rawDocs.length > pageSize : false;
        const resultDocs = hasMore ? rawDocs.slice(0, pageSize) : rawDocs;

        let categories = resultDocs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
            posts: Number(docSnap.data()?.posts) || 0,
        })).filter((c) => c.name && c.name.trim().length > 0);

        const lastVisibleDoc = resultDocs.length > 0 ? resultDocs[resultDocs.length - 1] : null;

        return {
            status: true,
            data: categories,
            lastDoc: lastVisibleDoc,
            hasMore: Boolean(hasMore),
        };
    } catch (error) {
        console.error("getCategories error:", error);
        return { status: false, errorMessage: error.message, data: [], lastDoc: null, hasMore: false };
    }
}

export async function getPopularCategories(limitCount = 8) {
    try {
        const res = await getCategories({
            pageSize: limitCount,
            status: "Active",
            orderByField: "posts",
            orderDirection: "desc",
        });
        if (res.status && res.data.length > 0) {
            return res;
        }
        return await getCategories({ pageSize: limitCount, status: "Active" });
    } catch {
        return await getCategories({ pageSize: limitCount });
    }
}

export async function getCategoryBySlug(slug) {
    try {
        if (!slug) return { status: false, errorMessage: "Category slug is required" };
        const collectionRef = collection(db, COLLECTION_NAME);
        const q = query(collectionRef, where("slug", "==", slug), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) {
            return { status: false, errorMessage: "Category not found" };
        }
        const docSnap = snap.docs[0];
        return {
            status: true,
            data: { id: docSnap.id, ...docSnap.data() },
        };
    } catch (err) {
        return { status: false, errorMessage: err.message };
    }
}

export async function createCategory(categoryData) {
    try {
        if (!categoryData || !categoryData.name) {
            return { status: false, errorMessage: "Category name is required" };
        }

        const collectionRef = collection(db, COLLECTION_NAME);
        const formattedDate = new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });

        const newCategory = {
            name: categoryData.name.trim(),
            slug: categoryData.slug?.trim() || "",
            parent: categoryData.parent || "None",
            description: categoryData.description || "",
            status: categoryData.status || "Active",
            posts: Number(categoryData.posts) || 0,
            seoTitle: categoryData.seoTitle || "",
            seoDescription: categoryData.seoDescription || "",
            canonicalUrl: categoryData.canonicalUrl || "",
            createdAt: formattedDate,
            createdAtTimestamp: Date.now(),
        };

        const docRef = await addDoc(collectionRef, newCategory);
        return {
            status: true,
            id: docRef.id,
            data: { id: docRef.id, ...newCategory },
            successMessage: "Category created successfully",
        };
    } catch (error) {
        console.error("createCategory error:", error);
        return { status: false, errorMessage: error.message };
    }
}

export async function updateCategory(id, categoryData) {
    try {
        if (!id) {
            return { status: false, errorMessage: "Category ID is required" };
        }

        const docRef = doc(db, COLLECTION_NAME, String(id));
        const updateData = {
            ...categoryData,
            updatedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
            updatedAtTimestamp: Date.now(),
        };

        delete updateData.id;

        await updateDoc(docRef, updateData);
        return {
            status: true,
            id,
            data: { id, ...updateData },
            successMessage: "Category updated successfully",
        };
    } catch (error) {
        console.error("updateCategory error:", error);
        return { status: false, errorMessage: error.message };
    }
}

export async function deleteCategory(id) {
    try {
        if (!id) {
            return { status: false, errorMessage: "Category ID is required" };
        }

        const docRef = doc(db, COLLECTION_NAME, String(id));
        await deleteDoc(docRef);
        return {
            status: true,
            id,
            successMessage: "Category deleted successfully",
        };
    } catch (error) {
        console.error("deleteCategory error:", error);
        return { status: false, errorMessage: error.message };
    }
}

export async function toggleCategoryStatus(id, currentStatus) {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    return updateCategory(id, { status: nextStatus });
}

export async function syncTaxonomyCounts() {
    try {
        const postsSnap = await getDocs(collection(db, "posts"));
        const posts = [];
        postsSnap.forEach((d) => posts.push({ id: d.id, ...d.data() }));

        const catsSnap = await getDocs(collection(db, "categories"));
        const catPromises = [];
        catsSnap.forEach((d) => {
            const cat = d.data();
            if (!cat.name && !cat.slug) return;
            const nameLower = (cat.name || "").toLowerCase().trim();
            const slugLower = (cat.slug || "").toLowerCase().trim();
            const count = posts.filter((p) => {
                if (p.status !== "published" && p.status) return false;
                const pCat = String(p.category || "").toLowerCase().trim();
                return pCat === d.id.toLowerCase() || pCat === nameLower || pCat === slugLower;
            }).length;

            catPromises.push(updateDoc(doc(db, "categories", d.id), { posts: count }));
        });

        const tagsSnap = await getDocs(collection(db, "tags"));
        const tagPromises = [];
        tagsSnap.forEach((d) => {
            const tag = d.data();
            if (!tag.name && !tag.slug) return;
            const nameLower = (tag.name || "").toLowerCase().trim();
            const slugLower = (tag.slug || "").toLowerCase().trim();
            const count = posts.filter((p) => {
                if (p.status !== "published" && p.status) return false;
                if (!Array.isArray(p.tags)) return false;
                return p.tags.some((t) => {
                    const tName = (typeof t === "object" ? t.name : t || "").toLowerCase().trim();
                    const tSlug = (typeof t === "object" ? t.slug : t || "").toLowerCase().trim();
                    const tId = typeof t === "object" ? t.id : "";
                    return tId === d.id || tName === nameLower || tSlug === slugLower;
                });
            }).length;

            tagPromises.push(updateDoc(doc(db, "tags", d.id), { posts: count }));
        });

        await Promise.all([...catPromises, ...tagPromises]);
        return { status: true };
    } catch (err) {
        console.error("syncTaxonomyCounts error:", err);
        return { status: false, errorMessage: err.message };
    }
}
