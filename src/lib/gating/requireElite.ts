// import { getCurrentUserSubscriptionLevel } from "@/lib/subscription";
import usePremiumModal from "@/hooks/usePremiumModal";

interface ContentProps {
  feature: string;
  description: string;
}

export const useRequireElite = (plan: string) => {
  const { setModalContent } = usePremiumModal();

  return async ({ feature, description }: ContentProps): Promise<boolean> => {
    if (plan !== "elite") {
      setModalContent({
        title: "Elite Feature",
        feature,
        description:
          description ||
          "This feature is exclusive to Elite members. Please upgrade to unlock full access.",
      });
      return false;
    }

    return true;
  };
};
