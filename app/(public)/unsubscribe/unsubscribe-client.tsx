"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { api } from "@/features/trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, MailX, Loader2 } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const token = searchParams.get("token") || undefined;

  const [inputEmail, setInputEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const resolveTokenQuery = api.cms.resolveUnsubscribeToken.useQuery(
    { token: token || "" },
    { enabled: !initialEmail && Boolean(token) },
  );

  const resolvedEmail = resolveTokenQuery.data?.valid
    ? resolveTokenQuery.data.email || ""
    : "";
  const email = initialEmail || resolvedEmail || inputEmail;

  const tokenError =
    resolveTokenQuery.data && !resolveTokenQuery.data.valid
      ? "This unsubscribe link is invalid or has expired."
      : null;

  const errorMessage = mutationError || tokenError;

  const unsubscribeMutation = api.cms.unsubscribe.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setMutationError(null);
    },
    onError: (err) => {
      setMutationError(
        err.message || "Failed to unsubscribe. Please try again.",
      );
    },
  });

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMutationError("Please enter your email address.");
      return;
    }
    unsubscribeMutation.mutate({
      email: email.trim(),
      token,
    });
  };

  const isResolving =
    !initialEmail && Boolean(token) && resolveTokenQuery.isLoading;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md border-border bg-card">
        <CardContent className="p-8">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-foreground">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h1 className="font-heading text-xl font-semibold text-foreground">
                You’re unsubscribed
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You will no longer receive new stories or notes at{" "}
                <strong className="text-foreground">{email}</strong>. If you
                ever change your mind, you can re-subscribe on the site anytime.
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                >
                  ← Return to homepage
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-5">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-foreground">
                <MailX className="w-6 h-6" />
              </div>
              <div className="text-center space-y-2">
                <h1 className="font-heading text-xl font-semibold text-foreground">
                  Unsubscribe from Notes
                </h1>
                {isResolving ? (
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying
                    link...
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {email ? (
                      <>
                        Confirm you wish to stop receiving writing updates at{" "}
                        <strong className="text-foreground">{email}</strong>:
                      </>
                    ) : (
                      "Enter your email address below to stop receiving writing updates:"
                    )}
                  </p>
                )}
              </div>

              {!email && !isResolving && (
                <div className="space-y-1">
                  <Input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    disabled={unsubscribeMutation.isPending}
                    className="w-full"
                  />
                </div>
              )}

              {errorMessage && (
                <p className="text-xs text-destructive text-center">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                variant="destructive"
                className="w-full"
                disabled={unsubscribeMutation.isPending || isResolving}
              >
                {unsubscribeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Unsubscribing...
                  </>
                ) : (
                  "Confirm Unsubscribe"
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Never mind, take me back
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function UnsubscribeClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
