// import { getUserSubscriptionLevel } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import Navbar from "../Navbar";
import { storeUserOnLogin } from "../(auth)/action";
import PremiumModal from "@/components/PremiumModal";
import { redirect } from "next/navigation";
// import SubscriptionLevelProvider from "./SubscriptionLevelProvider";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const user = await storeUserOnLogin();

    if (!user.onboarded) {
        redirect("/onboarding");
    }

    //   const userSubscriptionLevel = await getUserSubscriptionLevel(userId);

    return (
        // <SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
        <div className="flex min-h-screen flex-col">
            <Navbar />
            {children}
            <PremiumModal />
        </div>
        // </SubscriptionLevelProvider>
    );
}
