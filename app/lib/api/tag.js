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
        try {
            const q = query(collectionRef, ...constraints);
            querySnapshot = await getDocs(q);
        } catch {
            const fallbackConstraints = [];
            if (status) fallbackConstraints.push(where("status", "==", status));
            if (limitCount) fallbackConstraints.push(limit(limitCount));
            const q = fallbackConstraints.length > 0 ? query(collectionRef, ...fallbackConstraints) : query(collectionRef);
            querySnapshot = await getDocs(q);
        }

        const rawDocs = querySnapshot.docs;
        const hasMore = limitCount ? rawDocs.length > pageSize : false;
        const resultDocs = hasMore ? rawDocs.slice(0, pageSize) : rawDocs;

        let tags = resultDocs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
            posts: Number(docSnap.data()?.posts) || 0,
        })).filter((t) => t.name && t.name.trim().length > 0);

        if (search && search.trim()) {
            const s = search.toLowerCase().trim();
            tags = tags.filter(
                (t) =>
                    (t.name && t.name.toLowerCase().includes(s)) ||
                    (t.slug && t.slug.toLowerCase().includes(s)) ||
                    (t.description && t.description.toLowerCase().includes(s))
            );
        }

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
