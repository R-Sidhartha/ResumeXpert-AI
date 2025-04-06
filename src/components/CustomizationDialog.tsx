"use client";

import {
    Dialog,
    // DialogTrigger,
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
import { DEFAULT_CUSTOMIZATIONS } from "@/lib/utils";
import usePremiumModal from "@/hooks/usePremiumModal";


type Props = {
    value: CustomizationValues;
    onChange: (newValue: CustomizationValues) => void;
    buttonClassName?: string; // optional custom button styling
    canCustomize: boolean; // whether the user can customize or not
};

export default function CustomizationDialog({
    value,
    onChange,
    buttonClassName = "",
    canCustomize
}: Props) {
    const [open, setOpen] = useState(false);
    const premiumModal = usePremiumModal();

    const handleSave = () => {
        // apply the changes to parent
        setOpen(false);        // close the dialog
    };

    const handleReset = () => {
        onChange(DEFAULT_CUSTOMIZATIONS); // reset to default
    };

    const handleOpen = () => {
        if (canCustomize) {
            setOpen(true);
        } else {
            premiumModal.setOpen(true);
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
                    {/* <DialogTrigger asChild>
            </DialogTrigger> */}
                    <DialogContent className="max-w-3xl sm:max-w-2xl rounded-2xl shadow-lg border">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Customize Resume Style</DialogTitle>
                            <DialogDescription>
                                Adjust spacing, colors, margins, and visual preferences for your resume.
                            </DialogDescription>
                        </DialogHeader>
                        <CustomizationPanel value={value} onChange={onChange} onSave={handleSave}
                            onReset={handleReset} />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
