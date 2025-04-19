import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ReferralCard } from "@/components/ReferralCard";
import RedeemPlan from "@/components/RedeemPlan";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Refer & Earn",
};

export default async function ReferralPage() {
    const user = await currentUser();
    if (!user)
        return (
            <div className="flex items-center justify-center h-screen text-center text-lg text-gray-700 dark:text-gray-300">
                Please log in to view your referral info.
            </div>
        );

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
        include: {
            sentReferrals: {
                include: { referee: true },
            },
        },
    });

    if (!dbUser)
        return (
            <div className="flex items-center justify-center h-screen text-center text-red-600 text-lg">
                User not found in DB.
            </div>
        );

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 px-4 py-10 sm:px-8 md:px-16 lg:px-24 transition-colors duration-300">
            <div className="mx-auto w-full max-w-6xl space-y-14">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-green-800 dark:text-green-300 drop-shadow-sm tracking-tight">
                        🌱 Grow with Referrals
                    </h1>
                    <p className="text-gray-600 dark:text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto">
                        Invite your friends, earn credits, and unlock exclusive perks. Share the love and grow together.
                    </p>
                </div>

                {/* Referral Code Card */}
                <div className="bg-white/70 dark:bg-zinc-800/70 border border-green-200 dark:border-zinc-700 rounded-3xl shadow-xl px-6 py-8 backdrop-blur-md transition">
                    <ReferralCard referralCode={dbUser.referralCode} />
                </div>

                {/* Redeem Credits */}
                <RedeemPlan credits={dbUser.credits || 0} />

                {/* Referrals Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
                        Your Referrals
                    </h2>

                    {dbUser.sentReferrals.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-zinc-400 italic">
                            You haven’t referred anyone yet. Share your link and get rewarded!
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {dbUser.sentReferrals.map((referral) => (
                                <div
                                    key={referral.id}
                                    className={cn(
                                        "group bg-white/90 dark:bg-zinc-800/80 border border-green-100 dark:border-zinc-700 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center text-xl font-bold shadow-inner">
                                            {referral.referee.firstName?.[0] || "A"}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-green-900 dark:text-green-200 text-lg">
                                                {referral.referee.firstName || "Anonymous"}{" "}
                                                {referral.referee.lastName || ""}
                                            </span>
                                            <span className="text-sm">
                                                {referral.rewardGiven ? (
                                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                                        ✅ Reward Earned
                                                    </span>
                                                ) : (
                                                    <span className="text-yellow-500 font-medium">
                                                        ⏳ Pending Subscription
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
