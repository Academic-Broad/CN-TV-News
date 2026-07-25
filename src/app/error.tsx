"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-[#C62828]">Oops</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        Something went wrong
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-[#4169E1] px-6 py-3 text-sm font-medium text-white hover:bg-[#2E5090] transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
