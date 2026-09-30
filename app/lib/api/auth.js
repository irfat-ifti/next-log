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
        console.error(
            "Error [",
            error.code,
            "]:",
            error.message
        );

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
        console.error(
            "Error [",
            error.code,
            "]:",
            error.message
        );

        return {
            status: false,
            error: error.message,
        };
    }
}