"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { PlusSquare } from "lucide-react";
import Link from "next/link";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

export default function CreateResumeButton({
  canCreate,
}: CreateResumeButtonProps) {
  const premiumModal = usePremiumModal();

  if (canCreate) {
    return (
      <Button asChild className="flex w-fit gap-2 dark:bg-zinc-800 dark:text-white hover:opacity-75">
        <Link href="/resumes">
          <PlusSquare className="size-5" />
          New resume
        </Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => premiumModal.setOpen(true)}
      className="flex w-fit gap-2 dark:bg-zinc-800 dark:text-white hover:opacity-75">
      <PlusSquare className="size-5" />
      New resume
    </Button>
  );
}
