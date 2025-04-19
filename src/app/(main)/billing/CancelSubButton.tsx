// import { CancelSubscriptionDialog } from "@/components/dialogs/cancel-subscription-dialog";
"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CancelSubscriptionDialog } from "./CancelSubscriptionDialog";

type CancelSubButtonProps = {
    razorpaySubscriptionId: string;
};
export default function CancelSubButton({ razorpaySubscriptionId }: CancelSubButtonProps) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <Button
                variant="destructive"
                onClick={() => setDialogOpen(true)}
                className="mt-4"
            >
                Cancel Subscription
            </Button>
            <CancelSubscriptionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                razorpaySubscriptionId={razorpaySubscriptionId}
            />
        </>
    );
}
