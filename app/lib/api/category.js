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

const COLLECTION_NAME = "categories";

export async function getCategories() {
    try {
        const collectionRef = collection(db, COLLECTION_NAME);
        let querySnapshot;
        try {
            const q = query(collectionRef, orderBy("createdAtTimestamp", "desc"));
            querySnapshot = await getDocs(q);
        } catch {
            querySnapshot = await getDocs(collectionRef);
        }

        const categories = [];
        querySnapshot.forEach((docSnap) => {
            categories.push({
                id: docSnap.id,
                ...docSnap.data(),
            });
        });

        return { status: true, data: categories };
    } catch (error) {
        console.error("getCategories error:", error);
        return { status: false, errorMessage: error.message, data: [] };
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
