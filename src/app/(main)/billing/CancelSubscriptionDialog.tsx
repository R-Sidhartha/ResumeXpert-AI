"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface CancelSubscriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    razorpaySubscriptionId: string
}

export function CancelSubscriptionDialog({
    open,
    onOpenChange,
    razorpaySubscriptionId
}: CancelSubscriptionDialogProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter(); // ✅ initialize router

    const handleCancel = async () => {
        startTransition(async () => {
            try {
                const res = await fetch("/api/cancel-subscription", {
                    method: "POST",
                    body: JSON.stringify({ razorpaySubscriptionId }),
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Cancellation failed");

                toast.success("Your subscription has been cancelled.");
                setTimeout(() => {
                    onOpenChange(false);
                    router.push("/resume-templates");
                }, 500);
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong. Please try again.");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel your subscription? You will lose
                        access to premium features at the end of your billing cycle.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={isPending}
                    >
                        {isPending ? "Cancelling..." : "Confirm Cancel"}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Go Back
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
