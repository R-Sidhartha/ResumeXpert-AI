"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ReferralCard({ referralCode }: { referralCode: string }) {
    const [referralLink, setReferralLink] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const origin = window.location.origin;
            setReferralLink(`${origin}/sign-up?ref=${referralCode}`);
        }
    }, [referralCode]);

    const copyToClipboard = async () => {
        if (!referralLink) return;
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-4 border rounded-xl shadow space-y-4 bg-white dark:bg-zinc-900">
            <h2 className="text-lg font-bold dark:text-zinc-200">Your Referral Link</h2>
            <p className="text-sm text-gray-600 dark:text-zinc-300">
                Share this link and earn credits when someone subscribes.
            </p>

            {referralLink ? (
                <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md dark:bg-zinc-800">
                    <span className="text-sm break-all w-[80%]">{referralLink}</span>
                    <Button onClick={copyToClipboard} size="sm">
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-between gap-2 bg-gray-100 px-3 py-2 rounded-md">
                    <div className="h-5 w-[80%] bg-gray-300 rounded animate-pulse" />
                    <div className="h-8 w-16 bg-gray-300 rounded-md animate-pulse" />
                </div>
            )}
        </div>
    );
}
