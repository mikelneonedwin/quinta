"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { api } from "@/features/trpc/client";
import { useEffect } from "react";
import { AdminFormSkeleton } from "@/components/admin-skeleton";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  heroTag: z.string().min(1, "Hero Tag is required"),
  heroText: z.string().min(1, "Hero Text is required"),
  aboutText: z.string().min(1, "About Text is required"),
  location: z.string().min(1, "Location is required"),
  portraitId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CMSForm() {
  const { data: settings, isLoading } = api.cms.getSettings.useQuery();
  const utils = api.useUtils();
  const updateSettings = api.cms.updateSettings.useMutation({
    onSuccess: () => {
      utils.cms.getSettings.invalidate();
      toast.success("Settings updated successfully!");
    },
    onError: (err) => {
      toast.error("Failed to update settings: " + err.message);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      heroTag: "",
      heroText: "",
      aboutText: "",
      location: "",
      portraitId: "",
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        name: settings.name || "",
        heroTag: settings.heroTag || "",
        heroText: settings.heroText || "",
        aboutText: settings.aboutText || "",
        location: settings.location || "",
        portraitId: settings.portraitId || "",
      });
    }
  }, [settings, reset]);

  const onSubmit = (data: FormValues) => {
    updateSettings.mutate(data);
  };

  if (isLoading) {
    return <AdminFormSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Content</CardTitle>
        <CardDescription>
          Update your portrait photo, hero section, and bio details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FieldGroup className="flex flex-col gap-y-6">
            <Field className="w-full">
              <FieldLabel>Hero Portrait Photo</FieldLabel>
              <FieldDescription>
                Upload and crop the portrait image displayed on the homepage
                hero section.
              </FieldDescription>
              <div className="mt-2 max-w-sm">
                <Controller
                  name="portraitId"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                      aspectRatio={3 / 4}
                      disabled={updateSettings.isPending}
                    />
                  )}
                />
              </div>
            </Field>

            <Field data-invalid={!!errors.name} className="w-full">
              <FieldLabel htmlFor="name">Display Name</FieldLabel>
              <Input
                id="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
            </Field>

            <Field data-invalid={!!errors.heroTag} className="w-full">
              <FieldLabel htmlFor="heroTag">Introduction Tagline</FieldLabel>
              <FieldDescription>
                Short text above your name (e.g. &quot;Journalist &
                Writer&quot;)
              </FieldDescription>
              <Input
                id="heroTag"
                aria-invalid={!!errors.heroTag}
                {...register("heroTag")}
              />
            </Field>

            <Field data-invalid={!!errors.location} className="w-full">
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input
                id="location"
                aria-invalid={!!errors.location}
                {...register("location")}
                placeholder="e.g. Uyo, Nigeria"
              />
            </Field>

            <Field data-invalid={!!errors.heroText} className="w-full">
              <FieldLabel htmlFor="heroText">Main Introduction Text</FieldLabel>
              <FieldDescription>
                The large introductory paragraph at the top of your homepage.
              </FieldDescription>
              <Textarea
                id="heroText"
                aria-invalid={!!errors.heroText}
                {...register("heroText")}
                className="min-h-[150px]"
              />
            </Field>

            <Field data-invalid={!!errors.aboutText} className="w-full">
              <FieldLabel htmlFor="aboutText">About Text</FieldLabel>
              <FieldDescription>
                The text displayed in the &apos;About&apos; section of the site.
              </FieldDescription>
              <Textarea
                id="aboutText"
                aria-invalid={!!errors.aboutText}
                {...register("aboutText")}
                className="min-h-[150px]"
              />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            disabled={updateSettings.isPending}
            className="w-fit"
          >
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
