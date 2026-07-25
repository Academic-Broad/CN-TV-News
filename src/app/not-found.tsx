import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-[#4169E1]">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        Page Not Found
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[#4169E1] px-6 py-3 text-sm font-medium text-white hover:bg-[#2E5090] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
