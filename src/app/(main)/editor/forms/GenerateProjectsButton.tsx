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
import { GenerateProjectsInput, generateProjectsSchema, Projects } from "@/lib/validation";
// import { useToast } from "@/hooks/use-toast";
// import usePremiumModal from "@/hooks/usePremiumModal";
// import { canUseAITools } from "@/lib/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateProject } from "./action";
import { toast } from "sonner";
// import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
// import { generateWorkExperience } from "./actions";

interface GenerateProjectsButtonProps {
    onProjectsGenerated: (Projects: Projects) => void;
}

export default function GenerateProjectsButton({
    onProjectsGenerated,
}: GenerateProjectsButtonProps) {
    //   const subscriptionLevel = useSubscriptionLevel();

    //   const premiumModal = usePremiumModal();

    const [showInputDialog, setShowInputDialog] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                type="button"
                onClick={() => {
                    //   if (!canUseAITools(subscriptionLevel)) {
                    //     premiumModal.setOpen(true);
                    //     return;
                    //   }
                    setShowInputDialog(true);
                }}
            >
                <WandSparklesIcon className="size-4" />
                Smart fill (AI)
            </Button>
            <InputDialog
                open={showInputDialog}
                onOpenChange={setShowInputDialog}
                onProjectsGenerated={(projects) => {
                    onProjectsGenerated(projects);
                    setShowInputDialog(false);
                }}
            />
        </>
    );
}

interface InputDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProjectsGenerated: (Projects: Projects) => void;
}

function InputDialog({
    open,
    onOpenChange,
    onProjectsGenerated,
}: InputDialogProps) {
    //   const { toast } = useToast();

    const form = useForm<GenerateProjectsInput>({
        resolver: zodResolver(generateProjectsSchema),
        defaultValues: {
            description: "",
        },
    });

    async function onSubmit(input: GenerateProjectsInput) {
        try {
            const response = await generateProject(input);
            onProjectsGenerated(response);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
        console.log("Generated Projects:", input.description);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Projects</DialogTitle>
                    <DialogDescription>
                        Describe this Project and the AI will generate an optimized
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
