"use client";
import TaxonomyManager from "@/app/dashboard/components/TaxonomyManager";
import { useAuth } from "@/app/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
    getTags,
    createTag,
    updateTag,
    deleteTag,
    toggleTagStatus,
} from "@/app/lib/api/tag";


export default function TagManagement() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user || !profile) {
            router.push("/login");
            return;
        }

        if (profile.role !== "admin") {
            router.push("/dashboard");
        }
    }, [loading, user, profile, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !profile || profile.role !== "admin") {
        return <div>Loading...</div>;
    }
    return (
        <TaxonomyManager
            type="tag"
            title="Tags"
            subtitle="Manage post tags and their SEO settings."
            buttonLabel="Add Tag"
            searchPlaceholder="Search tags..."
            statPostsLabel="Tagged Posts"
            hasParent={false}
            fetchItems={getTags}
            createItem={createTag}
            updateItem={updateTag}
            deleteItem={deleteTag}
            toggleItemStatus={toggleTagStatus}
        />
    );
}
