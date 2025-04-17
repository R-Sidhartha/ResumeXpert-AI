"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEFAULT_SECTIONS = [
    "summary",
    "workExperience",
    "education",
    "projects",
    "positionsOfResponsibility",
    "skills",
    "certifications",
    "achievements",
    "extraCurriculars",
];

const formatLabel = (key: string) =>
    key
        .replace(/([A-Z])/g, " $1")
        .replace(/^\w/, (c) => c.toUpperCase())
        .replace(/_/g, " ");

type Props = {
    initialTitles?: Record<string, string>;
    onChange: (titles: Record<string, string>) => void;
    onDone: () => void;
};

export function SectionTitleForm({
    initialTitles = {},
    onChange,
    onDone,
}: Props) {
    const getInitialTitles = (): Record<string, string> => {
        const titles: Record<string, string> = {};
        DEFAULT_SECTIONS.forEach((section) => {
            titles[section] = initialTitles[section] || formatLabel(section);
        });
        return titles;
    };
    // 🟢 Always pure default titles (not influenced by initialTitles)
    const getDefaultTitles = (): Record<string, string> => {
        const titles: Record<string, string> = {};
        DEFAULT_SECTIONS.forEach((section) => {
            titles[section] = formatLabel(section);
        });
        return titles;
    };

    const [sectionTitles, setSectionTitles] = useState<Record<string, string>>(
        getInitialTitles()
    );

    const handleChange = (key: string, value: string) => {
        const updated = { ...sectionTitles, [key]: value };
        setSectionTitles(updated);
        onChange(updated);
    };

    const handleReset = () => {
        const resetTitles = getDefaultTitles();
        setSectionTitles(resetTitles);
        onChange(resetTitles);
    };

    return (
        <Card className="w-full max-w-2xl rounded-2xl border shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Rename Resume Sections
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Tailor section titles to match your profile more impactfully. You can rename any section if the content aligns — for example, turning “Extra Curriculars” into “Publications” when suitable.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-3">
                    <div className="grid gap-4">
                        {DEFAULT_SECTIONS.map((key) => (
                            <div key={key} className="grid gap-2">
                                <Label htmlFor={key} className="text-sm text-muted-foreground">
                                    {formatLabel(key)}
                                </Label>
                                <Input
                                    id={key}
                                    value={sectionTitles[key]}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    className="rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 mt-6">
                <Button
                    variant="outline"
                    onClick={handleReset}
                >
                    Reset
                </Button>
                <Button onClick={onDone}>
                    Done
                </Button>
            </CardFooter>
        </Card>
    );
}

export default SectionTitleForm;
