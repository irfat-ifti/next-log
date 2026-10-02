"use client";
import { useAuth } from "@/app/context/AuthProvider";
import TaxonomyManager from "@/app/dashboard/components/TaxonomyManager";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
} from "@/app/lib/api/category";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function CategoryManagement() {
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

    if (loading || !user || !profile || profile.role !== "admin") {
        return <LoadingSpinner fullScreen label="Loading category manager..." size={42} />;
    }
    return (
        <TaxonomyManager
            type="category"
            title="Categories"
            subtitle="Manage post categories and their SEO settings."
            buttonLabel="Add Category"
            searchPlaceholder="Search categories..."
            statPostsLabel="Total Posts"
            hasParent={true}
            fetchItems={getCategories}
            createItem={createCategory}
            updateItem={updateCategory}
            deleteItem={deleteCategory}
            toggleItemStatus={toggleCategoryStatus}
            initialData={[]}
        />
    );
}
