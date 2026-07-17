import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getArticlesByCategory } from "@/lib/mockDb";
import { getCategoryBySlug, categories } from "@/data/categories";
import { ArticleCard } from "@/components/article-card";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} - CN TV News`,
    description: `Latest ${category.name.toLowerCase()} news and analysis from CN TV News`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-200">{category.name}</span>
      </nav>

      {/* Category header */}
      <div className="mb-8 border-b-4 pb-4" style={{ borderColor: category.color }}>
        <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: category.color }}>
          {category.name}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Latest {category.name.toLowerCase()} news, analysis, and in-depth reporting
        </p>
      </div>

      {/* Articles grid */}
      {categoryArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No articles found in this category yet.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-[#4169E1] hover:underline"
          >
            Return to homepage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Other categories */}
      <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Explore Other Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((c) => c.slug !== slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="category-hover-link rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors dark:border-gray-600 dark:text-gray-300"
                style={
                  {
                    "--hover-bg": c.color,
                  } as React.CSSProperties
                }
              >
                {c.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
