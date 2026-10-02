import { db } from "@/app/services/firebase";
import {
    collection,
    getDocs,
    query,
    orderBy,
    where,
    addDoc,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

const COLLECTION_NAME = "comments"

export async function addComment(comment) {
    comment.createdAt = serverTimestamp();

    try {
        const collectionRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(collectionRef, comment);
        return { status: true, data: docRef.id };
    } catch (error) {
        console.error("addComment error:", error);
        return { status: false, errorMessage: error.message, data: null };
    }
}

export async function getCommentsByPostId(postId) {
    try {
        const collectionRef = collection(db, COLLECTION_NAME);
        let querySnapshot;
        try {
            const q = query(collectionRef, orderBy("createdAtTimestamp", "desc"), where("postId", "==", postId));
            querySnapshot = await getDocs(q);
        } catch {
            querySnapshot = await getDocs(collectionRef);
        }

        const comments = [];
        querySnapshot.forEach((docSnap) => {
            comments.push({
                id: docSnap.id,
                ...docSnap.data(),
            });
        });

        return { status: true, data: comments };
    } catch (error) {
        console.error("getCommentsByPostId error:", error);
        return { status: false, errorMessage: error.message, data: [] };
    }
}