// lib/requirePremium.ts
import usePremiumModal from "@/hooks/usePremiumModal";

interface ConentProps {
  feature: string;
  description: string;
}

export const useRequirePremium = () => {
  const { setModalContent } = usePremiumModal();

  return ({ feature, description }: ConentProps) => {
    setModalContent({
      feature,
      title: "Premium Feature",
      description: `${description}`,
    });
  };
};
