
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthProvider";

import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return <LoadingSpinner fullScreen label="Verifying authentication..." size={46} />;
    }

    if (!user) {
        return null;
    }

    return children;
}
