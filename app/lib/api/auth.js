import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";

import {
    doc,
    setDoc,
} from "firebase/firestore";

import { auth, db } from "@/app/services/firebase";

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        return {
            status: true,
            message: "Login successful",
            user,
        };

    } catch (error) {

        return {
            status: false,
            error: error.message,
        };
    }
}

export async function signup(name, email, password) {
    try {
        // 1. Create Firebase Auth account
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        // 2. Add display name to Auth profile
        await updateProfile(user, {
            displayName: name,
        });

        // 3. Create Firestore user document
        const userInformation = {
            name: name,
            bio: "",
            avatar: null,
            username: "",
            role: "author",

            socialLinks: {
                x: "",
                linkedin: "",
            },
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        // 4. Document ID = Firebase Auth UID
        await setDoc(
            doc(db, "users", user.uid),
            userInformation
        );

        return {
            status: true,
            message: "User created successfully",
            user,
            userInformation,
        };

    } catch (error) {

        return {
            status: false,
            error: error.message,
        };
    }
}

export async function getUserById(uid) {
    try {
        if (!uid) {
            return {
                status: false,
                error: "User ID is required",
            };
        }

        const { getDoc } = await import("firebase/firestore");
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return {
                status: true,
                data: {
                    uid,
                    ...userSnap.data(),
                },
            };
        }

        return {
            status: false,
            error: "User not found",
        };
    } catch (error) {
        return {
            status: false,
            error: error.message,
        };
    }
}

export async function updateUserProfile(uid, profileData) {
    try {
        if (!uid) {
            return {
                status: false,
                error: "User ID is required",
            };
        }

        const { updateDoc } = await import("firebase/firestore");
        const userRef = doc(db, "users", uid);

        let avatarUrl = profileData.avatar;
        // Check if avatar is a new File instance to upload
        if (profileData.avatarFile && typeof window !== "undefined" && profileData.avatarFile instanceof File) {
            const { uploadImageToImgBB } = await import("@/app/services/imgbb");
            const uploadRes = await uploadImageToImgBB(profileData.avatarFile);
            avatarUrl = uploadRes?.displayUrl || uploadRes?.url || avatarUrl;
        }

        const updatedFields = {
            name: profileData.name || "",
            bio: profileData.bio || "",
            avatar: avatarUrl || null,
            socialLinks: {
                x: profileData.x || profileData.socialLinks?.x || "",
                linkedin: profileData.linkedin || profileData.socialLinks?.linkedin || "",
            },
            updatedAt: Date.now(),
        };

        await updateDoc(userRef, updatedFields);

        // Also sync auth profile displayName and photoURL if current user matches
        if (auth.currentUser && auth.currentUser.uid === uid) {
            await updateProfile(auth.currentUser, {
                displayName: updatedFields.name,
                photoURL: updatedFields.avatar,
            });
        }

        return {
            status: true,
            message: "Profile updated successfully!",
            data: updatedFields,
        };
    } catch (error) {
        console.error("Failed to update user profile:", error);
        return {
            status: false,
            error: error.message || "Failed to update profile",
        };
    }
}
