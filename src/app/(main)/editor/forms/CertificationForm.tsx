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
import { certificationSchema, CertificationValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function AchievementsForm({ resumeData, setResumeData }: EditorFormProps) {
    const form = useForm<CertificationValues>({
        resolver: zodResolver(certificationSchema),
        defaultValues: {
            certifications: resumeData.certifications || [""],
        },
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return;
            setResumeData({
                ...resumeData,
                certifications:
                    values.certifications
                        ?.filter((cert) => cert !== undefined)
                        .map((cert) => cert.trim())
                        .filter((cert) => cert !== "") || [],
            });
        });
        // console.log(resumeData)
        return unsubscribe;
    }, [form, resumeData, setResumeData]);


    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Certifications</h2>
                <p className="text-sm text-muted-foreground">Highlight your courses or certifications</p>
            </div>
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="certifications"
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
