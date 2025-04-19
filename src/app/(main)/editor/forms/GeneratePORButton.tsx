import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { GeneratePORInput, generatePORSchema, POR } from "@/lib/validation";
// import { useToast } from "@/hooks/use-toast";
// import usePremiumModal from "@/hooks/usePremiumModal";
// import { canUseAITools } from "@/lib/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generatePOR } from "./action";
import { toast } from "sonner";
import { useRequirePro } from "@/lib/gating/requirePro";
import { useSubscriptionLevel } from "../../SubscriptionLevelProviderWrapper";
// import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
// import { generateWorkExperience } from "./actions";

interface GeneratePORButtonProps {
    onPORGenerated: (POR: POR) => void;
}

export default function GeneratePORButton({
    onPORGenerated,
}: GeneratePORButtonProps) {
    //   const subscriptionLevel = useSubscriptionLevel();

    //   const premiumModal = usePremiumModal();

    const [showInputDialog, setShowInputDialog] = useState(false);
    const plan = useSubscriptionLevel()
    const requirePro = useRequirePro(plan);
    return (
        <>
            <Button
                variant="outline"
                type="button"
                onClick={async () => {
                    const hasAccess = await requirePro({
                        feature: "Projects AI Generation",
                        description: "Generating projects using AI is available on Pro and Elite plans. Please upgrade to unlock this feature.",
                    });

                    if (!hasAccess) return;
                    setShowInputDialog(true);
                }}
            >
                <WandSparklesIcon className="size-4" />
                Smart fill (AI)
            </Button>
            <InputDialog
                open={showInputDialog}
                onOpenChange={setShowInputDialog}
                onPORGenerated={(por) => {
                    onPORGenerated(por);
                    setShowInputDialog(false);
                }}
            />
        </>
    );
}

interface InputDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPORGenerated: (POR: POR) => void;
}

function InputDialog({
    open,
    onOpenChange,
    onPORGenerated,
}: InputDialogProps) {
    //   const { toast } = useToast();

    const form = useForm<GeneratePORInput>({
        resolver: zodResolver(generatePORSchema),
        defaultValues: {
            description: "",
        },
    });

    async function onSubmit(input: GeneratePORInput) {
        try {
            const response = await generatePOR(input);
            onPORGenerated(response);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
        console.log("Generated POR:", input.description);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate POR</DialogTitle>
                    <DialogDescription>
                        Describe this POR and the AI will generate an optimized
                        entry for you.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder={`E.g. "from nov 2019 to dec 2019 I worked on a project named xyz, and in that: ..."`}
                                            autoFocus
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                            Generate
                        </LoadingButton>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
