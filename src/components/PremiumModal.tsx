"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function PremiumModal() {
    const { open, setOpen, title, description, feature } = usePremiumModal();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleViewPlans = () => {
        if (!loading) {
            setOpen(false);
            router.push("/subscriptions");
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !loading && setOpen(open)}>
            <DialogContent className="max-w-xl rounded-2xl p-6 shadow-xl border bg-background">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                        {title || "Unlock Premium Features"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {description ||
                            `This feature ${feature ? `"${feature}" ` : ""}requires a premium plan. Upgrade to continue.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        onClick={handleViewPlans}
                        disabled={loading}
                        className="bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                        View Plans
                    </Button>
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
