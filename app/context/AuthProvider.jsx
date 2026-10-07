"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import {
    doc,
    getDoc,
} from "firebase/firestore";

import { auth, db } from "@/app/services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (authUser) => {

                if (!authUser) {
                    setUser(null);
                    setProfile(null);
                    setLoading(false);
                    return;
                }

                // Immediately set authenticated user
                setUser(authUser);

                try {
                    const userRef = doc(
                        db,
                        "users",
                        authUser.uid
                    );

                    let userSnap = await getDoc(userRef);

                    // If profile doc hasn't been created yet (e.g. signup in progress), retry briefly
                    if (!userSnap.exists()) {
                        await new Promise((resolve) => setTimeout(resolve, 800));
                        userSnap = await getDoc(userRef);
                    }

                    if (userSnap.exists()) {
                        setProfile(userSnap.data());
                    } else {
                        // Fallback profile if Firestore doc is still pending
                        setProfile((prev) => prev || {
                            name: authUser.displayName || "",
                            email: authUser.email || "",
                            role: "author",
                        });
                    }

                } catch (error) {
                    console.error(
                        "Failed to load user profile:",
                        error
                    );

                    setProfile((prev) => prev || null);
                } finally {
                    setLoading(false);
                }
            }
        );

        return () => unsubscribe();
    }, []);

    const refreshProfile = async (fallbackData = null) => {
        if (!auth.currentUser) return null;
        setUser(auth.currentUser);
        if (fallbackData) {
            setProfile(fallbackData);
        }
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                setProfile(data);
                return data;
            } else if (fallbackData) {
                setProfile(fallbackData);
                return fallbackData;
            }
        } catch (error) {
            console.error("Failed to refresh profile:", error);
        }
        return null;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                setUser,
                setProfile,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
