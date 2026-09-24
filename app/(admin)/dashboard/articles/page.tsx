"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format-date";
import { getImageUrl } from "@/lib/image-url";

/* eslint-disable @next/next/no-img-element */
import { api } from "@/features/trpc/client";
import {
  Plus,
  Edit,
  Trash2,
  Share2,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { AdminListSkeleton } from "@/components/admin-skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ArticlesAdminPage() {
  const { data: articlesList, isLoading } = api.articles.getAll.useQuery({
    includeDrafts: true,
  });
  const utils = api.useUtils();
  const [articleToDelete, setArticleToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const deleteArticle = api.articles.delete.useMutation({
    onSuccess: () => {
      utils.articles.getAll.invalidate();
      toast.success("Article deleted successfully");
      setArticleToDelete(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete article");
    },
  });

  const handleShare = async (url: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) return <AdminListSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-mono font-bold tracking-tight">
            Articles
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your internal site essays and external publication features
            in one place.
          </p>
        </div>
        <Link
          href="/dashboard/articles/new"
          className={buttonVariants({ variant: "default", size: "default" })}
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Article
        </Link>
      </div>

      <div className="grid gap-4">
        {articlesList?.map((article) => {
          const isExternal = article.type === "external";
          const shareUrl = isExternal
            ? article.link || ""
            : `${typeof window !== "undefined" ? window.location.origin : ""}/articles/${article.slug}`;

          const description =
            article.excerpt ||
            (article.content
              ? article.content.replace(/<[^>]*>?/gm, "").substring(0, 150) +
                "..."
              : "No description");

          return (
            <Card key={article.id} className="overflow-hidden">
              <CardContent className="p-0 flex flex-col sm:flex-row items-stretch">
                {/* Thumbnail */}
                <div className="w-full sm:w-48 h-32 sm:h-auto bg-muted shrink-0 relative flex items-center justify-center">
                  {article.coverImageId ? (
                    <img
                      src={getImageUrl(article.coverImageId)}
                      alt={article.title || ""}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge
                        variant={isExternal ? "outline" : "secondary"}
                        className="text-[10px] font-mono uppercase tracking-wider"
                      >
                        {isExternal
                          ? `External • ${article.publication || "Feature"}`
                          : "Internal Article"}
                      </Badge>
                      <Badge
                        variant={article.publishedAt ? "default" : "outline"}
                        className="text-[10px] font-mono uppercase tracking-wider"
                      >
                        {article.publishedAt ? "Published" : "Draft"}
                      </Badge>
                      {!isExternal && article.newsletterSentAt && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-mono tracking-wider"
                        >
                          Newsletter sent
                        </Badge>
                      )}
                      {!isExternal &&
                        article.newsletterError &&
                        !article.newsletterSentAt && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] font-mono tracking-wider"
                          >
                            Newsletter failed
                          </Badge>
                        )}
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2 font-sans">
                      {description}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground flex items-center gap-3">
                    <span>
                      Updated:{" "}
                      {formatDate(
                        article.updatedAt ||
                          article.publishedAt ||
                          article.createdAt,
                      )}
                    </span>
                    {isExternal
                      ? article.link && (
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <span>Visit</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )
                      : article.slug && (
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <span>Visit</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                  </div>
                </div>

                <div className="p-4 flex sm:flex-col gap-2 justify-start sm:justify-center border-t sm:border-t-0 sm:border-l border-border bg-muted/20">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleShare(shareUrl, article.title || "Article")
                    }
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Link
                    href={`/dashboard/articles/${article.id}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "icon",
                    })}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setArticleToDelete({
                        id: article.id,
                        title: article.title || "Untitled Article",
                      })
                    }
                    className="hover:bg-destructive/10 hover:text-destructive text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {articlesList?.length === 0 && (
          <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
            No articles found. Create your first one!
          </div>
        )}
      </div>

      {/* Confirmation Alert Dialog */}
      <AlertDialog
        open={!!articleToDelete}
        onOpenChange={(open: boolean) => !open && setArticleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{articleToDelete?.title}
              &rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              variant="destructive"
              disabled={deleteArticle.isPending}
              onClick={() => {
                if (articleToDelete) {
                  deleteArticle.mutate({ id: articleToDelete.id });
                }
              }}
            >
              {deleteArticle.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
