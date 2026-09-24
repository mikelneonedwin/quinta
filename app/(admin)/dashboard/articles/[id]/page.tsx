"use client";

import { formatDate } from "@/lib/format-date";
import { estimateReadingTime } from "@/lib/reading-time";
import { getImageUrl } from "@/lib/image-url";

/* eslint-disable @next/next/no-img-element */
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
import { Editor } from "@/features/blog/components/Editor";
import { ImageUpload } from "@/components/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, Globe, FileText } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  type: z.enum(["internal", "external"]),
  title: z.string().min(1, "Title is required"),
  publication: z.string().optional(),
  link: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImageId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();

  const { data: article, isLoading } = api.articles.getById.useQuery(
    { id },
    { enabled: !isNew },
  );

  const { data: settings } = api.cms.getSettings.useQuery();

  const utils = api.useUtils();
  const createMutation = api.articles.create.useMutation({
    onSuccess: () => {
      utils.articles.getAll.invalidate();
      toast.success("Article created successfully!");
      router.push("/dashboard/articles");
    },
    onError: (err) => {
      toast.error("Failed to create article: " + err.message);
    },
  });

  const updateMutation = api.articles.update.useMutation({
    onSuccess: () => {
      utils.articles.getAll.invalidate();
      utils.articles.getById.invalidate({ id });
      toast.success("Article updated successfully!");
      router.push("/dashboard/articles");
    },
    onError: (err) => {
      toast.error("Failed to update article: " + err.message);
    },
  });

  const testNoteMutation = api.articles.sendTestNewsletter.useMutation({
    onSuccess: (res) => {
      toast.success(`Test note sent to ${res.email}!`);
    },
    onError: (err) => {
      toast.error("Failed to send test note: " + err.message);
    },
  });

  const resendMutation = api.articles.resendNewsletter.useMutation({
    onSuccess: (res) => {
      utils.articles.getById.invalidate({ id });
      toast.success(`Newsletter re-sent to ${res.recipientCount} subscribers!`);
    },
    onError: (err) => {
      toast.error("Failed to resend newsletter: " + err.message);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "internal",
      title: "",
      publication: "",
      link: "",
      excerpt: "",
      content: "",
      coverImageId: "",
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (article) {
      reset({
        type: article.type === "external" ? "external" : "internal",
        title: article.title || "",
        publication: article.publication || "",
        link: article.link || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        coverImageId: article.coverImageId || article.imageId || "",
      });
    }
  }, [article, reset]);

  const handleSave = (data: FormValues, mode: "draft" | "publish") => {
    if (data.type === "external" && !data.link) {
      toast.error("External articles require a link URL");
      return;
    }

    const publishedAt =
      mode === "publish" ? article?.publishedAt || new Date() : null;

    if (isNew) {
      createMutation.mutate({ ...data, publishedAt });
    } else {
      updateMutation.mutate({ id, ...data, publishedAt });
    }
  };

  const handleSendTestNote = () => {
    const values = watch();
    if (!values.title?.trim()) {
      toast.error("Please enter a title before sending a test note.");
      return;
    }
    testNoteMutation.mutate({
      title: values.title,
      excerpt: values.excerpt,
      slug: article?.slug || undefined,
      coverImageId: values.coverImageId,
    });
  };

  const handleResendNewsletter = () => {
    if (
      confirm(
        "Are you sure you want to resend this newsletter to all active subscribers?",
      )
    ) {
      resendMutation.mutate({ id });
    }
  };

  const formValues = watch();

  if (isLoading) return <AdminFormSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-mono font-bold tracking-tight">
            {isNew ? "Create Article" : "Edit Article"}
          </h1>
          {!isNew && article && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge
                variant={article.publishedAt ? "default" : "outline"}
                className="text-xs font-mono uppercase"
              >
                {article.publishedAt
                  ? `Published on ${formatDate(article.publishedAt)}`
                  : "Draft"}
              </Badge>
              {article.type === "internal" && article.newsletterSentAt && (
                <Badge variant="secondary" className="text-xs font-mono">
                  Newsletter sent on {formatDate(article.newsletterSentAt)}
                </Badge>
              )}
              {article.type === "internal" &&
                article.newsletterError &&
                !article.newsletterSentAt && (
                  <Badge variant="destructive" className="text-xs font-mono">
                    Newsletter failed: {article.newsletterError}
                  </Badge>
                )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedType === "internal" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={testNoteMutation.isPending}
              onClick={handleSendTestNote}
            >
              {testNoteMutation.isPending ? "Sending..." : "Send Test Note"}
            </Button>
          )}

          {!isNew && article?.type === "internal" && article?.publishedAt && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={resendMutation.isPending}
              onClick={handleResendNewsletter}
            >
              {resendMutation.isPending ? "Resending..." : "Resend Newsletter"}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <form
                onSubmit={handleSubmit((data) =>
                  handleSave(data, article?.publishedAt ? "publish" : "draft"),
                )}
                className="flex flex-col gap-6"
              >
                {/* Article Type Selector */}
                <div className="space-y-2">
                  <FieldLabel>Article Format</FieldLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setValue("type", "internal")}
                      className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        selectedType === "internal"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <FileText
                        className={`w-5 h-5 shrink-0 mt-0.5 ${selectedType === "internal" ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <div>
                        <div className="font-semibold text-sm">
                          Internal Article
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Full blog essay written directly on this site
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue("type", "external")}
                      className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        selectedType === "external"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <Globe
                        className={`w-5 h-5 shrink-0 mt-0.5 ${selectedType === "external" ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <div>
                        <div className="font-semibold text-sm">
                          External Article
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Feature published on an external website/outlet
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <FieldGroup>
                  <Field data-invalid={!!errors.title}>
                    <FieldLabel htmlFor="title">Article Title</FieldLabel>
                    <Input
                      id="title"
                      placeholder="e.g. The Notebook and the Voice Memo"
                      aria-invalid={!!errors.title}
                      {...register("title")}
                    />
                  </Field>

                  {selectedType === "external" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field data-invalid={!!errors.publication}>
                        <FieldLabel htmlFor="publication">
                          Publication / Outlet Name
                        </FieldLabel>
                        <Input
                          id="publication"
                          placeholder="e.g. Premium Times, Vanguard"
                          {...register("publication")}
                        />
                      </Field>

                      <Field data-invalid={!!errors.link}>
                        <FieldLabel htmlFor="link">
                          External Article URL
                        </FieldLabel>
                        <Input
                          id="link"
                          placeholder="https://..."
                          {...register("link")}
                        />
                      </Field>
                    </div>
                  )}

                  <Field data-invalid={!!errors.excerpt}>
                    <FieldLabel htmlFor="excerpt">
                      Excerpt / Description
                    </FieldLabel>
                    <Textarea
                      id="excerpt"
                      rows={3}
                      placeholder="Brief excerpt or description of the article..."
                      {...register("excerpt")}
                    />
                  </Field>

                  <Field data-invalid={!!errors.coverImageId}>
                    <FieldLabel htmlFor="coverImageId">Cover Image</FieldLabel>
                    <Controller
                      name="coverImageId"
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

                  {selectedType === "internal" && (
                    <Field data-invalid={!!errors.content}>
                      <FieldLabel>Article Content</FieldLabel>
                      <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                          <Editor
                            content={field.value || ""}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </Field>
                  )}
                </FieldGroup>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="default"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    onClick={handleSubmit((data) =>
                      handleSave(data, "publish"),
                    )}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Publishing..."
                      : article?.publishedAt
                        ? "Save & Keep Published"
                        : "Publish Article"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    onClick={handleSubmit((data) => handleSave(data, "draft"))}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : article?.publishedAt
                        ? "Unpublish to Draft"
                        : "Save as Draft"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="preview"
          className="mt-0 border rounded-xl bg-background p-8 min-h-[500px] shadow-sm"
        >
          {selectedType === "internal" ? (
            <article className="max-w-3xl mx-auto py-4">
              <header className="mb-10 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(new Date())}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {estimateReadingTime(formValues.content)} min read
                  </span>
                </div>

                <h1 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] text-foreground mb-6">
                  {formValues.title || "Untitled Article"}
                </h1>

                {formValues.excerpt ? (
                  <p className="text-lg text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4 font-sans">
                    {formValues.excerpt}
                  </p>
                ) : formValues.content ? (
                  <p className="text-lg text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4 font-sans">
                    {formValues.content
                      .replace(/<[^>]*>?/gm, "")
                      .substring(0, 160)}
                    ...
                  </p>
                ) : null}

                <div className="flex items-center gap-3 mt-8">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0 border border-border flex items-center justify-center">
                    {settings?.portraitId ? (
                      <img
                        src={getImageUrl(settings.portraitId)}
                        alt={settings.name || "Author"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-mono font-bold text-muted-foreground">
                        {(settings?.name || "QA")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-mono font-semibold text-foreground block">
                      {settings?.name || "Quinta Akpan"}
                    </span>
                    <span className="text-xs text-muted-foreground block font-sans">
                      {[settings?.heroTag, settings?.location]
                        .filter(Boolean)
                        .join(" in ")}
                    </span>
                  </div>
                </div>
              </header>

              {formValues.coverImageId && (
                <div className="w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden mb-10 border border-border">
                  <img
                    src={formValues.coverImageId}
                    alt={formValues.title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/*<Separator className="mb-10" />*/}

              {formValues.content &&
              /<[a-z][\s\S]*>/i.test(formValues.content) ? (
                <div
                  className="prose prose-lg dark:prose-invert max-w-none mb-16 font-sans text-foreground/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formValues.content }}
                />
              ) : (
                <div className="prose prose-lg dark:prose-invert max-w-none mb-16 font-sans text-foreground/90 leading-relaxed space-y-6">
                  {(formValues.content || "")
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-base sm:text-lg leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              )}
            </article>
          ) : (
            <div className="max-w-2xl mx-auto py-8">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
                Visitor Card Preview (Opens External Link in New Tab)
              </div>
              <div className="border border-border rounded-2xl p-6 bg-card hover:shadow-lg transition-all">
                {formValues.coverImageId && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 bg-muted">
                    <img
                      src={formValues.coverImageId}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {formValues.publication || "External Publication"}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatDate(new Date())}
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-mono text-foreground mb-3">
                  {formValues.title || "Article Title"}
                </h2>
                <p className="text-muted-foreground text-sm font-sans mb-4 leading-relaxed">
                  {formValues.excerpt ||
                    "Article summary or excerpt preview will appear here..."}
                </p>
                <div className="pt-4 border-t border-border/50 flex items-center text-xs font-mono text-primary font-semibold">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>
                    Read full story on{" "}
                    {formValues.publication || "external outlet"} ↗
                  </span>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
