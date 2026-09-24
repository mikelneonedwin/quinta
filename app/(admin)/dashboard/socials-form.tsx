"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/features/trpc/client";
import { useEffect } from "react";
import { AdminFormSkeleton } from "@/components/admin-skeleton";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { contactPlatforms, ContactPlatform } from "@/features/db/schemas/cms";
import { SocialIcon } from "@/components/social-icon";

const PLATFORMS: { value: ContactPlatform; label: string }[] = [
  { value: "X", label: "X (Twitter)" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Instagram", label: "Instagram" },
  { value: "Facebook", label: "Facebook" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Substack", label: "Substack" },
  { value: "YouTube", label: "YouTube" },
  { value: "TikTok", label: "TikTok" },
  { value: "Email", label: "Email" },
  { value: "Phone", label: "Phone" },
];

function normalizeNigerianPhone(val: string): string {
  const digits = val.replace(/[\s\-\(\)\.]/g, "");
  if (digits.startsWith("+234")) return `+234${digits.substring(4)}`;
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.substring(1)}`;
  return digits.startsWith("+") ? digits : `+${digits}`;
}

function sanitizeContactValue(platform: string, val: string): string {
  let clean = (val || "").trim();
  if (platform === "Email") return clean.replace(/^mailto:/i, "").trim();
  if (platform === "Phone" || platform === "WhatsApp") {
    clean = clean
      .replace(/^tel:/i, "")
      .replace(/^https?:\/\/wa\.me\//i, "")
      .trim();
    return normalizeNigerianPhone(clean);
  }

  if (platform === "Website") {
    return clean;
  }

  // Strip URLs, www, domain names, query params, trailing slashes, and leading '@'
  clean = clean.replace(
    /^https?:\/\/(www\.)?(x\.com|twitter\.com|linkedin\.com\/in|instagram\.com|facebook\.com|substack\.com\/@|github\.com|youtube\.com\/@|tiktok\.com\/@)\//i,
    "",
  );
  clean = clean.replace(/^@+/, "");
  clean = clean.replace(/\/+$/, "");
  return clean;
}

const contactItemSchema = z
  .object({
    platform: z.enum(contactPlatforms),
    value: z.string().min(1, "Value is required"),
  })
  .superRefine((data, ctx) => {
    const { platform, value } = data;
    const raw = value.trim();

    if (platform === "Phone" || platform === "WhatsApp") {
      const cleaned = raw.replace(/[\s\-\(\)\.]/g, "");
      const isValid =
        /^\+234\d{10}$/.test(cleaned) ||
        /^234\d{10}$/.test(cleaned) ||
        /^0\d{10}$/.test(cleaned);
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Enter a valid phone number in +234 or 0 format (e.g. +2348012345678 or 08012345678)",
          path: ["value"],
        });
      }
    } else if (platform === "Email") {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        raw.replace(/^mailto:/i, ""),
      );
      if (!isEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid email address",
          path: ["value"],
        });
      }
    }
  });

const formSchema = z.object({
  contacts: z.array(contactItemSchema),
});

type FormValues = z.infer<typeof formSchema>;

export function SocialsForm() {
  const { data: contacts, isLoading } = api.cms.getContacts.useQuery();
  const utils = api.useUtils();
  const updateContacts = api.cms.updateContacts.useMutation({
    onSuccess: () => {
      utils.cms.getContacts.invalidate();
      toast.success("Socials & contacts updated successfully!");
    },
    onError: (err) => {
      toast.error("Failed to update socials: " + err.message);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contacts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  useEffect(() => {
    if (contacts) {
      reset({
        contacts: contacts.map((c) => ({
          platform: c.platform || "X",
          value: sanitizeContactValue(c.platform || "", c.value || ""),
        })),
      });
    }
  }, [contacts, reset]);

  const onSubmit = (data: FormValues) => {
    // Process values to save normalized values (+234 phone format and clean usernames)
    const processedContacts = data.contacts.map((c) => ({
      platform: c.platform,
      value: sanitizeContactValue(c.platform, c.value),
    }));

    updateContacts.mutate(processedContacts);
  };

  const getPlaceholder = (platform: string) => {
    switch (platform) {
      case "Email":
        return "name@example.com";
      case "Phone":
        return "+234 801 234 5678 or 08012345678";
      case "WhatsApp":
        return "+234 801 234 5678 or 08012345678";
      case "Email":
        return "email (e.g. hello@quintaakpan.cv)";
      case "Website":
        return "website url (e.g. https://quintaakpan.cv)";
      case "Substack":
        return "publication or username";
      case "X":
      case "Instagram":
      case "LinkedIn":
      case "Facebook":
      case "GitHub":
      case "YouTube":
      case "TikTok":
      default:
        return "username";
    }
  };

  if (isLoading) {
    return <AdminFormSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Socials & Contacts</CardTitle>
        <CardDescription>
          Enter usernames for social media and phone numbers in +234 or 0 format
          (links are automatically generated).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FieldGroup className="flex flex-col gap-4">
            {fields.map((field, index) => {
              return (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-[190px]">
                      <Select
                        items={PLATFORMS}
                        defaultValue={field.platform}
                        onValueChange={(val: string | null) =>
                          val &&
                          setValue(
                            `contacts.${index}.platform`,
                            val as ContactPlatform,
                            { shouldValidate: true },
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {(value: string) => {
                              const p = PLATFORMS.find(
                                (x) => x.value === value,
                              );
                              return (
                                <div className="flex items-center gap-2">
                                  <SocialIcon
                                    platform={value as ContactPlatform}
                                    className="w-4 h-4"
                                  />
                                  <span>{p?.label || value}</span>
                                </div>
                              );
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {PLATFORMS.map((p) => {
                              return (
                                <SelectItem key={p.value} value={p.value}>
                                  <div className="flex items-center gap-2">
                                    <SocialIcon
                                      platform={p.value}
                                      className="w-4 h-4 text-muted-foreground"
                                    />
                                    <span>{p.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-[2]">
                      <Input
                        placeholder={getPlaceholder(field.platform)}
                        {...register(`contacts.${index}.value` as const)}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.contacts?.[index]?.value && (
                    <span className="text-xs text-destructive pl-1 block font-mono">
                      {errors.contacts[index]?.value?.message}
                    </span>
                  )}
                </div>
              );
            })}
          </FieldGroup>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ platform: "X", value: "" })}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Social
            </Button>
            <Button
              type="submit"
              disabled={updateContacts.isPending}
              className="w-fit"
            >
              {updateContacts.isPending ? "Saving..." : "Save Socials"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
