"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format-date";

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

export default function ProjectsAdminPage() {
  const { data: projects, isLoading } = api.projects.getAll.useQuery();
  const utils = api.useUtils();
  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const deleteProject = api.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.getAll.invalidate();
      toast.success("Project deleted successfully");
      setProjectToDelete(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete project");
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
            Projects
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your investigative journalism projects, assignments, and
            field reports.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className={buttonVariants({ variant: "default", size: "default" })}
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Project
        </Link>
      </div>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardContent className="p-0 flex flex-col sm:flex-row items-stretch">
              {/* Thumbnail */}
              <div className="w-full sm:w-48 h-32 sm:h-auto bg-muted shrink-0 relative flex items-center justify-center">
                {project.imageId ? (
                  <img
                    src={project.imageId}
                    alt={project.title || ""}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2 font-sans">
                    {project.description || "No description provided."}
                  </p>
                </div>
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-4">
                  <span>
                    Updated:{" "}
                    {formatDate(project.updatedAt || project.createdAt)}
                  </span>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      View Project <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-4 flex sm:flex-col gap-2 justify-start sm:justify-center border-t sm:border-t-0 sm:border-l border-border bg-muted/20">
                {project.link && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare(project.link!, project.title!)}
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                )}
                <Link
                  href={`/dashboard/projects/${project.id}`}
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
                    setProjectToDelete({
                      id: project.id,
                      title: project.title || "Untitled Project",
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
        ))}
        {projects?.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
            No projects found. Add your first project!
          </div>
        )}
      </div>

      {/* Confirmation Alert Dialog */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open: boolean) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{projectToDelete?.title}
              &rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              variant="destructive"
              disabled={deleteProject.isPending}
              onClick={() => {
                if (projectToDelete) {
                  deleteProject.mutate({ id: projectToDelete.id });
                }
              }}
            >
              {deleteProject.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
