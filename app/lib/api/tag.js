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
} from "firebase/firestore";

const COLLECTION_NAME = "tags";

export async function getTags() {
    try {
        const collectionRef = collection(db, COLLECTION_NAME);
        let querySnapshot;
        try {
            const q = query(collectionRef, orderBy("createdAtTimestamp", "desc"));
            querySnapshot = await getDocs(q);
        } catch {
            querySnapshot = await getDocs(collectionRef);
        }

        const tags = [];
        querySnapshot.forEach((docSnap) => {
            tags.push({
                id: docSnap.id,
                ...docSnap.data(),
            });
        });

        return { status: true, data: tags };
    } catch (error) {
        console.error("getTags error:", error);
        return { status: false, errorMessage: error.message, data: [] };
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
