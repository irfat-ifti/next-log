"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthProvider";

export default function RootLayout({ children }) {
  const { user, profile, loading } = useAuth();
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
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
        </svg>
      ),
    },
    {
      label: "Posts",
      href: "/dashboard/posts",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
    },
    {
      label: "Create Post",
      href: "/dashboard/create-post",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
    },
    ...(profile?.role === "admin"
      ? [
        {
          label: "Categories",
          href: "/dashboard/categories",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
              />
            </svg>
          ),
        },
        {
          label: "Tags",
          href: "/dashboard/tags",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
              />
            </svg>
          ),
        },
      ]
      : []),


    {
      label: "Authors",
      href: "/dashboard/authors",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
        </svg>
      ),
    },
    {
      label: "Settings",
      href: "/dashboard/comments",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
          <path
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="mt-16 h-full flex bg-gray-50">
      <aside className="w-64 h-100vh bg-slate-900 text-slate-300 shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Brand Logo Header */}
          <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-800/80">
            <img
              alt="NextLog Logo"
              className="h-8 w-auto"
              src="https://lh3.googleusercontent.com/aida/AEtjO1W3qO8p2n0ftwPXEHAj660v_MZjf2gmGcK3jZ9c_HYiEClqB5n-SzzbANc3lPLiL1iCOGirfxXx7g21q1k9iTTc7TCiObDYQgqNxcJKxTrgHL-5kCLw6ekxHr4pRO6arultoVrzriL28IGsMJCxrOLHboW1EqeppQ9dSpFim5x4YNlMuJ9BO64M91O_t0Nl_UMcmdVf7QLRNPjKCyxZ3P7Y3DJhp4DlwsegBbt-uuN8EvnNOiAEMsmusQ"
            />
            <div className="leading-tight">
              <div className="text-white font-bold text-lg tracking-tight">
                Next<span className="text-blue-500">Log</span>
              </div>
              <p className="text-xs text-slate-400">Blog CMS</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-6 space-y-1 text-sm font-medium">
            {navItems.map((item) => {
              const active = isTabActive(item.href);
              return (
                <Link
                  key={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  href={item.href}
                >
                  <span className={active ? "text-white" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Current User Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <img
                alt="Irfat Uddin Ifti"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WEaQ33Nq5pBlY5enHqC3IgaXCb6SAqpwDKjWoJZbh4Q7WaxF3wF0_6SgOQwQhB7pZXRq5PwVMQe9AVfaUeqySdlk3lYwUeDgOq8LXtXHzoQr3SVD7BMXbYDw-rG6lUT88T0l46NTvp3pVfQS6G33U2ExXJ9fyEE8mtVoFG8hZMVXqS4pH3l9yR5-xpISXl1L55_NAcNGIVYHfCcjh7-mZY5KKIZ1xSAYBikURy-PVOrIWGUUcGTeSSbA"
              />
              <div className="leading-tight">
                <p className="text-sm font-medium text-white truncate w-24">
                  Irfat Uddin Ifti
                </p>
                <span className="text-[11px] text-slate-400">Admin</span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>
      </aside>

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-start">
        {children}
      </main>
    </div>
  );
}
