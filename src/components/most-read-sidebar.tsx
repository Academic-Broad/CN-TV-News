import Link from "next/link";
import { getMostReadArticles } from "@/lib/mockDb";
import { getCategoryBySlug } from "@/data/categories";
import { Badge } from "./ui/badge";

export async function MostReadSidebar() {
  const mostRead = await getMostReadArticles();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white border-b-2 border-[#4169E1] pb-2">
        Most Read
      </h2>
      <div className="space-y-4">
        {mostRead.map((article, index) => {
          const category = getCategoryBySlug(article.category);
          return (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group flex gap-4"
            >
              <span className="flex-shrink-0 text-3xl font-bold text-[#D4AF37] opacity-40 dark:opacity-60">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                {category && (
                  <Badge
                    className="mb-1 text-[10px]"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </Badge>
                )}
                <h3 className="text-sm font-semibold line-clamp-2 text-gray-900 group-hover:text-[#D4AF37] dark:text-white dark:group-hover:text-[#D4AF37] transition-colors">
                  {article.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
