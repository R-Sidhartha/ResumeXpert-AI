// components/RedeemPlan.tsx
"use client"
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface RedeemPlanProps {
    credits: number;
}

const RedeemPlan = ({ credits }: RedeemPlanProps) => {
    const [selectedPlan, setSelectedPlan] = useState<"PRO" | "ELITE" | null>(null);
    const router = useRouter();

    const handleRedeem = async () => {
        if (!selectedPlan) return;

        const response = await fetch("/api/redeem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ planType: selectedPlan }),
        });

        const result = await response.json();

        if (result.success) {
            alert(`Successfully redeemed for the ${selectedPlan} plan!`);
            // Optionally, redirect to a success page or update the UI
            router.push("/resume-templates");
        } else {
            alert(result.error || "An error occurred");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-3 dark:bg-zinc-900">
            <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-zinc-300">Redeem Your Credits</h1>
            <p className="text-center text-lg text-gray-600 dark:text-zinc-400">You currently have <span className="font-bold text-teal-600">{credits}</span> credits.</p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
                <Button
                    variant="outline"
                    className={`w-fit py-4 rounded-lg border-2 font-semibold ${credits >= 150 ? "text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-white" : "text-gray-400 border-gray-300 cursor-not-allowed"}`}
                    onClick={() => setSelectedPlan("PRO")}
                    disabled={credits < 150}
                >
                    Redeem Pro Plan (150 credits)
                </Button>

                <Button
                    variant="outline"
                    className={`w-fit py-4 rounded-lg border-2 font-semibold ${credits >= 250 ? "text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-white" : "text-gray-400 border-gray-300 cursor-not-allowed"}`}
                    onClick={() => setSelectedPlan("ELITE")}
                    disabled={credits < 250}
                >
                    Redeem Elite Plan (250 credits)
                </Button>
                <Button
                    className={`py-3 mx-2 w-fit font-semibold rounded-lg ${selectedPlan ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    onClick={handleRedeem}
                    disabled={!selectedPlan}
                >
                    Confirm Redeem
                </Button>
            </div>
        </div>
    );
};

export default RedeemPlan;
