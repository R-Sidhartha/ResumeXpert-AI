"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CustomizationValues } from "@/lib/validation";
import { hexToRgbFloat, rgbFloatToHex } from "@/lib/utils";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { SectionReorder } from "./SectionReorder";


type Props = {
    value: CustomizationValues;
    onChange: (newValue: CustomizationValues) => void;
    onSave?: () => void;
    onReset?: () => void;
    defaultCustomization: CustomizationValues
};

const bulletOptions = [
    { value: "\\faAngleRight", label: "Angle Right" },
    { value: "\\textbullet", label: "Dot" },
    { value: "\\faChevronRight", label: "Chevron" },
    { value: "$\\circ$", label: "Circle" },
    { value: "\\tiny$\\bullet$", label: "Tiny dot" },
    { value: "\\faAngleDoubleRight", label: "Double Angle Right" }
];

export default function CustomizationPanel({ value, onChange, onSave,
    onReset, defaultCustomization }: Props) {
    const handleChange = (key: keyof CustomizationValues, val: string) => {
        onChange({ ...value, [key]: val });
    };


    const handleReset = () => {
        onChange(defaultCustomization);
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 items-center justify-center gap-8">
                        <div>
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
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-8 w-full my-4">
                    <div className="space-y-2">
                        <Label className="text-base font-medium">Page Margin (in)</Label>
                        <Slider
                            value={[parseFloat(value.margin?.replace("in", "") || "1")]}
                            min={0}
                            max={1.0}
                            step={0.05}
                            onValueChange={(val) => handleChange("margin", `${val[0].toFixed(2)}in`)}
                        />
                        <p className="text-muted-foreground text-sm">
                            Current: {value.margin ?? "1in"}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-base font-medium">Font Size (pt)</Label>
                        <Slider
                            value={[parseInt(value.fontSize?.replace("pt", "") || "10")]}
                            min={8}
                            max={16}
                            step={1}
                            onValueChange={(val) => handleChange("fontSize", `${val[0]}pt`)}
                        />
                        <p className="text-muted-foreground text-sm">
                            Current: {value.fontSize ?? "10pt"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-medium">Line Spacing</Label>
                        <Slider
                            value={[parseFloat(value.lineSpacing || "1.0")]}
                            min={0.8}
                            max={2.0}
                            step={0.05}
                            onValueChange={(val) => handleChange("lineSpacing", val[0].toFixed(2))}
                        />
                        <p className="text-muted-foreground text-sm">
                            Current: {value.lineSpacing ?? "1.0"}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
                    <div className="space-y-2">
                        <Label className="text-base font-medium">Word Spacing</Label>
                        <Slider
                            value={[parseInt(value.wordSpacing?.replace("pt", "") || "2")]}
                            min={0}
                            max={20}
                            step={1}
                            onValueChange={(val) => handleChange("wordSpacing", `${val[0]}pt`)}
                        />
                        <p className="text-muted-foreground text-sm">
                            Current: {value.wordSpacing ?? "3pt"}
                        </p>
                    </div>
                </div>
                <h3 className="text-md font-medium text-zinc-700 dark:text-white mt-6 mb-2">
                    Section Order
                </h3>
                {/* {plan === "gold" || plan === "diamond" ? ( */}
                <div className="my-6">
                    <SectionReorder
                        onChange={(newOrder) => onChange({ ...value, sectionOrder: newOrder })}
                        defaultValue={value.sectionOrder || undefined}
                    />
                </div>
                {/* ) : null} */}
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
