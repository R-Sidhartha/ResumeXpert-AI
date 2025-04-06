import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PlusCircle } from "lucide-react";

export default function SkillsForm({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const form = useForm<SkillsValues>({
        resolver: zodResolver(skillsSchema),
        defaultValues: {
            skills: resumeData.skills || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "skills",
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return;
            setResumeData({
                ...resumeData,
                skills:
                    values.skills
                        ?.filter((skill) => skill !== undefined)
                        .map((skill) => ({
                            label: skill.label?.trim() || "", // Ensure label is always a string
                            skills: skill.skills
                                ?.filter((s) => s !== undefined)
                                .map((s) => s.trim())
                                .filter((s) => s !== "") || [], // Ensure valid skills array
                        })) || [],
            });
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Skills</h2>
                <p className="text-sm text-muted-foreground">
                    Organize your skills into categories (e.g., Technical Skills, Soft Skills).
                </p>
            </div>
            <Form {...form}>
                <form className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-2 border p-4 rounded-lg">
                            {/* Skill Category Label */}
                            <FormField
                                control={form.control}
                                name={`skills.${index}.label`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g. Technical Skills" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Skills (Comma-Separated) */}
                            <FormField
                                control={form.control}
                                name={`skills.${index}.skills`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Skills</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g. React, Node.js, TypeScript"
                                                value={field.value.join(", ")}
                                                onChange={(e) =>
                                                    field.onChange(e.target.value.split(",").map((s) => s.trim()))
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>Separate each skill with a comma.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Remove Category Button */}
                            <Button variant="destructive" type="button" onClick={() => remove(index)}>
                                Remove Category
                            </Button>
                        </div>
                    ))}

                    {/* Add New Skill Category Button */}
                    <div className="flex justify-center items-center">
                        <Button
                            type="button"
                            onClick={() => append({ label: "", skills: [] })}
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="size-5" /> Add Skill Category
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
