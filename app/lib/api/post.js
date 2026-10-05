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
    limit,
    startAfter,
    increment,
} from "firebase/firestore";
import { uploadImageToImgBB } from "@/app/services/imgbb";

const COLLECTION_NAME = "posts";

async function adjustCategoryPostCount(categoryIdentifier, delta) {
    if (!categoryIdentifier) return;
    try {
        const catRef = collection(db, "categories");
        let catDocRef = null;
        const cleanSlug = categoryIdentifier.toLowerCase().trim().replace(/\s+/g, "-");

        // Check by slug first
        const qSlug = query(catRef, where("slug", "==", cleanSlug), limit(1));
        const snapSlug = await getDocs(qSlug);
        if (!snapSlug.empty) {
            catDocRef = snapSlug.docs[0].ref;
        } else {
            // Check by exact name
            const qName = query(catRef, where("name", "==", categoryIdentifier), limit(1));
            const snapName = await getDocs(qName);
            if (!snapName.empty) {
                catDocRef = snapName.docs[0].ref;
            } else {
                // If ID directly
                catDocRef = doc(db, "categories", categoryIdentifier);
            }
        }
        if (catDocRef) {
            await updateDoc(catDocRef, { posts: increment(delta) });
        }
    } catch (e) {
        console.warn("Could not adjust category post count:", e?.message);
    }
}

async function adjustTagsPostCount(tags, delta) {
    if (!Array.isArray(tags)) return;
    for (const tag of tags) {
        try {
            const tagId = typeof tag === "object" ? tag.id : null;
            const tagSlug = (typeof tag === "object" ? tag.slug || tag.name : tag || "").toLowerCase().trim();
            if (tagId) {
                await updateDoc(doc(db, "tags", tagId), { posts: increment(delta) });
            } else if (tagSlug) {
                const q = query(collection(db, "tags"), where("slug", "==", tagSlug), limit(1));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    await updateDoc(snap.docs[0].ref, { posts: increment(delta) });
                }
            }
        } catch (e) {
            console.warn("Could not adjust tag post count:", e?.message);
        }
    }
}

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
        const tagSlugs = formattedTags.map((t) => t.slug || t.name.toLowerCase().trim()).filter(Boolean);

        // Build final Firestore document
        const newPost = {
            title: post.title.trim(),
            slug: post.slug?.trim() || "",
            excerpt: post.excerpt?.trim() || "",
            content: post.content ?? null,
            contentHtml: post.contentHtml || "",
            category: post.category || "",
            categorySlug: (post.category || "").toLowerCase().trim().replace(/\s+/g, "-"),
            tags: formattedTags,
            tagSlugs,
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
            if (newPost.status === "published") {
                adjustCategoryPostCount(newPost.category, 1);
                adjustTagsPostCount(newPost.tags, 1);
            }

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

export async function getPosts(options = {}) {
    try {
        const opts = typeof options === "number" ? { pageSize: options } : (options || {});
        const {
            pageSize = null,
            lastDoc = null,
            category = null,
            tag = null,
            status = "published",
            orderByField = "createdAtTimestamp",
            orderDirection = "desc",
        } = opts;

        const collectionRef = collection(db, COLLECTION_NAME);
        const cleanCategory = category && category !== "all" ? category.trim() : null;
        const targetCategorySlug = cleanCategory ? cleanCategory.toLowerCase().replace(/\s+/g, "-") : null;
        const cleanTag = tag && tag.trim() ? tag.toLowerCase().trim().replace(/^#/, "") : null;
        const limitCount = pageSize && typeof pageSize === "number" && pageSize > 0 ? pageSize + 1 : null;

        let querySnapshot;

        // If filtering by tag, category, or both
        if (targetCategorySlug || cleanTag) {
            try {
                const specificConstraints = [];
                if (status) specificConstraints.push(where("status", "==", status));
                if (targetCategorySlug) specificConstraints.push(where("categorySlug", "==", targetCategorySlug));
                if (cleanTag) specificConstraints.push(where("tagSlugs", "array-contains", cleanTag));
                if (orderByField) specificConstraints.push(orderBy(orderByField, orderDirection));
                if (lastDoc) specificConstraints.push(startAfter(lastDoc));
                if (limitCount) specificConstraints.push(limit(limitCount));

                const qSpecific = query(collectionRef, ...specificConstraints);
                querySnapshot = await getDocs(qSpecific);
            } catch {
                // Fallback without compound orderBy if index is absent
                try {
                    const fallbackConstraints = [];
                    if (status) fallbackConstraints.push(where("status", "==", status));
                    if (targetCategorySlug) fallbackConstraints.push(where("categorySlug", "==", targetCategorySlug));
                    if (cleanTag) fallbackConstraints.push(where("tagSlugs", "array-contains", cleanTag));
                    if (limitCount) fallbackConstraints.push(limit(limitCount));

                    const qFallback = query(collectionRef, ...fallbackConstraints);
                    querySnapshot = await getDocs(qFallback);
                } catch {
                    // General scan fallback if needed
                    const allSnap = await getDocs(collectionRef);
                    querySnapshot = allSnap;
                }
            }
        } else {
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
            if (limitCount) {
                constraints.push(limit(limitCount));
            }

            try {
                const q = query(collectionRef, ...constraints);
                querySnapshot = await getDocs(q);
            } catch (queryErr) {
                console.warn("Primary getPosts query failed. Falling back:", queryErr?.message);
                const fallbackConstraints = [];
                if (status) fallbackConstraints.push(where("status", "==", status));
                if (limitCount) fallbackConstraints.push(limit(limitCount));
                const qFallback = query(collectionRef, ...fallbackConstraints);
                querySnapshot = await getDocs(qFallback);
            }
        }

        const rawDocs = querySnapshot.docs;
        const hasMore = limitCount ? rawDocs.length > pageSize : false;
        const resultDocs = hasMore ? rawDocs.slice(0, pageSize) : rawDocs;

        let posts = resultDocs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        }));

        // Post-filter check for category (supporting name or slug)
        if (targetCategorySlug) {
            posts = posts.filter((p) => {
                const pSlug = (p.categorySlug || "").toLowerCase().trim();
                const pName = String(p.category || "").toLowerCase().trim().replace(/\s+/g, "-");
                return pSlug === targetCategorySlug || pName === targetCategorySlug;
            });
        }

        // Post-filter check for tag
        if (cleanTag) {
            posts = posts.filter((p) => {
                if (Array.isArray(p.tagSlugs) && p.tagSlugs.includes(cleanTag)) return true;
                if (!Array.isArray(p.tags)) return false;
                return p.tags.some((t) => {
                    const name = typeof t === "object" ? t.name : t;
                    const slug = typeof t === "object" ? t.slug : "";
                    const id = typeof t === "object" ? t.id : "";
                    return (
                        (name && String(name).toLowerCase() === cleanTag) ||
                        (slug && String(slug).toLowerCase() === cleanTag) ||
                        (id && String(id).toLowerCase() === cleanTag)
                    );
                });
            });
        }

        const lastVisibleDoc = resultDocs.length > 0 ? resultDocs[resultDocs.length - 1] : null;

        return {
            status: true,
            data: posts,
            lastDoc: lastVisibleDoc,
            hasMore: Boolean(hasMore),
            totalFetched: posts.length,
        };
    } catch (error) {
        console.error("getPosts error:", error);

        return {
            status: false,
            errorMessage: error.message,
            data: [],
            lastDoc: null,
            hasMore: false,
            totalFetched: 0,
        };
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
 * Gets a single post by document ID.
 */
export async function getPostById(id) {
    try {
        if (!id) {
            return {
                status: false,
                errorMessage: "Post ID is required",
            };
        }

        const docRef = doc(db, COLLECTION_NAME, String(id));
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return {
                status: false,
                errorMessage: "Post not found",
            };
        }

        return {
            status: true,
            data: {
                id: docSnap.id,
                ...docSnap.data(),
            },
        };
    } catch (error) {
        console.error("getPostById error:", error);
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
        if (!postData) {
            return { status: false, errorMessage: "Post data is required" };
        }

        let featuredImageData = postData.featuredImage;

        // Upload featured image to ImgBB if a new File is provided
        if (typeof window !== "undefined" && postData.featuredImage instanceof File) {
            const uploadResult = await uploadImageToImgBB(postData.featuredImage);
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
        } else if (typeof postData.featuredImage === "string" && postData.featuredImage.trim()) {
            featuredImageData = {
                url: postData.featuredImage.trim(),
                displayUrl: postData.featuredImage.trim(),
                name: "featured-image",
                type: "image/*",
                size: 0,
            };
        }

        // Clean & format tags if provided
        let formattedTags = postData.tags;
        if (Array.isArray(postData.tags)) {
            formattedTags = postData.tags.map((tag) => {
                if (typeof tag === "string") {
                    return { id: tag, name: tag, slug: tag.toLowerCase() };
                }
                return {
                    id: tag.id || "",
                    name: tag.name || "",
                    slug: tag.slug || "",
                };
            });
        }

        const docRef = doc(db, COLLECTION_NAME, String(id));
        const updateData = {
            ...postData,
            featuredImage: featuredImageData ?? null,
            ...(formattedTags !== undefined ? {
                tags: formattedTags,
                tagSlugs: formattedTags.map((t) => t.slug || t.name.toLowerCase().trim()).filter(Boolean),
            } : {}),
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
        const postSnap = await getDoc(docRef);
        const postData = postSnap.exists() ? postSnap.data() : null;

        await deleteDoc(docRef);

        if (postData && (postData.status === "published" || !postData.status)) {
            adjustCategoryPostCount(postData.category, -1);
            adjustTagsPostCount(postData.tags, -1);
        }

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

/**
 * Fetches all posts where author.uid matches the given user UID.
 */
export async function getPostsByAuthorUid(uid) {
    try {
        if (!uid) {
            return {
                status: false,
                errorMessage: "Author UID is required",
                data: [],
            };
        }

        const collectionRef = collection(db, COLLECTION_NAME);

        const q = query(
            collectionRef,
            where("author.uid", "==", uid)
        );

        const querySnapshot = await getDocs(q);
        console.log("UID:", uid);
        console.log("Matched documents:", querySnapshot.size);

        querySnapshot.forEach((docSnap) => {
            console.log("Document:", docSnap.id, docSnap.data());
        });
        const posts = [];

        querySnapshot.forEach((docSnap) => {
            posts.push({
                id: docSnap.id,
                ...docSnap.data(),
            });
        });

        return {
            status: true,
            data: posts,
        };
    } catch (error) {
        console.error("getPostsByAuthorUid error:", error);

        return {
            status: false,
            errorMessage: error.message || "Failed to get posts",
            data: [],
        };
    }
}
