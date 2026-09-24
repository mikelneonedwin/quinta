"use client";

import { useForm, Controller } from "react-hook-form";
import { AdminFormSkeleton } from "@/components/admin-skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { api } from "@/features/trpc/client";
import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";

import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().optional(),
  imageId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();

  const { data: project, isLoading } = api.projects.getById.useQuery(
    { id },
    { enabled: !isNew },
  );

  const utils = api.useUtils();
  const createMutation = api.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.getAll.invalidate();
      toast.success("Project created successfully!");
      router.push("/dashboard/projects");
    },
    onError: (err) => {
      toast.error("Failed to create project: " + err.message);
    },
  });

  const updateMutation = api.projects.update.useMutation({
    onSuccess: () => {
      utils.projects.getAll.invalidate();
      toast.success("Project updated successfully!");
      router.push("/dashboard/projects");
    },
    onError: (err) => {
      toast.error("Failed to update project: " + err.message);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", link: "", imageId: "" },
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title || "",
        description: project.description || "",
        link: project.link || "",
        imageId: project.imageId || "",
      });
    }
  }, [project, reset]);

  const onSubmit = (data: FormValues) => {
    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id, ...data });
    }
  };

  if (isLoading) return <AdminFormSkeleton />;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-mono font-bold tracking-tight">
          {isNew ? "Create Project" : "Edit Project"}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FieldGroup>
              <Field data-invalid={!!errors.title}>
                <FieldLabel htmlFor="title">Project Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="e.g. Cross-Border Environmental Audit"
                  aria-invalid={!!errors.title}
                  {...register("title")}
                />
              </Field>

              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the scope, reporting, and impact of the project..."
                  aria-invalid={!!errors.description}
                  {...register("description")}
                />
              </Field>

              <Field data-invalid={!!errors.link}>
                <FieldLabel htmlFor="link">Project Link (optional)</FieldLabel>
                <Input
                  id="link"
                  aria-invalid={!!errors.link}
                  {...register("link")}
                  placeholder="https://..."
                />
              </Field>

              <Field data-invalid={!!errors.imageId}>
                <FieldLabel htmlFor="imageId">Cover Image</FieldLabel>
                <Controller
                  name="imageId"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                      aspectRatio={16 / 9}
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    />
                  )}
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : "Save Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
