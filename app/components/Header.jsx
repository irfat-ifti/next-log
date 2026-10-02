"use client";

import Logo from "@/public/screen.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/app/services/firebase";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import ShowToast from "@/app/lib/toast";
import AvatarPlaceholder from "@/public/user.jpg";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blog" },
    { name: "About", href: "/about" },
];

const Header = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, profile, loading } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const confirmLogout = async () => {
        try {
            setSigningOut(true);
            await signOut(auth);
            ShowToast({ message: "Signed out successfully", type: "success" });
            setShowSignOutModal(false);
            router.push("/");
        } catch (err) {
            ShowToast({ message: err.message || "Failed to sign out", type: "error" });
        } finally {
            setSigningOut(false);
        }
    };

    // Avatar: prefer Firestore avatar, then Firebase Auth photoURL, then initials
    const avatarSrc = profile?.avatar || user?.photoURL || null;
    const displayName = profile?.name || user?.displayName || "User";
    const email = user?.email || "";
    const role = profile?.role || "author";

    const initials = displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4">
                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src={Logo}
                            alt="NextLog Logo"
                            className="h-8 w-auto object-contain"
                        />
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => {
                            const isActive =
                                item.href === "/"
                                    ? pathname === "/"
                                    : pathname === item.href ||
                                    pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`font-medium transition-colors ${isActive
                                        ? "text-blue-600"
                                        : "text-gray-500 hover:text-blue-600"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative hidden w-48 sm:block lg:w-64">
                        <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[18px] text-gray-400">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search articles, tags..."
                            className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Auth Section */}
                    {loading ? (
                        /* Loading skeleton */
                        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                    ) : user ? (
                        /* ── Logged-in: Write Post + Avatar Dropdown ── */
                        <div className="flex items-center gap-3">
                            <Link
                                href="/dashboard/create-post"
                                className="hidden items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:inline-flex"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                <span>Write Post</span>
                            </Link>

                            {/* Avatar + Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    id="user-menu-button"
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className="flex items-center gap-1 rounded-full p-0.5 transition-colors hover:ring-2 hover:ring-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                                    aria-haspopup="true"
                                    aria-expanded={dropdownOpen}
                                >
                                    {avatarSrc ? (
                                        <img
                                            src={avatarSrc}
                                            alt={displayName}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <Image
                                            src={AvatarPlaceholder.src}
                                            alt={displayName}
                                            width={32}
                                            height={32}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    )}
                                    <span
                                        className={`material-symbols-outlined text-[18px] text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                    >
                                        keyboard_arrow_down
                                    </span>
                                </button>

                                {/* Dropdown Panel with Framer Motion */}
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -6 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -6 }}
                                            transition={{ duration: 0.15, ease: "easeOut" }}
                                            id="user-dropdown"
                                            className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5"
                                            role="menu"
                                            aria-labelledby="user-menu-button"
                                        >
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                                                {avatarSrc ? (
                                                    <img
                                                        src={avatarSrc}
                                                        alt={displayName}
                                                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                                        {initials}
                                                    </span>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                        {displayName}
                                                    </p>
                                                    <p className="truncate text-xs text-gray-400">{email}</p>
                                                    <span className="mt-0.5 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium capitalize text-blue-600">
                                                        {role}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-1" role="none">
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                                                    role="menuitem"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        dashboard
                                                    </span>
                                                    Dashboard
                                                </Link>

                                                <Link
                                                    href="/dashboard/profile"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                                                    role="menuitem"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        person
                                                    </span>
                                                    My Profile
                                                </Link>

                                                <Link
                                                    href="/dashboard/create-post"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-600"
                                                    role="menuitem"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        edit_note
                                                    </span>
                                                    Write Post
                                                </Link>
                                            </div>

                                            {/* Logout */}
                                            <div className="border-t border-gray-100 py-1" role="none">
                                                <button
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        setShowSignOutModal(true);
                                                    }}
                                                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
                                                    role="menuitem"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        logout
                                                    </span>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        /* ── Not logged in: Login / Signup ── */
                        <div className="flex items-center gap-2 text-sm">
                            <Link
                                href="/login"
                                className="rounded-lg px-3 py-1.5 font-medium text-gray-600 transition-colors hover:text-blue-600"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Sign Out Confirmation Modal */}
            <ConfirmationModal
                isOpen={showSignOutModal}
                onClose={() => !signingOut && setShowSignOutModal(false)}
                onConfirm={confirmLogout}
                title="Sign Out"
                message="Are you sure you want to sign out of your NextLog account?"
                confirmText="Sign Out"
                cancelText="Stay logged in"
                variant="danger"
                icon="logout"
                isLoading={signingOut}
            />
        </header>
    );
};

export default Header;
