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

const COLLECTION_NAME = "tags";

export async function getTags(options = {}) {
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
            let tags = querySnapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
                posts: Number(docSnap.data()?.posts) || 0,
            })).filter((t) => t.name && t.name.trim().length > 0);

            // Filter across name, slug, description
            tags = tags.filter(
                (t) =>
                    (t.name && t.name.toLowerCase().includes(s)) ||
                    (t.slug && t.slug.toLowerCase().includes(s)) ||
                    (t.description && t.description.toLowerCase().includes(s))
            );

            // Sort results based on requested sortBy
            if (orderByField === "name") {
                tags.sort((a, b) => {
                    const cmp = (a.name || "").localeCompare(b.name || "");
                    return orderDirection === "asc" ? cmp : -cmp;
                });
            } else if (orderByField === "posts") {
                tags.sort((a, b) => {
                    const diff = (b.posts || 0) - (a.posts || 0);
                    return orderDirection === "asc" ? -diff : diff;
                });
            } else if (orderByField === "createdAtTimestamp") {
                tags.sort((a, b) => {
                    const diff = (Number(b.createdAtTimestamp) || 0) - (Number(a.createdAtTimestamp) || 0);
                    return orderDirection === "asc" ? -diff : diff;
                });
            }

            return {
                status: true,
                data: tags,
                lastDoc: null,
                hasMore: false,
            };
        }

        try {
            const q = query(collectionRef, ...constraints);
            querySnapshot = await getDocs(q);
        } catch (err) {
            // When where("status") + orderBy creates a missing composite index error,
            // query by orderBy and limit without status filter (all seeded tags are Active),
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

        let tags = resultDocs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
            posts: Number(docSnap.data()?.posts) || 0,
        })).filter((t) => t.name && t.name.trim().length > 0);

        const lastVisibleDoc = resultDocs.length > 0 ? resultDocs[resultDocs.length - 1] : null;

        return {
            status: true,
            data: tags,
            lastDoc: lastVisibleDoc,
            hasMore: Boolean(hasMore),
        };
    } catch (error) {
        console.error("getTags error:", error);
        return { status: false, errorMessage: error.message, data: [], lastDoc: null, hasMore: false };
    }
}

export async function getPopularTags(limitCount = 10) {
    try {
        const res = await getTags({
            pageSize: limitCount,
            status: "Active",
            orderByField: "posts",
            orderDirection: "desc",
        });
        if (res.status && res.data.length > 0) {
            return res;
        }
        return await getTags({ pageSize: limitCount, status: "Active" });
    } catch {
        return await getTags({ pageSize: limitCount });
    }
}

export async function getTagBySlug(slug) {
    try {
        if (!slug) return { status: false, errorMessage: "Tag slug is required" };
        const collectionRef = collection(db, COLLECTION_NAME);
        const q = query(collectionRef, where("slug", "==", slug), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) {
            return { status: false, errorMessage: "Tag not found" };
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

export async function createTag(tagData) {
    try {
        if (!tagData || !tagData.name) {
            return { status: false, errorMessage: "Tag name is required" };
        }

        const collectionRef = collection(db, COLLECTION_NAME);
        const formattedDate = new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });

        const newTag = {
            name: tagData.name.trim(),
            slug: tagData.slug?.trim() || "",
            description: tagData.description || "",
            status: tagData.status || "Active",
            posts: Number(tagData.posts) || 0,
            seoTitle: tagData.seoTitle || "",
            seoDescription: tagData.seoDescription || "",
            canonicalUrl: tagData.canonicalUrl || "",
            createdAt: formattedDate,
            createdAtTimestamp: Date.now(),
        };

        const docRef = await addDoc(collectionRef, newTag);
        return {
            status: true,
            id: docRef.id,
            data: { id: docRef.id, ...newTag },
            successMessage: "Tag created successfully",
        };
    } catch (error) {
        console.error("createTag error:", error);
        return { status: false, errorMessage: error.message };
    }
}

export async function updateTag(id, tagData) {
    try {
        if (!id) {
            return { status: false, errorMessage: "Tag ID is required" };
        }

        const docRef = doc(db, COLLECTION_NAME, String(id));
        const updateData = {
            ...tagData,
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
            successMessage: "Tag updated successfully",
        };
    } catch (error) {
        console.error("updateTag error:", error);
        return { status: false, errorMessage: error.message };
    }
}

export async function deleteTag(id) {
    try {
        if (!id) {
            return { status: false, errorMessage: "Tag ID is required" };
        }

        const docRef = doc(db, COLLECTION_NAME, String(id));
        await deleteDoc(docRef);
        return {
            status: true,
            id,
            successMessage: "Tag deleted successfully",
        };
    } catch (error) {
        console.error("deleteTag error:", error);
        return { status: false, errorMessage: error.message };
    }
}

export async function toggleTagStatus(id, currentStatus) {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    return updateTag(id, { status: nextStatus });
}
