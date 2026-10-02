"use client";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import ShowToast from "@/app/lib/toast";
import { Oval, TailSpin } from "react-loader-spinner";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { sanitizeSlug, isSlugAvailable } from "@/app/lib/slug";

const emptyForm = {
    name: "",
    slug: "",
    parent: "",
    description: "",
    status: "Active",
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
};



export default function TaxonomyManager({
    type = "category",
    title = "Categories",
    subtitle = "Manage post categories and their SEO settings.",
    buttonLabel = "Add Category",
    searchPlaceholder = "Search categories...",
    statPostsLabel = "Total Posts",
    hasParent = false,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    toggleItemStatus,
}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteTarget, setDeleteTarget] = useState(null);
    // null = unchecked, true = available, false = taken, "checking" = in progress
    const [slugAvailable, setSlugAvailable] = useState(null);
    const slugManuallyEdited = useRef(false);
    const slugDebounceTimer = useRef(null);

    // Initial load from API
    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            setLoading(true);
            try {
                if (typeof fetchItems === "function") {
                    const res = await fetchItems();
                    if (isMounted) {
                        if (res?.status && Array.isArray(res.data) && res.data.length > 0) {
                            setItems(res.data);
                        } else if (res?.status && Array.isArray(res.data)) {
                            setItems(res.data);
                        }
                    }
                }
            } catch (err) {
                console.error(`Failed to load ${type} items:`, err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, [fetchItems, type]);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch =
                (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
                (item.slug || "").toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [items, search, statusFilter]);

    // Debounced slug availability check
    const checkSlugAvailability = useCallback(
        (slug, excludeId = null, collectionName = type === "category" ? "categories" : "tags") => {
            clearTimeout(slugDebounceTimer.current);
            const clean = sanitizeSlug(slug);
            if (!clean) {
                setSlugAvailable(null);
                return;
            }
            setSlugAvailable("checking");
            slugDebounceTimer.current = setTimeout(async () => {
                const available = await isSlugAvailable(collectionName, clean, excludeId);
                setSlugAvailable(available);
            }, 500);
        },
        [type]
    );

    const openCreateModal = () => {
        setEditingItem(null);
        setForm(emptyForm);
        slugManuallyEdited.current = false;
        setSlugAvailable(null);
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setForm({
            name: item.name || "",
            slug: item.slug || "",
            parent: hasParent && item.parent !== "None" ? item.parent : "",
            description: item.description || "",
            status: item.status || "Active",
            seoTitle: item.seoTitle || "",
            seoDescription: item.seoDescription || "",
            canonicalUrl: item.canonicalUrl || "",
        });
        slugManuallyEdited.current = false;
        // Existing slug is valid for this item
        setSlugAvailable(item.slug ? true : null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setForm(emptyForm);
        slugManuallyEdited.current = false;
        setSlugAvailable(null);
        clearTimeout(slugDebounceTimer.current);
    };

    const handleNameChange = (value) => {
        setForm((prev) => {
            // Only auto-generate slug when creating and user hasn't manually edited it
            if (!editingItem && !slugManuallyEdited.current) {
                const autoSlug = sanitizeSlug(value, { allowTrailingHyphen: false });
                // Trigger availability check for auto-generated slug
                checkSlugAvailability(autoSlug);
                return { ...prev, name: value, slug: autoSlug };
            }
            return { ...prev, name: value };
        });
    };

    const handleSlugChange = (rawValue) => {
        slugManuallyEdited.current = true;
        const sanitized = sanitizeSlug(rawValue, { allowTrailingHyphen: true });
        setForm((prev) => ({ ...prev, slug: sanitized }));
        checkSlugAvailability(sanitized, editingItem?.id || null);
    };

    const handleSlugBlur = () => {
        // On blur, strip trailing hyphens for the final value
        setForm((prev) => {
            const clean = sanitizeSlug(prev.slug);
            if (clean !== prev.slug) {
                checkSlugAvailability(clean, editingItem?.id || null);
                return { ...prev, slug: clean };
            }
            return prev;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;

        // --- Slug validation ---
        const cleanSlug = sanitizeSlug(form.slug);

        if (!cleanSlug) {
            ShowToast({ message: "Please enter a valid slug.", type: "warning" });
            return;
        }

        if (slugAvailable === "checking") {
            ShowToast({ message: "Please wait while the slug is being checked.", type: "warning" });
            return;
        }

        if (slugAvailable === false) {
            ShowToast({ message: "This slug is already taken. Please choose a unique slug.", type: "error" });
            return;
        }

        // Final Firestore double-check before saving
        const collectionName = type === "category" ? "categories" : "tags";
        const excludeId = editingItem?.id || null;
        const isUnique = await isSlugAvailable(collectionName, cleanSlug, excludeId);
        if (!isUnique) {
            setSlugAvailable(false);
            ShowToast({ message: "This slug is already taken. Please choose a unique slug.", type: "error" });
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...form,
                parent: hasParent ? form.parent || "None" : undefined,
            };

            if (editingItem) {
                if (typeof updateItem === "function") {
                    const res = await updateItem(editingItem.id, payload);
                    if (res?.status) {
                        setItems((prev) =>
                            prev.map((item) =>
                                item.id === editingItem.id
                                    ? { ...item, ...payload, updatedAt: "Just now" }
                                    : item
                            )
                        );
                        ShowToast({
                            message: res.successMessage || `${title.slice(0, -1)} updated successfully!`,
                            type: "success",
                        });
                    } else {
                        ShowToast({
                            message: res?.errorMessage || "Failed to update",
                            type: "error",
                        });
                    }
                } else {
                    setItems((prev) =>
                        prev.map((item) =>
                            item.id === editingItem.id ? { ...item, ...payload } : item
                        )
                    );
                    ShowToast({ message: "Updated successfully!", type: "success" });
                }
            } else {
                if (typeof createItem === "function") {
                    const res = await createItem(payload);
                    if (res?.status) {
                        const newItem = {
                            id: res.id,
                            posts: 0,
                            createdAt: "Just now",
                            ...payload,
                        };
                        setItems((prev) => [newItem, ...prev]);
                        ShowToast({
                            message: res.successMessage || `${title.slice(0, -1)} created successfully!`,
                            type: "success",
                        });
                    } else {
                        ShowToast({
                            message: res?.errorMessage || "Failed to create",
                            type: "error",
                        });
                    }
                } else {
                    const newItem = {
                        id: Date.now(),
                        posts: 0,
                        createdAt: "Just now",
                        ...payload,
                    };
                    setItems((prev) => [newItem, ...prev]);
                    ShowToast({ message: "Created successfully!", type: "success" });
                }
            }
            closeModal();
        } catch (error) {
            console.error("Submit error:", error);
            ShowToast({
                message: error.message || "An unexpected error occurred",
                type: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setDeleting(true);
        try {
            if (typeof deleteItem === "function") {
                const res = await deleteItem(deleteTarget.id);
                if (res?.status) {
                    setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
                    ShowToast({
                        message: res.successMessage || `${title.slice(0, -1)} deleted successfully!`,
                        type: "success",
                    });
                } else {
                    ShowToast({
                        message: res?.errorMessage || "Failed to delete",
                        type: "error",
                    });
                }
            } else {
                setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
                ShowToast({ message: "Deleted successfully!", type: "success" });
            }
        } catch (error) {
            console.error("Delete error:", error);
            ShowToast({ message: error.message || "Failed to delete", type: "error" });
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    const handleToggleStatus = async (item) => {
        const nextStatus = item.status === "Active" ? "Inactive" : "Active";
        try {
            if (typeof toggleItemStatus === "function") {
                const res = await toggleItemStatus(item.id, item.status);
                if (res?.status) {
                    setItems((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
                    );
                    ShowToast({
                        message: `Status changed to ${nextStatus}`,
                        type: "success",
                    });
                } else {
                    ShowToast({
                        message: res?.errorMessage || "Failed to update status",
                        type: "error",
                    });
                }
            } else if (typeof updateItem === "function") {
                const res = await updateItem(item.id, { status: nextStatus });
                if (res?.status) {
                    setItems((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
                    );
                    ShowToast({
                        message: `Status changed to ${nextStatus}`,
                        type: "success",
                    });
                } else {
                    ShowToast({
                        message: res?.errorMessage || "Failed to update status",
                        type: "error",
                    });
                }
            } else {
                setItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
                );
            }
        } catch (error) {
            console.error("Toggle status error:", error);
            ShowToast({ message: error.message || "Failed to change status", type: "error" });
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative w-full">
            {/* Header */}
            <div className="px-8 py-5 border-b border-slate-200/80 bg-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                            Content Management
                        </p>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {subtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm cursor-pointer"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12 5v14M5 12h14"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                        {buttonLabel}
                    </button>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <p className="text-xs font-medium text-slate-500">
                                Total {title}
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {items.length}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <p className="text-xs font-medium text-slate-500">
                                Active {title}
                            </p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">
                                {items.filter((item) => item.status === "Active").length}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <p className="text-xs font-medium text-slate-500">
                                {statPostsLabel}
                            </p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">
                                {items.reduce(
                                    (sum, item) => sum + (Number(item.posts) || 0),
                                    0
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 justify-between">
                            <div className="relative w-full md:max-w-sm">
                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-600 outline-none focus:border-blue-500"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                            {title.slice(0, -1)}
                                        </th>
                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                            Slug
                                        </th>
                                        {hasParent && (
                                            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                                Parent
                                            </th>
                                        )}
                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                            Posts
                                        </th>
                                        <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/70 transition"
                                        >
                                            <td className="px-5 py-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">
                                                        {item.description || "No description"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="text-xs font-mono text-slate-500">
                                                    /{item.slug}
                                                </span>
                                            </td>

                                            {hasParent && (
                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {item.parent || "None"}
                                                </td>
                                            )}

                                            <td className="px-5 py-4">
                                                <span className="text-sm font-medium text-slate-700">
                                                    {item.posts || 0}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(item)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${item.status === "Active"
                                                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                        }`}
                                                    title="Click to toggle status"
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${item.status === "Active"
                                                            ? "bg-emerald-500"
                                                            : "bg-slate-400"
                                                            }`}
                                                    />
                                                    {item.status}
                                                </button>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(item)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.5-9.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 8.5-8.5z"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                            />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget(item)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                                        title="Delete"
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="M6 7h12m-10 0v12m6-12v12M9 7V4h6v3m-9 0h12l-1 14H7L6 7z"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {loading && (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 text-sm">
                                <TailSpin
                                    height="36"
                                    width="36"
                                    color="#2563eb"
                                    ariaLabel="tail-spin-loading"
                                    radius="1"
                                    visible={true}
                                />
                                <span>Loading {title.toLowerCase()}...</span>
                            </div>
                        )}

                        {!loading && filteredItems.length === 0 && (
                            <div className="py-16 text-center">
                                <p className="text-sm font-medium text-slate-600">
                                    No {title.toLowerCase()} found
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Try changing your search or filter, or add a new one.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editingItem ? `Edit ${title.slice(0, -1)}` : `Create ${title.slice(0, -1)}`}
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Configure {title.toLowerCase().slice(0, -1)} details and SEO settings.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M6 18L18 6M6 6l12 12"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                    />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">
                                            {title.slice(0, -1)} Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                            placeholder={`e.g. ${hasParent ? "Technology" : "React"}`}
                                            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                                            <span>Slug</span>
                                            {form.slug && (
                                                <span
                                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                                        slugAvailable === "checking"
                                                            ? "bg-amber-50 text-amber-600"
                                                            : slugAvailable === true
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : slugAvailable === false
                                                            ? "bg-red-50 text-red-500"
                                                            : "bg-slate-100 text-slate-400"
                                                    }`}
                                                >
                                                    {slugAvailable === "checking"
                                                        ? "Checking..."
                                                        : slugAvailable === true
                                                        ? "✓ Available"
                                                        : slugAvailable === false
                                                        ? "✗ Taken"
                                                        : ""}
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            value={form.slug}
                                            onChange={(e) => handleSlugChange(e.target.value)}
                                            onBlur={handleSlugBlur}
                                            placeholder={hasParent ? "technology" : "react"}
                                            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm font-mono outline-none focus:ring-2 transition ${
                                                slugAvailable === false
                                                    ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                                                    : slugAvailable === true
                                                    ? "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/10"
                                                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/10"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div className={`grid grid-cols-1 ${hasParent ? "md:grid-cols-2" : ""} gap-4`}>
                                    {hasParent && (
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                                Parent Category
                                            </label>
                                            <select
                                                value={form.parent}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        parent: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500"
                                            >
                                                <option value="">No Parent</option>
                                                {items
                                                    .filter(
                                                        (item) =>
                                                            !editingItem || item.id !== editingItem.id
                                                    )
                                                    .map((item) => (
                                                        <option key={item.id} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={form.status}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    status: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        placeholder={`Describe this ${title.toLowerCase().slice(0, -1)}...`}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-200">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        SEO Settings
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 mb-4">
                                        Customize how this {title.toLowerCase().slice(0, -1)} appears in search engines.
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                                SEO Title
                                            </label>
                                            <input
                                                type="text"
                                                value={form.seoTitle}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        seoTitle: e.target.value,
                                                    }))
                                                }
                                                placeholder="e.g. Tutorials & Guides"
                                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                                SEO Description
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={form.seoDescription}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        seoDescription: e.target.value,
                                                    }))
                                                }
                                                placeholder="Write a search engine friendly description..."
                                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                                Canonical URL
                                            </label>
                                            <input
                                                type="url"
                                                value={form.canonicalUrl}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        canonicalUrl: e.target.value,
                                                    }))
                                                }
                                                placeholder={`https://example.com/${type}/${form.slug || ""}`}
                                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm disabled:opacity-60 cursor-pointer flex items-center gap-2"
                                >
                                    {saving && (
                                        <Oval
                                            height="16"
                                            width="16"
                                            color="#ffffff"
                                            secondaryColor="rgba(255,255,255,0.4)"
                                            strokeWidth={3}
                                            strokeWidthSecondary={3}
                                            ariaLabel="loading"
                                            visible={true}
                                        />
                                    )}
                                    <span>
                                        {editingItem
                                            ? `Update ${title.slice(0, -1)}`
                                            : `Create ${title.slice(0, -1)}`}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={Boolean(deleteTarget)}
                onClose={() => !deleting && setDeleteTarget(null)}
                onConfirm={handleDelete}
                title={`Delete ${title.toLowerCase().slice(0, -1)}?`}
                message={
                    <span>
                        Are you sure you want to delete{" "}
                        <strong className="text-slate-800 font-semibold">{deleteTarget?.name}</strong>? This action cannot be undone.
                    </span>
                }
                confirmText={`Delete ${title.slice(0, -1)}`}
                cancelText="Cancel"
                variant="danger"
                isLoading={deleting}
            />
        </div>
    );
}
