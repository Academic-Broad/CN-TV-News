import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import { getAllPublishedArticles, getFeaturedArticles, getArticlesByCategory, getBreakingNews } from "@/lib/mockDb";
import { authors } from "@/data/authors";
import { categories } from "@/data/categories";
import { getReadingTime, getImageSrc, stripHtml, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/article-card";
import { BreakingNewsTicker } from "@/components/breaking-news-ticker";
import { MostReadSidebar } from "@/components/most-read-sidebar";
import { CategoryShelf } from "@/components/category-shelf";

interface HomePageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const searchQuery = params.search;

  const allArticles = await getAllPublishedArticles();

  const filteredArticles = searchQuery
    ? allArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : null;

  const featuredArticles = await getFeaturedArticles();
  const heroArticle = featuredArticles[0] || allArticles[0];
  const secondaryArticles = featuredArticles.slice(1, 5);
  const heroAuthor = authors.find((a) => a.id === heroArticle.authorId);
  const heroCategory = categories.find((c) => c.slug === heroArticle.category);

  const [techArticles, scienceArticles, worldArticles, businessArticles, lifestyleArticles, breakingNews] = await Promise.all([
    getArticlesByCategory("tech"),
    getArticlesByCategory("science"),
    getArticlesByCategory("world"),
    getArticlesByCategory("business"),
    getArticlesByCategory("lifestyle"),
    getBreakingNews(),
  ]);

  return (
    <div className="min-w-0">
      <BreakingNewsTicker articles={breakingNews} />

      {/* Search results */}
      {filteredArticles && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {filteredArticles.length} result{filteredArticles.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
          </p>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No articles found. Try a different search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main homepage content */}
      {!filteredArticles && (
        <>
          {/* Hero Section */}
          <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Hero story */}
              <div className="lg:col-span-8">
                <Link
                  href={`/article/${heroArticle.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                    <Image
                      src={getImageSrc(heroArticle.image)}
                      alt={heroArticle.title}
                      fill
                      priority
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {heroCategory && (
                        <Badge
                          className="mb-3 text-xs"
                          style={{ backgroundColor: heroCategory.color, color: "white" }}
                        >
                          {heroCategory.name}
                        </Badge>
                      )}
                      <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl leading-tight">
                        {heroArticle.title}
                      </h1>
                      <p className="mt-3 text-gray-200 line-clamp-2 text-sm sm:text-base">
                        {stripHtml(heroArticle.summary)}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-300">
                        {heroAuthor && <span>{heroAuthor.name}</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDateTime(heroArticle.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {heroArticle.viewCount.toLocaleString()}
                        </span>
                        <span>{getReadingTime(stripHtml(heroArticle.content))} min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Secondary stories */}
              <div className="lg:col-span-4">
                <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white border-b-2 border-[#4169E1] pb-2">
                  Top Stories
                </h2>
                <div className="space-y-4">
                  {secondaryArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Main content grid with Most Read sidebar */}
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Latest news */}
              <div className="lg:col-span-8">
                <h2 className="mb-6 text-2xl font-bold text-[#D4AF37] border-b-2 border-[#4169E1] pb-2">
                  Latest News
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {allArticles.slice(0, 6).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>

              {/* Most Read sidebar */}
              <div className="lg:col-span-4">
                <MostReadSidebar />
              </div>
            </div>
          </section>

          {/* Category shelves */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-200 dark:border-gray-700" />
            <CategoryShelf
              title="Technology"
              categorySlug="tech"
              articles={techArticles.slice(0, 4)}
            />
            <div className="border-t border-gray-200 dark:border-gray-700" />
            <CategoryShelf
              title="Science"
              categorySlug="science"
              articles={scienceArticles.slice(0, 4)}
            />
            <div className="border-t border-gray-200 dark:border-gray-700" />
            <CategoryShelf
              title="World News"
              categorySlug="world"
              articles={worldArticles.slice(0, 4)}
            />
            <div className="border-t border-gray-200 dark:border-gray-700" />
            <CategoryShelf
              title="Business"
              categorySlug="business"
              articles={businessArticles.slice(0, 4)}
            />
            <div className="border-t border-gray-200 dark:border-gray-700" />
            <CategoryShelf
              title="Lifestyle"
              categorySlug="lifestyle"
              articles={lifestyleArticles.slice(0, 4)}
            />
          </div>
        </>
      )}
    </div>
  );
}
