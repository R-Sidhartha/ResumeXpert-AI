"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import CustomizationPanel from "./CustomizationPanel";
import { CustomizationValues } from "@/lib/validation";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import usePremiumModal from "@/hooks/usePremiumModal";
import { SectionTitleForm } from "./SectionTitleForm";
import { useRequireElite } from "@/lib/gating/requireElite";
import { useSubscriptionLevel } from "@/app/(main)/SubscriptionLevelProviderWrapper";


type Props = {
    value: CustomizationValues;
    onChange: (newValue: CustomizationValues) => void;
    buttonClassName?: string; // optional custom button styling
    canCustomize: boolean; // whether the user can customize or not
    defaultCustomization: CustomizationValues
};

export default function CustomizationDialog({
    value,
    onChange,
    buttonClassName = "",
    canCustomize,
    defaultCustomization
}: Props) {
    const [open, setOpen] = useState(false);
    // const premiumModal = usePremiumModal();
    const plan = useSubscriptionLevel()
    const requireElite = useRequireElite(plan);
    const handleSave = () => {
        setOpen(false);
    };

    const handleOpen = async () => {
        const hasEliteAccess = await requireElite({
            feature: "Resume Customization",
            description:
                "Customization options are available for Elite plan users. Upgrade to unlock this feature.",
        });
        if (!hasEliteAccess) {
            return
        } else {
            setOpen(true);
        }

    };

    return (
        <>
            <Button
                variant="outline"
                onClick={handleOpen}
                className={`flex items-center gap-2 rounded-full bg-white shadow-md text-black hover:text-zinc-700 hover:bg-gray-50 ${buttonClassName}`}
            >
                <Sparkles className="h-4 w-4 text-primary dark:text-black" />
                Design Settings
            </Button>
            {canCustomize && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-0">
                        <DialogHeader className="px-6 pt-6">
                            <DialogTitle className="text-xl font-bold">Customize Resume Style</DialogTitle>
                            <DialogDescription>
                                Adjust layout, spacing, colors, and section titles.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="px-6 pb-6">
                            <Tabs defaultValue="style" className="w-full">
                                <TabsList className="mb-4 w-fit justify-start">
                                    <TabsTrigger value="style">Design & Layout</TabsTrigger>
                                    <TabsTrigger value="sections">Section Titles</TabsTrigger>
                                </TabsList>
                                <TabsContent value="style">
                                    <CustomizationPanel
                                        value={value}
                                        onChange={onChange}
                                        onSave={handleSave}
                                        defaultCustomization={defaultCustomization}
                                    />
                                </TabsContent>
                                <TabsContent value="sections">
                                    <SectionTitleForm
                                        initialTitles={value.sectionTitles}
                                        onChange={(newTitles) =>
                                            onChange({
                                                ...value,
                                                sectionTitles: newTitles,
                                            })
                                        }
                                        onDone={handleSave}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
