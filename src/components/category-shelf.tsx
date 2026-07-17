import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ArticleCard } from "./article-card";
import type { Article } from "@/lib/mockDb";

interface CategoryShelfProps {
  title: string;
  categorySlug: string;
  articles: Article[];
}

export function CategoryShelf({ title, categorySlug, articles }: CategoryShelfProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6 border-b-2 border-[#4169E1] pb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <Link
          href={`/category/${categorySlug}`}
          className="flex items-center gap-1 text-sm font-medium text-[#D4AF37] hover:underline"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.slice(0, 4).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
