"use client"
import Logo from "@/public/screen.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const navItems = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blog" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "About", href: "/about" },
];
const Header = () => {
    const pathname = usePathname();


    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <Link href="/" className={`flex items-center gap-2 ${pathname === '/' ? 'text-blue-600' : ''}`}>
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
                                    aria-current={
                                        isActive ? "page" : undefined
                                    }
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

                    {/* Write Post */}
                    <Link
                        href="#"
                        className="hidden items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:inline-flex"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            add
                        </span>

                        <span>Write Post</span>
                    </Link>

                    {/* Profile */}
                    <div className="flex items-center gap-2 pl-1">
                        <button
                            className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-gray-100 cursor-pointer    "
                        >
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoJRoLUBfzYJH7jutrOGj7WYtAmZXx8kqRf8SDU4w9rKnr97y_xCoAuQpllOaBuaSKgbLkiywP5LNT8c8GW2meLxMblEUAw7rkZ2Q5d4M8lerop7NwkZebtIQoaZtrIRcyLXaqmMw7tI46NdafE_eOu1QwELIZWukifuUQWtqIZQQo7OAfHr515Qfxgf6cnWKHlG9b1nMGYbMK5FcAypuHNQvrPXDrzuo9YsyunX1GDhwSRUFl1xY"
                                alt="Profile"
                                className="h-8 w-8 rounded-full object-cover"
                            />

                            <span className="material-symbols-outlined text-[18px] text-gray-400">
                                keyboard_arrow_down
                            </span>
                        </button>

                        {/* Login / Signup */}
                        <div className="hidden items-center gap-2 pl-1 text-sm text-gray-500 xl:flex">
                            <Link
                                href="/login"
                                className="transition-colors hover:text-gray-900"
                            >
                                Login
                            </Link>

                            <span className="text-gray-300">/</span>

                            <Link
                                href="/signup"
                                className="transition-colors hover:text-gray-900"
                            >
                                Signup
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header >
    );
};

export default Header;
