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
    { name: "Categories", href: "/categories" },
    { name: "Tags", href: "/tags" },
    { name: "About", href: "/about" },
];

const Header = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, profile, loading } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const dropdownRef = useRef(null);

    // Close mobile menu / search on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
    }, [pathname]);

    // Handle search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed) return;
        router.push(`/blog?q=${encodeURIComponent(trimmed)}`);
        setMobileSearchOpen(false);
    };

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
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-6">
                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-4 lg:gap-8 shrink-0 min-w-0">
                    <Link href="/" className="flex items-center gap-2 shrink-0 w-[100px] sm:w-auto">
                        <Image
                            src={Logo}
                            alt="NextLog Logo"
                            priority
                            className="h-8 w-auto shrink-0 object-contain"
                        />
                    </Link>

                    <nav className="hidden items-center gap-5 lg:gap-8 lg:flex shrink-0">
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
                                    className={`font-medium transition-colors text-sm lg:text-base ${isActive
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
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
                    {/* Desktop Search Form */}
                    <form onSubmit={handleSearchSubmit} className="relative hidden w-36 md:block lg:w-56 xl:w-64">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-gray-400">
                            search
                        </span>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-1.5 pl-9 pr-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                        />
                    </form>
                    <button
                        type="button"
                        onClick={() => setMobileSearchOpen((prev) => !prev)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden transition-colors"
                        aria-label="Toggle search"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {mobileSearchOpen ? "close" : "search"}
                        </span>
                    </button>

                    {/* Auth Section */}
                    {loading ? (
                        <div className="flex h-8 w-8 items-center justify-center">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        </div>
                    ) : user ? (
                        /* ── Logged-in: Write Post + Avatar Dropdown ── */
                        <div className="flex items-center gap-2 sm:gap-3">
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
                                    <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-gray-200">
                                        <Image
                                            src={avatarSrc || AvatarPlaceholder.src}
                                            alt={displayName}
                                            fill
                                            sizes="32px"
                                            className="object-cover"
                                        />
                                    </div>
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
                                            className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 z-50"
                                            role="menu"
                                            aria-labelledby="user-menu-button"
                                        >
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                                                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                                                    <Image
                                                        src={avatarSrc || AvatarPlaceholder.src}
                                                        alt={displayName}
                                                        fill
                                                        sizes="40px"
                                                        className="object-cover"
                                                    />
                                                </div>
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

                    {/* Mobile/Tablet Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        <span className="material-symbols-outlined text-[24px]">
                            {mobileMenuOpen ? "close" : "menu"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile/Tablet Search Bar Dropdown */}
            <AnimatePresence>
                {mobileSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b border-gray-200 bg-white px-4 py-3 md:hidden"
                    >
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-[18px] text-gray-400">
                                search
                            </span>
                            <input
                                type="search"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles, tags, authors..."
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-16 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile/Tablet Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b border-gray-200 bg-white px-4 py-4 lg:hidden shadow-lg"
                    >
                        <div className="flex flex-col space-y-1">
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
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                            ? "bg-blue-50 text-blue-600 font-semibold"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                            }`}
                                    >
                                        <span>{item.name}</span>
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">
                                            chevron_right
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {user && (
                            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col space-y-1">
                                <Link
                                    href="/dashboard/create-post"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    <span>Write New Post</span>
                                </Link>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                    <span>Dashboard</span>
                                </Link>
                            </div>
                        )}
                    </motion.nav>
                )}
            </AnimatePresence>

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
