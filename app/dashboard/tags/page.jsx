"use client";
import React from "react";
import TaxonomyManager from "@/app/dashboard/components/TaxonomyManager";
import {
    getTags,
    createTag,
    updateTag,
    deleteTag,
    toggleTagStatus,
} from "@/app/lib/api/tag";


export default function TagManagement() {
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
