import BulletTextarea from "@/components/BulletTextarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { EditorFormProps } from "@/lib/types";
import { extraCurricularSchema, ExtraCurricularValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ExtraCurricularForm({ resumeData, setResumeData }: EditorFormProps) {
    const form = useForm<ExtraCurricularValues>({
        resolver: zodResolver(extraCurricularSchema),
        defaultValues: {
            extraCurriculars: resumeData.extraCurriculars || [""],
        },
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return;
            setResumeData({
                ...resumeData,
                extraCurriculars:
                    values.extraCurriculars
                        ?.filter((item) => item !== undefined)
                        .map((item) => item.trim())
                        .filter((item) => item !== "") || [],
            });
        });
        // console.log(resumeData)
        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Extra Curriculars</h2>
                <p className="text-sm text-muted-foreground">Highlight your extra-curricular activities</p>
            </div>
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="extraCurriculars"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Extra-Curriculars</FormLabel>
                                <FormControl>
                                    <BulletTextarea
                                        value={field.value || []}
                                        onChange={(newValue) => field.onChange(newValue)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
}
