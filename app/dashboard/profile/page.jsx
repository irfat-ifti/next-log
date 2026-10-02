"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/app/services/firebase";
import { useRouter } from "next/navigation";
import ShowToast from "@/app/lib/toast";
import ConfirmationModal from "@/app/components/ConfirmationModal";

export default function ProfilePage() {
    const { user, profile } = useAuth();
    const router = useRouter();

    const [isSaving, setIsSaving] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    // Form state initialized from auth profile
    const [formData, setFormData] = useState({
        name: profile?.name || user?.displayName || "NextLog Author",
        username: profile?.username || user?.email?.split("@")[0] || "author",
        email: user?.email || "author@example.com",
        bio: profile?.bio || "Passionate software engineer and tech writer sharing knowledge on Next.js, React, and modern web development.",
        role: profile?.role || "author",
        x: profile?.socialLinks?.x || "https://x.com/nextlog",
        linkedin: profile?.socialLinks?.linkedin || "https://linkedin.com/in/nextlog",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);

        setTimeout(() => {
            setIsSaving(false);
            ShowToast({
                message: "Profile updated successfully!",
                type: "success",
            });
        }, 600);
    };

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);
            await signOut(auth);
            ShowToast({ message: "Signed out successfully", type: "success" });
            setShowSignOutModal(false);
            router.push("/login");
        } catch (err) {
            ShowToast({ message: err.message || "Failed to sign out", type: "error" });
        } finally {
            setIsSigningOut(false);
        }
    };

    const avatarSrc = profile?.avatar || user?.photoURL || null;
    const displayName = formData.name;
    const initials = displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const joinedDate = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "October 2024";

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            {/* Header & Cover Banner */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
                {/* Banner Gradient */}
                <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 relative">
                    <div className="absolute right-4 top-4 flex items-center gap-2">
                        <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                            Member since {joinedDate}
                        </span>
                    </div>
                </div>

                {/* Profile Card Info */}
                <div className="relative px-6 pb-6 pt-0 sm:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-14 sm:-mt-16 gap-4">
                        <div className="flex items-end gap-4">
                            <div className="relative">
                                {avatarSrc ? (
                                    <img
                                        src={avatarSrc}
                                        alt={displayName}
                                        className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl bg-blue-600 text-2xl sm:text-3xl font-bold text-white ring-4 ring-white shadow-md">
                                        {initials}
                                    </div>
                                )}
                                <span className="absolute bottom-1 right-1 flex h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </div>

                            <div className="mb-2">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {displayName}
                                    </h1>
                                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 capitalize">
                                        {formData.role}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">@{formData.username}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowSignOutModal(true)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Form Details */}
            <form onSubmit={handleSave} className="space-y-6">
                {/* Personal Information */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Update your public author profile details and biography.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">@</span>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="username"
                                    className="w-full rounded-xl border border-gray-200 pl-8 pr-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    disabled
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                    <span>Verified</span>
                                </span>
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                Account Role
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                readOnly
                                disabled
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 capitalize cursor-not-allowed"
                            />
                        </div>

                        {/* Bio */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                Author Bio
                            </label>
                            <textarea
                                name="bio"
                                rows={4}
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Write a short bio about yourself..."
                                className="w-full rounded-xl border border-gray-200 p-3.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                            />
                            <p className="mt-1 text-right text-xs text-gray-400">
                                {formData.bio.length} characters
                            </p>
                        </div>
                    </div>
                </div>

                {/* Social Profiles */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Social Connections</h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Connect your social accounts to display on your author articles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* X / Twitter */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                X (Twitter) URL
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-gray-400">
                                    link
                                </span>
                                <input
                                    type="text"
                                    name="x"
                                    value={formData.x}
                                    onChange={handleChange}
                                    placeholder="https://x.com/yourhandle"
                                    className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                                />
                            </div>
                        </div>

                        {/* LinkedIn */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                LinkedIn URL
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-gray-400">
                                    link
                                </span>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/yourhandle"
                                    className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                    >
                        {isSaving ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                <span>Saving changes...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">check</span>
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Sign Out Confirmation Modal */}
            <ConfirmationModal
                isOpen={showSignOutModal}
                onClose={() => !isSigningOut && setShowSignOutModal(false)}
                onConfirm={handleSignOut}
                title="Sign Out"
                message="Are you sure you want to sign out from your account? You will need to log back in to access the dashboard."
                confirmText="Sign Out"
                cancelText="Cancel"
                variant="danger"
                icon="logout"
                isLoading={isSigningOut}
            />
        </div>
    );
}
