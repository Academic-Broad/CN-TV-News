"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Send,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

const categories = [
  { value: "world", label: "World" },
  { value: "tech", label: "Technology" },
  { value: "science", label: "Science" },
  { value: "business", label: "Business" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "health", label: "Health" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
];

interface ArticleFormData {
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  status: "draft" | "published";
  publishedAt: string;
  tags: string;
}

const defaultFormData: ArticleFormData = {
  title: "",
  summary: "",
  content: "",
  image: "",
  category: "",
  status: "draft",
  publishedAt: new Date().toISOString().slice(0, 16),
  tags: "",
};

function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [preview, setPreview] = React.useState(value);

  React.useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onChange(base64);
      setUploading(false);
      toast.success("Image loaded successfully");
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-lg border aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              type="button"
              variant="secondary"
              size="icon-xs"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Upload className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon-xs"
              onClick={handleRemove}
              disabled={uploading}
              className="bg-background/80 backdrop-blur-sm"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-[#4169E1]" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 p-8 text-muted-foreground transition-colors hover:border-[#D4AF37]/40 hover:bg-muted/50 hover:text-foreground"
        >
          <Upload className="h-8 w-8" />
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload an image</p>
            <p className="text-xs mt-1">JPEG, PNG, WebP or GIF (max 5MB)</p>
          </div>
        </button>
      )}
    </div>
  );
}

function WriteArticleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  const [form, setForm] = React.useState<ArticleFormData>(defaultFormData);
  const [loading, setLoading] = React.useState(false);
  const [fetching, setFetching] = React.useState(isEditing);

  React.useEffect(() => {
    if (editId) {
      fetch(`/api/articles/${editId}`)
        .then((res) => res.json())
        .then((article) => {
          setForm({
            title: article.title || "",
            summary: article.summary || "",
            content: article.content || "",
            image: article.image || "",
            category: article.category || "",
            status: article.status || "draft",
            publishedAt: article.publishedAt
              ? new Date(article.publishedAt).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
            tags: (article.tags || []).join(", "),
          });
          setFetching(false);
        })
        .catch(() => {
          toast.error("Failed to load article");
          router.push("/admin/articles");
        });
    }
  }, [editId, router]);

  const validate = (): boolean => {
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return false;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return false;
    }
    if (!form.content.trim() || form.content === "<p></p>") {
      toast.error("Please add some content");
      return false;
    }
    return true;
  };

  const handleSave = async (status: "draft" | "published") => {
    if (status === "published" && !validate()) return;
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        status,
        publishedAt:
          status === "published"
            ? new Date(form.publishedAt).toISOString()
            : new Date().toISOString(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        authorId: "admin",
      };

      const url = isEditing ? `/api/articles/${editId}` : "/api/articles";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(
        status === "published"
          ? "Article published successfully!"
          : "Draft saved successfully!"
      );
      router.push("/admin/articles");
    } catch {
      toast.error("Failed to save article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="rounded-lg p-2 hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {isEditing ? "Edit Article" : "Write New Post"}
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {isEditing
                ? "Edit your article below"
                : "Create a new article for your readers"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-11 sm:pl-0">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Draft</span>
          </Button>
          <Button
            onClick={() => handleSave("published")}
            disabled={loading}
            className="bg-[#4169E1] hover:bg-[#2E5090] text-white"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Publish</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <Input
              placeholder="Article title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="text-xl font-semibold border-none focus-visible:ring-0 px-0 h-auto py-2 bg-transparent"
            />
          </div>
          <div>
            <RichTextEditor
              content={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              placeholder="Start writing your article..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm({ ...form, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value: "draft" | "published") =>
                    setForm({ ...form, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) =>
                    setForm({ ...form, publishedAt: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Summary</Label>
                <Textarea
                  placeholder="A short 2-3 sentence teaser for the homepage card..."
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  placeholder="comma-separated tags"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 pt-6">
              <Label>Featured Image</Label>
              <ImageUploader
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function WriteArticlePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <WriteArticleForm />
    </Suspense>
  );
}
