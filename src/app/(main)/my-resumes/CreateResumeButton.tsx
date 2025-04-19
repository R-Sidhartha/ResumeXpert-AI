"use client";

import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import Link from "next/link";
import { useSubscriptionLevel } from "../SubscriptionLevelProviderWrapper";
import { useRequirePro } from "@/lib/gating/requirePro";

interface CreateResumeButtonProps {
  currentResumeCount: number;
}

export default function CreateResumeButton({
  currentResumeCount,
}: CreateResumeButtonProps) {
  const plan = useSubscriptionLevel();
  const requirePro = useRequirePro(plan)
  // Determine allowed resumes based on the user's plan
  const planLimits = {
    free: 3,
    pro: 10,
    elite: Infinity,
  };

  const featureMessages: Record<
    string,
    { feature: string; description: string }
  > = {
    free: {
      feature: "Resume limit reached",
      description:
        "Free plan users can create up to 3 resumes. Upgrade to Pro or Elite to create more.",
    },
    pro: {
      feature: "Resume limit reached",
      description:
        "Pro plan users can create up to 10 resumes. Upgrade to Elite for unlimited resumes.",
    },
    elite: {
      feature: "",
      description: "",
    },
  };

  const maxAllowed = planLimits[plan] ?? 0;
  const canCreate = currentResumeCount < maxAllowed;

  if (canCreate) {
    return (
      <Button asChild className="flex w-fit gap-2 dark:bg-zinc-800 dark:text-white hover:opacity-75">
        <Link href="/resume-templates">
          <PlusSquare className="size-5" />
          New resume
        </Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={async () => {
        const { feature, description } = featureMessages[plan] || {
          feature: "Resume limit",
          description: "Upgrade your plan to create more resumes.",
        };

        const hasAccess = await requirePro({ feature, description });
        if (!hasAccess) return;
      }}
      className="flex w-fit gap-2 dark:bg-zinc-800 dark:text-white hover:opacity-75">
      <PlusSquare className="size-5" />
      New resume
    </Button>
  );
}
