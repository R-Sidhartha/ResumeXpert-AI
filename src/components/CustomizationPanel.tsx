"use client";

// import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CustomizationValues } from "@/lib/validation";
import { DEFAULT_CUSTOMIZATIONS, hexToRgbFloat, rgbFloatToHex } from "@/lib/utils";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";


type Props = {
    value: CustomizationValues;
    onChange: (newValue: CustomizationValues) => void;
    onSave?: () => void;
    onReset?: () => void;
};

const bulletOptions = [
    { value: "\\faAngleRight", label: "Angle Right" },
    { value: "\\textbullet", label: "dot" },
    { value: "\\faChevronRight", label: "Chevron" },
];

const fontSizes = ["10pt", "11pt", "12pt"];
const spacingOptions = ["1.0", "1.15", "1.5", "2.0"];
const marginOptions = ["0.5in", "0.75in", "1in"];

export default function CustomizationPanel({ value, onChange, onSave,
    onReset, }: Props) {
    const handleChange = (key: keyof CustomizationValues, val: string) => {
        onChange({ ...value, [key]: val });
    };

    const handleReset = () => {
        onChange(DEFAULT_CUSTOMIZATIONS);
        onReset?.();
    };

    const handleSave = () => {
        onSave?.();
    };

    return (
        <Card className="w-full max-w-2xl rounded-2xl p-4 shadow-md border">
            <CardContent className="grid gap-4">
                <div>
                    <h2 className="text-lg my-6 font-semibold text-zinc-800 dark:text-white">
                        Customize according to your likes
                    </h2>
                    <Label>Primary Color</Label>
                    <Input
                        type="color"
                        value={rgbFloatToHex(value.color || "0.25, 0.5, 0.75")} // convert float RGB to HEX
                        onChange={(e) => {
                            const rgbColor = hexToRgbFloat(e.target.value); // convert back to RGB float
                            handleChange("color", rgbColor);
                        }}
                        className="w-24"
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-8 w-full my-4">
                    <div>
                        <Label>Bullet Icon</Label>
                        <Select value={value.bulletIcon} onValueChange={(v) => handleChange("bulletIcon", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Bullet Icon" />
                            </SelectTrigger>
                            <SelectContent>
                                {bulletOptions.map((b) => (
                                    <SelectItem key={b.value} value={b.value}>
                                        {b.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Page Margin</Label>
                        <Select value={value.margin} onValueChange={(v) => handleChange("margin", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Margin" />
                            </SelectTrigger>
                            <SelectContent>
                                {marginOptions.map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Font Size</Label>
                        <Select value={value.fontSize} onValueChange={(v) => handleChange("fontSize", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Font Size" />
                            </SelectTrigger>
                            <SelectContent>
                                {fontSizes.map((size) => (
                                    <SelectItem key={size} value={size}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Line Spacing</Label>
                        <Select value={value.lineSpacing} onValueChange={(v) => handleChange("lineSpacing", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Line Spacing" />
                            </SelectTrigger>
                            <SelectContent>
                                {spacingOptions.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center gap-12">
                    <div className="space-y-2">
                        <Label className="text-base font-medium">Section Spacing</Label>
                        <Slider
                            value={[parseInt(value.sectionSpacing?.replace("pt", "") || "25")]}
                            min={0}
                            max={50}
                            step={1}
                            onValueChange={(val) => handleChange("sectionSpacing", `${val[0]}pt`)}
                        />
                        <p className="text-muted-foreground text-sm">
                            Current: {value.sectionSpacing ?? "25pt"}
                        </p>
                    </div>

                    {/* Item Spacing */}
                    <div className="space-y-2">
                        <Label className="text-base font-medium">Item Spacing</Label>
                        <Slider
                            value={[parseInt(value.itemSpacing?.replace("pt", "") || "2")]}
                            min={0}
                            max={20}
                            step={1}
                            onValueChange={(val) => handleChange("itemSpacing", `${val[0]}pt`)}
                        />
                        <p className="text-muted-foreground text-sm">
                            Current: {value.itemSpacing ?? "4pt"}
                        </p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button onClick={handleSave}>Done</Button>
                </div>
            </CardContent>
        </Card>
    );
}
