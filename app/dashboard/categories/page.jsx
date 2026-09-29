"use client";
import React from "react";
import TaxonomyManager from "@/app/dashboard/components/TaxonomyManager";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
} from "@/app/lib/api/category";

export default function CategoryManagement() {
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
