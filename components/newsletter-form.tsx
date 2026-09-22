"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NewsletterForm({ 
  title = "Enjoyed this post?", 
  subtitle = "Get future essays, dispatch notes, and commentary sent straight to your inbox as soon as they are published." 
}: { 
  title?: string; 
  subtitle?: string; 
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-muted/40 border-border p-8 text-center shadow-sm mb-16">
        <CardContent className="p-0">
          <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
          <h4 className="font-serif text-xl font-bold mb-2 text-foreground">You're subscribed!</h4>
          <p className="text-sm text-muted-foreground">
            Thank you for joining. You will receive new dispatches directly at <span className="font-medium text-foreground">{email}</span>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/90 border-border shadow-sm mb-16 overflow-hidden">
      <CardContent className="p-8 sm:p-10">

        <h3 className="font-serif text-2xl font-bold mb-3 text-card-foreground">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
          {subtitle}
        </p>
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 bg-background"
          />
          <Button type="submit" variant="default" className="cursor-pointer">
            Subscribe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
