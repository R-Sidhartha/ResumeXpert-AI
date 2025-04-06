import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { ExtraCurricularSchema, ExtraCurricularValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function ExtraCurricularForm({ resumeData, setResumeData }: EditorFormProps) {
    const form = useForm<ExtraCurricularValues>({
        resolver: zodResolver(ExtraCurricularSchema),
        defaultValues: {
            ExtraCurriculars: resumeData.ExtraCurriculars || [""],
        },
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return;
            setResumeData({
                ...resumeData,
                ExtraCurriculars:
                    values.ExtraCurriculars
                        ?.filter((item) => item !== undefined)
                        .map((item) => item.trim())
                        .filter((item) => item !== "") || [],
            });
        });
        // console.log(resumeData)
        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "ExtraCurriculars",
    });

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Extra-Curriculars</h2>
                <p className="text-sm text-muted-foreground">Highlight your key extra-curricular activities.</p>
            </div>
            <Form {...form}>
                <form className="space-y-3">
                    {fields?.map((field, index) => (
                        <div key={field.id} className="relative flex items-center justify-center gap-2">
                            <FormField
                                control={form.control}
                                name={`ExtraCurriculars.${index}`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="sr-only">Extra Curricular</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter your extra-curricular activity" autoFocus />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {fields.length > 0 && (
                                <Button variant="destructive" type="button" onClick={() => remove(index)} size="icon">
                                    <Trash2 className="size-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            onClick={() => append("")}
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="size-5" /> Add Extra Curricular
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
