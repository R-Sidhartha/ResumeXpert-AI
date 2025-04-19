import LoadingButton from "@/components/LoadingButton";
// import { useToast } from "@/hooks/use-toast";
// import usePremiumModal from "@/hooks/usePremiumModal";
// import { canUseAITools } from "@/lib/permissions";
import { ResumeValues } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { generateSummary } from "./action";
import { toast } from "sonner";
import { useRequirePro } from "@/lib/gating/requirePro";
import { useSubscriptionLevel } from "../../SubscriptionLevelProviderWrapper";
// import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";

interface GenerateSummaryButtonProps {
    resumeData: ResumeValues;
    onSummaryGenerated: (summary: string) => void;
}

export default function GenerateSummaryButton({
    resumeData,
    onSummaryGenerated,
}: GenerateSummaryButtonProps) {
    //   const subscriptionLevel = useSubscriptionLevel();

    //   const premiumModal = usePremiumModal();

    //   const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const plan = useSubscriptionLevel()
    const requirePro = useRequirePro(plan);

    async function handleClick() {
        const hasAccess = await requirePro({
            feature: "Projects AI Generation",
            description: "Generating projects using AI is available on Pro and Elite plans. Please upgrade to unlock this feature.",
        });

        if (!hasAccess) return;

        try {
            setLoading(true);
            const aiResponse = await generateSummary(resumeData);
            onSummaryGenerated(aiResponse);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <LoadingButton
            variant="outline"
            type="button"
            onClick={handleClick}
            loading={loading}
        >
            <WandSparklesIcon className="size-4" />
            Generate (AI)
        </LoadingButton>
    );
}
