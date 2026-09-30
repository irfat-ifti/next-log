import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/app/services/firebase";

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Logged in user:", user.email);
        return { status: true, user };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error [", errorCode, "]:", errorMessage);
        return { status: false, error: errorMessage };
    }
}

export async function signup(name, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Registered user:", user.email);
        await updateProfile(user, {
            displayName: name,
        });
        return { status: true, user };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error [", errorCode, "]:", errorMessage);
        return { status: false, error: errorMessage };
    }
}