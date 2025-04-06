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
import { achievementsSchema, AchievementsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface AchievementsForm {
    achievements: string[];
}

export default function AchievementsForm({ resumeData, setResumeData }: EditorFormProps) {
    const form = useForm<AchievementsValues>({
        resolver: zodResolver(achievementsSchema),
        defaultValues: {
            achievements: resumeData.achievements || [""],
        },
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return;
            setResumeData({
                ...resumeData,
                achievements:
                    values.achievements
                        ?.filter((achievement) => achievement !== undefined)
                        .map((achievement) => achievement.trim())
                        .filter((achievement) => achievement !== "") || [],
            });
        });
        // console.log(resumeData)
        return unsubscribe;
    }, [form, resumeData, setResumeData]);


    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Achievements</h2>
                <p className="text-sm text-muted-foreground">List your key accomplishments. One per line.</p>
            </div>
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="achievements"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Achievements</FormLabel>
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
