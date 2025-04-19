"use client";

import { useState } from "react";
import Script from "next/script";
import { createSubscription } from "@/app/(main)/subscriptions/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

export function SubscriptionButton({ planType }: { planType: "pro" | "elite" }) {
    const [loading, setLoading] = useState(false);
    const [celebration, setCelebration] = useState(false);
    const router = useRouter();


    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const { subscriptionId } = await createSubscription(planType);

            const razorpay = new window.Razorpay({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: subscriptionId,
                name: "ResumeXpert",
                description: `Subscribe to ${planType} plan`,
                handler: async function (response: any) {
                    toast.success("Payment successful! 🎉");
                    const verifyResponse = await fetch("/api/verify-subscription", {
                        method: "POST",
                        body: JSON.stringify({
                            subscriptionId: response.razorpay_subscription_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            planType,
                        }),
                    });
                    const result = await verifyResponse.json();

                    if (result.success) {
                        setCelebration(true);
                        setTimeout(() => {
                            router.push("/billing");
                        }, 4000);
                    } else {
                        toast.error("Subscription verification failed. Please contact support.");
                        console.error("Verification failed:", result);
                    }
                },
                theme: {
                    color: "#6366F1",
                },
            });

            razorpay.open();
        } catch (err) {
            console.error("Subscription Error:", err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <button
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-green-900 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
                {loading ? "Processing..." : `Subscribe to ${planType}`}
            </button>
            {celebration && (
                <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center text-center space-y-6">
                    <Confetti width={500} height={500} recycle={false} numberOfPieces={500} />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                        🎉 Welcome to the {planType.toUpperCase()} Plan!
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200">
                        You’ve unlocked premium resume features. Time to shine ✨
                    </p>
                    <button
                        onClick={() => router.push("/resume-templates")}
                        className="mt-4 bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-full shadow-lg transition"
                    >
                        Go to My Resumes
                    </button>
                </div>
            )}
        </>
    );
}
