export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export const categories: Category[] = [
  { id: "world", name: "World", slug: "world", color: "#D4AF37" },
  { id: "tech", name: "Technology", slug: "tech", color: "#1A73E8" },
  { id: "science", name: "Science", slug: "science", color: "#0D652D" },
  { id: "business", name: "Business", slug: "business", color: "#E37400" },
  { id: "lifestyle", name: "Lifestyle", slug: "lifestyle", color: "#7B1FA2" },
  { id: "health", name: "Health", slug: "health", color: "#C62828" },
  { id: "sports", name: "Sports", slug: "sports", color: "#00695C" },
  { id: "entertainment", name: "Entertainment", slug: "entertainment", color: "#AD1457" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
