"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { href: "/dashboard", label: "Panou" },
  { href: "/devices", label: "Aparate" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-lg font-semibold text-white">Galaxy Gym</span>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 sm:hidden"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-nav"
                >
                  {menuOpen ? "Închide" : "Meniu"}
                </button>
                <button
                  onClick={() => {
                    logout();
                    router.replace("/login");
                  }}
                  className="hidden rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 sm:inline-flex"
                >
                  Deconectare
                </button>
              </div>
            </div>

            <div
              id="mobile-nav"
              className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
                menuOpen ? "flex" : "hidden sm:flex"
              }`}
            >
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
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {user && (
                <span className="text-xs font-medium text-slate-400 sm:text-sm">Conectat: {user}</span>
              )}
              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 sm:hidden"
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

