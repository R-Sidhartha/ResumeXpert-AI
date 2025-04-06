"use client";

// import { env } from "@/env";
// import { useToast } from "@/hooks/use-toast";
// import usePremiumModal from "@/hooks/usePremiumModal";
// import { Check } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
// import Link from "next/link";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useRouter } from "next/navigation";
// import { Button } from "../ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
// import { createCheckoutSession } from "./actions";

// const premiumFeatures = ["AI tools", "Up to 3 resumes"];
// const premiumPlusFeatures = ["Infinite resumes", "Design customizations"];

export default function PremiumModal() {
    const { open, setOpen } = usePremiumModal();

    //   const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const router = useRouter();


    //   async function handlePremiumClick(priceId: string) {
    //     try {
    //       setLoading(true);
    //       const redirectUrl = await createCheckoutSession(priceId);
    //       window.location.href = redirectUrl;
    //     } catch (error) {
    //       console.error(error);
    //       toast({
    //         variant: "destructive",
    //         description: "Something went wrong. Please try again.",
    //       });
    //     } finally {
    //       setLoading(false);
    //     }
    //   }

    const handleViewPlans = () => {
        if (!loading) {
            setOpen(false); // close modal first
            router.push("/subscriptions"); // then navigate
        }
    };


    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (!loading) {
                    setOpen(open);
                }
            }}
        >
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>ResumeXpert AI Premium</DialogTitle>
                    <p>Get a premium subscription to unlock more features.</p>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="w-full flex gap-4 mx-auto">
                        <Button onClick={handleViewPlans}
                            disabled={loading}
                        >
                            View Plans
                        </Button>
                        <Button
                            disabled={loading}
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
