import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Share2, Bookmark, ArrowLeft } from "lucide-react";
import { getAllPublishedArticles, getArticleBySlug, getRelatedArticles } from "@/lib/mockDb";
import { authors } from "@/data/authors";
import { getCategoryBySlug } from "@/data/categories";
import { getReadingTime, formatDate, getImageSrc } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/article-card";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPublishedArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} - CN TV News`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const author = authors.find((a) => a.id === article.authorId);
  const category = getCategoryBySlug(article.category);
  const relatedArticles = getRelatedArticles(article.id, article.category);
  const readingTime = getReadingTime(article.content);

  // Split content into paragraphs
  const paragraphs = article.content.split("\n\n").filter((p) => p.trim());

  return (
    <article className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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
        {category && (
          <>
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-[#D4AF37] transition-colors"
            >
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 dark:text-gray-200 truncate">{article.title}</span>
      </nav>

      {/* Article header */}
      <header className="mb-8">
        {category && (
          <Badge className="mb-4 text-xs" style={{ backgroundColor: category.color }}>
            {category.name}
          </Badge>
        )}
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {article.summary}
        </p>

        {/* Author and meta info */}
        <div className="mt-6 flex flex-wrap items-center gap-6 border-b border-gray-200 pb-6 dark:border-gray-700">
          {author && (
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{author.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(article.publishedAt)}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.viewCount.toLocaleString()} views
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Bookmark"
            >
              <Bookmark className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Featured image */}
      <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          src={getImageSrc(article.image)}
          alt={article.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>

      {/* Article content */}
      <div className="article-content">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Author bio */}
      {author && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{author.name}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {author.bio}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-[#4169E1] pb-2">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {relatedArticles.map((relArticle) => (
              <ArticleCard key={relArticle.id} article={relArticle} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
