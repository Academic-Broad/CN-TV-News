"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";
import { categories } from "@/data/categories";

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navItems = [
    { label: "Home", href: "/" },
    ...categories.map((cat) => ({ label: cat.name, href: `/category/${cat.slug}` })),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      {/* Top bar with logo and date */}
      <div className="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center bg-[#4169E1] text-white font-bold text-lg">
              CN
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                CN TV
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 block -mt-1">
                NEWS
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news..."
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#4169E1] focus:outline-none focus:ring-1 focus:ring-[#4169E1] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-[#4169E1]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#4169E1] px-4 py-2 text-sm font-medium text-white hover:bg-[#2E5090] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="hidden border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950 md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors rounded-md",
                  pathname === item.href
                    ? "bg-[#4169E1] text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-[#4169E1] text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
