"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/features/trpc/client";
import { toast } from "sonner";
import { cn } from "cn";

export function NewsletterForm({
  title = "Enjoyed this post?",
  subtitle = "Get future essays, dispatch notes, and commentary sent straight to your inbox as soon as they are published.",
  className,
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = api.cms.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Subscribed successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !subscribeMutation.isPending) {
      subscribeMutation.mutate({ email });
    }
  };

  if (submitted) {
    return (
      <Card
        className={cn(
          "bg-muted/40 border-border p-8 text-center shadow-sm mb-16 w-full max-w-2xl mx-auto",
          className,
        )}
      >
        <CardContent className="p-0">
          <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
          <h4 className="font-mono text-xl font-bold mb-2 text-foreground">
            You&apos;re subscribed!
          </h4>
          <p className="text-sm text-muted-foreground font-sans">
            Thank you for joining. You will receive new dispatches directly at{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "bg-card/90 border-border shadow-sm mb-16 overflow-hidden w-full max-w-2xl mx-auto",
        className,
      )}
    >
      <CardContent className="p-8 sm:p-10">
        <h3 className="font-mono text-2xl font-bold mb-3 text-card-foreground">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed font-sans">
          {subtitle}
        </p>
        <form
          className="flex flex-col sm:flex-row gap-3"
          onSubmit={handleSubmit}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={subscribeMutation.isPending}
            className="flex-1 bg-background font-sans"
          />
          <Button
            type="submit"
            variant="default"
            disabled={subscribeMutation.isPending}
            className="cursor-pointer font-mono"
          >
            {subscribeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
