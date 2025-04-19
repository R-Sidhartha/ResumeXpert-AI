import usePremiumModal from "@/hooks/usePremiumModal";

interface ContentProps {
  feature: string;
  description: string;
}

export const useRequirePro = (plan: string) => {
  const { setModalContent } = usePremiumModal();

  return async ({ feature, description }: ContentProps): Promise<boolean> => {
    if (plan === "free") {
      setModalContent({
        title: "Pro Feature",
        feature,
        description:
          description || "Upgrade to Pro or Elite to access this feature.",
      });
      return false;
    }

    return true;
  };
};
