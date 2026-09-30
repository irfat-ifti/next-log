import { db } from "@/app/services/firebase";
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { uploadImageToImgBB } from "@/app/services/imgbb";

const COLLECTION_NAME = "posts";

/**
 * Creates a new post in Firestore and uploads featured image to Firebase Storage if a File is provided.
 */
export async function createPost(post) {
    try {
        if (!post) {
            return { status: false, errorMessage: "Post data is required" };
        }

        if (!post.title || !post.title.trim()) {
            return { status: false, errorMessage: "Post title is required" };
        }

        let featuredImageData = null;

        // Upload featured image to ImgBB if it's a File instance
        if (typeof window !== "undefined" && post.featuredImage instanceof File) {
            const uploadResult = await uploadImageToImgBB(post.featuredImage);
            featuredImageData = {
                url: uploadResult.url,
                displayUrl: uploadResult.displayUrl,
                thumbUrl: uploadResult.thumbUrl,
                deleteUrl: uploadResult.deleteUrl,
                id: uploadResult.id,
                name: uploadResult.name,
                type: uploadResult.type,
                size: uploadResult.size,
            };
        } else if (post.featuredImage && typeof post.featuredImage === "object" && post.featuredImage.url) {
            featuredImageData = post.featuredImage;
        } else if (typeof post.featuredImage === "string" && post.featuredImage.trim()) {
            featuredImageData = {
                url: post.featuredImage.trim(),
                displayUrl: post.featuredImage.trim(),
                name: "featured-image",
                type: "image/*",
                size: 0,
            };
        }

        // Clean & format tags
        const formattedTags = Array.isArray(post.tags)
            ? post.tags.map((tag) => {
                if (typeof tag === "string") {
                    return { id: tag, name: tag, slug: tag.toLowerCase() };
                }
                return {
                    id: tag.id || "",
                    name: tag.name || "",
                    slug: tag.slug || "",
                };
            })
            : [];

        // Build final Firestore document
        const newPost = {
            title: post.title.trim(),
            slug: post.slug?.trim() || "",
            excerpt: post.excerpt?.trim() || "",
            content: post.content ?? null,
            contentHtml: post.contentHtml || "",
            category: post.category || "",
            tags: formattedTags,
            featuredImage: featuredImageData,
            isFeatured: Boolean(post.isFeatured),
            status: post.status || "published",
            publishDate: post.publishDate || new Date().toISOString(),
            metaTitle: post.metaTitle?.trim() || "",
            metaDesc: post.metaDesc?.trim() || "",
            keywords: Array.isArray(post.keywords) ? post.keywords : [],
            ogImage: post.ogImage || "",
            author: post.author || "Admin",
            allowComments: post.allowComments !== undefined ? Boolean(post.allowComments) : true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdAtTimestamp: Date.now(),
        };

        const collectionRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(collectionRef, newPost);

        if (docRef?.id) {
            return {
                status: true,
                post_id: docRef.id,
                data: { id: docRef.id, ...newPost },
                successMessage: "Post created successfully",
            };
        }

        return { status: false, errorMessage: "Failed to create post" };
    } catch (error) {
        console.error("createPost error:", error);
        return { status: false, errorMessage: error.message };
    }
}

/**
 * Fetches all posts ordered by creation date.
 */
export async function getPosts() {
    try {
        const collectionRef = collection(db, COLLECTION_NAME);
        let querySnapshot;
        try {
            const q = query(collectionRef, orderBy("createdAtTimestamp", "desc"));
            querySnapshot = await getDocs(q);
        } catch {
            querySnapshot = await getDocs(collectionRef);
        }

        const posts = [];
        querySnapshot.forEach((docSnap) => {
            posts.push({
                id: docSnap.id,
                ...docSnap.data(),
            });
        });

        return { status: true, data: posts };
    } catch (error) {
        console.error("getPosts error:", error);
        return { status: false, errorMessage: error.message, data: [] };
    }
}

/**
 * Gets a single post by ID.
 */
export async function getPostBySlug(slug) {
    try {
        if (!slug) {
            return {
                status: false,
                errorMessage: "Post slug is required",
            };
        }

        const collectionRef = collection(db, COLLECTION_NAME);

        const q = query(
            collectionRef,
            where("slug", "==", slug)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return {
                status: false,
                errorMessage: "Post not found",
            };
        }

        const docSnap = querySnapshot.docs[0];

        return {
            status: true,
            data: {
                id: docSnap.id,
                ...docSnap.data(),
            },
        };
    } catch (error) {
        console.error("getPostBySlug error:", error);

        return {
            status: false,
            errorMessage: error.message || "Failed to get post",
        };
    }
}

/**
 * Updates an existing post.
 */
export async function updatePost(id, postData) {
    try {
        if (!id) {
            return { status: false, errorMessage: "Post ID is required" };
        }

        const docRef = doc(db, COLLECTION_NAME, String(id));
        const updateData = {
            ...postData,
            updatedAt: serverTimestamp(),
            updatedAtTimestamp: Date.now(),
        };

        delete updateData.id;

        await updateDoc(docRef, updateData);
        return {
            status: true,
            id,
            data: { id, ...updateData },
            successMessage: "Post updated successfully",
        };
    } catch (error) {
        console.error("updatePost error:", error);
        return { status: false, errorMessage: error.message };
    }
}

/**
 * Deletes a post.
 */
export async function deletePost(id) {
    try {
        if (!id) {
            return { status: false, errorMessage: "Post ID is required" };
        }

        const docRef = doc(db, COLLECTION_NAME, String(id));
        await deleteDoc(docRef);

        return {
            status: true,
            id,
            successMessage: "Post deleted successfully",
        };
    } catch (error) {
        console.error("deletePost error:", error);
        return { status: false, errorMessage: error.message };
    }
}