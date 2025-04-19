"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Clock, Calendar, XCircle, AlertTriangle, Zap, ShieldCheck } from "lucide-react";
import CancelSubButton from "./CancelSubButton";
import { getPlanDetails } from "./action";

type Plan = "free" | "pro" | "elite";

type PlanData = {
    planType: Plan;
    status: string;
    razorpaySubscriptionId: string;
    nextBillingAt: string | null;
};

const PLAN_DETAILS: Record<Plan, { label: string; color: string; icon: JSX.Element; perks: string[] }> = {
    free: {
        label: "Free Tier",
        color: "text-gray-500 border-gray-300 bg-gray-100",
        icon: <ShieldCheck className="text-gray-500" />,
        perks: ["Basic resume builder", "One free template", "No customizations"],
    },
    pro: {
        label: "Pro Plan",
        color: "text-blue-700 border-blue-200 bg-blue-100",
        icon: <Zap className="text-blue-600" />,
        perks: [
            "Access to all premium resume templates",
            "Create and manage upto 10 resumes",
            "AI-powered resume writing assistance",
            "Auto-fill using previous resume data"
        ]
    },
    elite: {
        label: "Elite Plan",
        color: "text-green-800 border-green-300 bg-green-100",
        icon: <ShieldCheck className="text-green-600" />,
        perks: ["Everything in Pro", "Unlimited Resume Creation", "Customizations", "Early access to new features"],
    },
};

export const PlanInfo = () => {
    const [plan, setPlan] = useState<PlanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchPlanDetails = async () => {
            try {
                const planDetails = await getPlanDetails();
                if (isMounted) {
                    if (planDetails) {
                        setPlan({
                            planType: planDetails.planType as Plan,
                            status: planDetails.status,
                            razorpaySubscriptionId: planDetails.razorpaySubscriptionId as string,
                            nextBillingAt: planDetails.nextBillingAt
                                ? new Date(planDetails.nextBillingAt).toLocaleDateString()
                                : null,
                        });
                    } else {
                        setError("No active subscription found.");
                    }
                }
            } catch (err) {
                console.error("Error fetching plan details:", err);
                if (isMounted) setError("Failed to load subscription data.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPlanDetails();
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse p-6 rounded-2xl bg-white/60 backdrop-blur border border-zinc-200 shadow-inner ">
                <div className="h-6 w-1/3 bg-zinc-200 rounded mb-4" />
                <div className="h-4 w-2/3 bg-zinc-100 rounded" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-100 border border-red-200 rounded-xl">
                <XCircle className="w-5 h-5" />
                {error}
            </div>
        );
    }

    const { label, color, icon, perks } = PLAN_DETAILS[plan!.planType];
    const isCancelled = plan?.status === "canceled" || plan?.status === "cancelled";

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-zinc-200 rounded-3xl shadow-xl px-6 py-8 space-y-6 max-w-3xl mx-auto animate-fade-in dark:bg-zinc-900">
            <div className="flex items-center flex-col sm:flex-row gap-3 sm:gap-0 justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-300">Your Current Plan</h2>
                    <p className="text-zinc-600 text-sm dark:text-zinc-400">Manage your subscription and plan details</p>
                </div>
                <div className={`px-3 py-1 text-sm font-semibold rounded-full border ${color} uppercase flex items-center gap-2`}>
                    {icon}
                    {label}
                </div>
            </div>

            <div className="space-y-2 text-zinc-700 text-sm dark:text-zinc-300">
                {plan?.planType !== "free" ? (
                    <>
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="h-5 w-5 text-green-600" />
                            <span>
                                You are subscribed to the <span className="font-semibold capitalize">{plan?.planType}</span> plan.
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            Status: <span className="font-medium">{plan?.status}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            Next Billing Date: <span className="font-medium">{plan?.nextBillingAt ?? "N/A"}</span>
                        </div>
                    </>
                ) : (
                    <div className="text-zinc-700 dark:text-zinc-300">
                        <p>
                            You are currently using the <span className="font-semibold">{label}</span>.
                        </p>
                        <p className="text-sm text-zinc-500">Upgrade for access to premium templates and features.</p>
                    </div>
                )}

                {isCancelled && (
                    <div className="mt-4 p-4 border border-yellow-300 bg-yellow-50 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="text-yellow-600 w-5 h-5 mt-1" />
                        <div>
                            <p className="text-sm text-yellow-800 font-semibold">Subscription Cancelled</p>
                            <p className="text-sm text-yellow-700">
                                Your current plan has been cancelled. However, premium access remains until{" "}
                                <span className="font-medium">{plan?.nextBillingAt ?? "end of current period"}</span>.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {!isCancelled && plan?.planType !== "free" && plan?.razorpaySubscriptionId && (
                <div className="pt-4 border-t border-zinc-200">
                    <CancelSubButton razorpaySubscriptionId={plan.razorpaySubscriptionId} />
                </div>
            )}

            {/* Feature Highlights */}
            <div className="pt-6 border-t border-zinc-200">
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-2">Plan Perks</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-800 text-sm dark:text-zinc-400">
                    {perks.map((perk, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-green-500" />
                            {perk}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
