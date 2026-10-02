"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthProvider";

export default function DashboardLayout({ children }) {
    const { user, profile } = useAuth();
    const pathname = usePathname();

    const isTabActive = (href) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname === href || pathname?.startsWith(`${href}/`);
    };

    const navItems = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: "dashboard",
        },
        {
            label: "My Posts",
            href: "/dashboard/posts",
            icon: "article",
        },
        {
            label: "Create Post",
            href: "/dashboard/create-post",
            icon: "edit_note",
        },
        ...(profile?.role === "admin"
            ? [
                  {
                      label: "Categories",
                      href: "/dashboard/categories",
                      icon: "category",
                  },
                  {
                      label: "Tags",
                      href: "/dashboard/tags",
                      icon: "sell",
                  },
              ]
            : []),
        {
            label: "My Profile",
            href: "/dashboard/profile",
            icon: "person",
        },
    ];

    const avatarSrc = profile?.avatar || user?.photoURL || null;
    const displayName = profile?.name || user?.displayName || "Author";
    const role = profile?.role || "author";

    const initials = displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <ProtectedRoute>
            <div className="mt-16 flex min-h-[calc(100vh-4rem)] bg-gray-50/60">
                {/* Modern Consistent Sidebar */}
                <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col justify-between border-r border-gray-200 bg-white md:flex">
                    <div className="flex flex-col overflow-y-auto p-4">
                        {/* Dashboard section title */}
                        <div className="px-3 pb-3 pt-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                Management
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <nav className="space-y-1 text-sm font-medium">
                            {navItems.map((item) => {
                                const active = isTabActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all ${
                                            active
                                                ? "bg-blue-50 text-blue-600 font-semibold shadow-xs"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                    >
                                        <span
                                            className={`material-symbols-outlined text-[20px] transition-colors ${
                                                active
                                                    ? "text-blue-600"
                                                    : "text-gray-400 group-hover:text-gray-600"
                                            }`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Current User Profile Footer */}
                    <div className="border-t border-gray-100 p-3">
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-gray-50 group"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {avatarSrc ? (
                                    <img
                                        alt={displayName}
                                        className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100 shrink-0"
                                        src={avatarSrc}
                                    />
                                ) : (
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shrink-0">
                                        {initials}
                                    </span>
                                )}
                                <div className="leading-tight min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                                        {displayName}
                                    </p>
                                    <p className="truncate text-xs text-gray-400 capitalize">
                                        {role}
                                    </p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-gray-600">
                                chevron_right
                            </span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
