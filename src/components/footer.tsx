import Link from "next/link";
import { categories } from "@/data/categories";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-20 w-20 items-center justify-center border-2  bg-[#4169E1] text-white font-bold text-lg">
                  CN-TV NEWS
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                CN-TV NEWS 
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Delivering trusted, in-depth journalism from around the world.
              Stay informed with the latest news, analysis, and breaking stories.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Sections
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-gray-600 hover:text-[#D4AF37] dark:text-gray-400 dark:hover:text-[#D4AF37] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Company
            </h3>
            <ul className="space-y-2">
              {["About Us", "Contact", "Careers", "Press Office", "Advertise"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm text-gray-600 hover:text-[#D4AF37] dark:text-gray-400 dark:hover:text-[#D4AF37] transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                "Terms of Use",
                "Privacy Policy",
                "Cookie Policy",
                "Accessibility",
                "Complaints",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-600 hover:text-[#D4AF37] dark:text-gray-400 dark:hover:text-[#D4AF37] transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} CN TV News. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
