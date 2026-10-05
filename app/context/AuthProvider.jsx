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

                try {
                    const userRef = doc(
                        db,
                        "users",
                        authUser.uid
                    );

                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        setUser(authUser);
                        setProfile(userSnap.data());
                    } else {
                        setProfile(null);
                    }

                } catch (error) {
                    console.error(
                        "Failed to load user profile:",
                        error
                    );

                    setProfile(null);
                } finally {
                    setLoading(false);
                }
            }
        );

        return () => unsubscribe();
    }, []);

    const refreshProfile = async () => {
        if (!auth.currentUser) return null;
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                setProfile(data);
                return data;
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