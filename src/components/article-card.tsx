import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import type { Article } from "@/lib/mockDb";
import { authors } from "@/data/authors";
import { getCategoryBySlug } from "@/data/categories";
import { getRelativeTime, getReadingTime, getImageSrc } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
  className?: string;
}

export function ArticleCard({ article, variant = "default", className }: ArticleCardProps) {
  const author = authors.find((a) => a.id === article.authorId);
  const category = getCategoryBySlug(article.category);

  if (variant === "compact") {
    return (
      <Link href={`/article/${article.slug}`} className={cn("group block", className)}>
        <div className="flex gap-4">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden">
            <Image
              src={getImageSrc(article.image)}
              alt={article.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="96px"
            />
          </div>
          <div className="flex-1 min-w-0">
            {category && (
              <Badge className="mb-1 text-[10px]" style={{ backgroundColor: category.color }}>
                {category.name}
              </Badge>
            )}
            <h3 className="text-sm font-semibold line-clamp-2 text-gray-900 group-hover:text-[#D4AF37] dark:text-white dark:group-hover:text-[#D4AF37] transition-colors">
              {article.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              {getRelativeTime(article.publishedAt)}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/article/${article.slug}`} className={cn("group block", className)}>
        <div className="flex gap-6">
          <div className="relative h-48 w-72 flex-shrink-0 overflow-hidden">
            <Image
              src={getImageSrc(article.image)}
              alt={article.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="288px"
            />
          </div>
          <div className="flex-1 min-w-0 py-2">
            {category && (
              <Badge className="mb-2 text-xs" style={{ backgroundColor: category.color }}>
                {category.name}
              </Badge>
            )}
            <h2 className="text-xl font-bold line-clamp-2 text-gray-900 group-hover:text-[#D4AF37] dark:text-white dark:group-hover:text-[#D4AF37] transition-colors">
              {article.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
              {article.summary}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              {author && <span>{author.name}</span>}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getRelativeTime(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.viewCount.toLocaleString()}
              </span>
              <span>{getReadingTime(article.content)} min read</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/article/${article.slug}`} className={cn("group block", className)}>
      <div className="overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={getImageSrc(article.image)}
            alt={article.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      <div className="mt-3">
        {category && (
          <Badge className="mb-2 text-xs" style={{ backgroundColor: category.color }}>
            {category.name}
          </Badge>
        )}
        <h3 className="text-lg font-bold line-clamp-2 text-gray-900 group-hover:text-[#D4AF37] dark:text-white dark:group-hover:text-[#D4AF37] transition-colors">
          {article.title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
          {article.summary}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {author && <span>{author.name}</span>}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getRelativeTime(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
