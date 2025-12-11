"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { href: "/dashboard", label: "Panou" },
  { href: "/devices", label: "Aparate" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicDevice = pathname.startsWith("/devices/") && pathname.split("/").length >= 3;

  useEffect(() => {
    if (!isAuthenticated && !isPublicDevice) {
      router.replace("/login");
    }
  }, [isAuthenticated, isPublicDevice, router]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {!isPublicDevice && (
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <span className="text-lg font-semibold text-white">Galaxy Gym</span>
              <nav className="flex flex-wrap gap-2 text-sm font-medium text-slate-200">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 transition ${
                      isActive(item.href)
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
              <span className="text-slate-400">{user}</span>
              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="rounded-md border border-slate-700 px-3 py-2 font-medium text-white transition hover:bg-slate-800"
              >
                Deconectare
              </button>
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

