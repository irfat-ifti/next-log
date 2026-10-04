import { db } from "@/app/services/firebase";
import {
    collection,
    getDocs,
    query,
    orderBy,
    where,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";


const COLLECTION_NAME = "comments"

export async function addComment(comment) {
    try {
        const collectionRef = collection(db, COLLECTION_NAME);

        const commentData = {
            ...comment,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collectionRef, commentData);

        return {
            status: true,
            data: docRef.id,
        };
    } catch (error) {
        console.error("addComment error:", error);

        return {
            status: false,
            errorMessage: error.message,
            data: null,
        };
    }
}

export async function getCommentsByPostId(postId) {
    console.log("postId from comment api:", postId);

    try {
        const collectionRef = collection(db, COLLECTION_NAME);

        const q = query(
            collectionRef,
            where("postId", "==", postId),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        const comments = [];

        querySnapshot.forEach((docSnap) => {
            comments.push({
                id: docSnap.id,
                ...docSnap.data(),
            });
        });

        return {
            status: true,
            data: comments,
        };
    } catch (error) {
        console.error("getCommentsByPostId error:", error);

        return {
            status: false,
            errorMessage: error.message,
            data: [],
        };
    }
}

export async function deleteCommentById(
    commentId,
    currentUserId,
    postAuthorId,
    currentUserRole
) {
    try {
        const collectionRef = collection(db, COLLECTION_NAME);
        const docRef = doc(collectionRef, commentId);

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return {
                status: false,
                errorMessage: "Comment not found",
                data: null,
            };
        }

        const commentData = docSnap.data();

        const canDelete =
            currentUserId === postAuthorId ||
            currentUserRole === "admin" ||
            commentData?.author?.uid === currentUserId;

        if (!canDelete) {
            return {
                status: false,
                errorMessage: "Unauthorized to delete this comment",
                data: null,
            };
        }

        await deleteDoc(docRef);

        return {
            status: true,
            data: null,
        };
    } catch (error) {
        console.error("deleteCommentById error:", error);

        return {
            status: false,
            errorMessage: error.message,
            data: null,
        };
    }
}
