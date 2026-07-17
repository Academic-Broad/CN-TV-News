"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { Article } from "@/lib/mockDb";

interface BreakingNewsTickerProps {
  articles: Article[];
}

export function BreakingNewsTicker({ articles: breakingNews }: BreakingNewsTickerProps) {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const maxOffset = breakingNews.length * 400;
        return prev >= maxOffset ? 0 : prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [breakingNews.length]);

  if (breakingNews.length === 0) return null;

  return (
    <div className="bg-[#4169E1] text-white overflow-hidden">
      <div className="mx-auto max-w-7xl flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 bg-[#2E5090] px-4 py-2 font-bold text-sm uppercase tracking-wider">
          <AlertTriangle className="h-4 w-4" />
          Breaking
        </div>
        <div className="relative overflow-hidden flex-1 h-10">
          <div
            className="absolute whitespace-nowrap flex items-center h-full transition-transform duration-100"
            style={{ transform: `translateX(-${offset}px)` }}
          >
            {breakingNews.map((article, index) => (
              <React.Fragment key={article.id}>
                <Link
                  href={`/article/${article.slug}`}
                  className="inline-block px-6 text-sm font-medium hover:underline"
                >
                  {article.title}
                </Link>
                {index < breakingNews.length - 1 && (
                  <span className="inline-block px-4 text-[#D4AF37]">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
