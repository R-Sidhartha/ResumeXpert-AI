import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    //   FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { customSectionSchema, CustomSectionValues } from "@/lib/validation";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import BulletTextarea from "@/components/BulletTextarea";

export default function CustomSectionForm({ resumeData, setResumeData }: EditorFormProps) {
    const form = useForm<CustomSectionValues>({
        resolver: zodResolver(customSectionSchema),
        defaultValues: {
            customSections: resumeData.customSections || [],
        },
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return;
            setResumeData({
                ...resumeData,
                customSections: values.customSections?.filter((sec) => sec !== undefined).map((sec) => ({
                    title: sec.title,
                    entries: sec.entries?.map((entry) => ({
                        ...entry,
                        description: entry?.description?.filter((desc) => desc !== undefined) || [],
                    })) || [],
                })) || [],
            });
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "customSections",
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((field) => field.id === active.id);
            const newIndex = fields.findIndex((field) => field.id === over.id);
            move(oldIndex, newIndex);
            return arrayMove(fields, oldIndex, newIndex);
        }
    }

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Custom Sections</h2>
                <p className="text-sm text-muted-foreground">Add custom sections like volunteering, publications, etc.</p>
                <h3 className="text-center text-xs text-yellow-600"> Wrap any word in {`{curly braces}`} to highlight it in your resume.</h3>
            </div>
            <Form {...form}>
                <form className="space-y-3">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                            {fields.map((field, index) => (
                                <CustomSectionItem
                                    id={field.id}
                                    key={field.id}
                                    index={index}
                                    form={form}
                                    remove={remove}
                                    append={append}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            onClick={() =>
                                append({
                                    title: "",
                                    // order: 0, // assuming ordering starts at 0
                                    entries: [],
                                })
                            }
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="size-5" /> Add custom section
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

interface CustomSectionItemProps {
    id: string;
    form: UseFormReturn<CustomSectionValues>;
    index: number;
    remove: (index: number) => void;
    append: (value: any) => void;
}

function CustomSectionItem({ id, form, index, remove }: CustomSectionItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const { fields: entries, append: appendEntry, remove: removeEntry } = useFieldArray({
        control: form.control,
        name: `customSections.${index}.entries`,
    });

    return (
        <div
            className={cn("space-y-3 rounded-md border bg-background p-3", isDragging && "relative z-50 cursor-grab shadow-xl")}
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
        >
            <div className="flex justify-between gap-2">
                <span className="font-semibold">Section {index + 1}</span>
                <GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none" {...attributes} {...listeners} />
            </div>
            <FormField
                control={form.control}
                name={`customSections.${index}.title`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
                Tip: You can leave fields empty if not applicable. If your section doesn’t require a heading or subheading (like a list of achievements or hobbies), feel free to directly enter the bullet points in the description below.
            </div>

            {/* Iterate over entries and add fields for each entry */}
            <div className="space-y-8 border-t border-b p-4 shadow-lg rounded-xl">
                {entries.map((entry, entryIndex) => (
                    <div key={entry.id}>
                        <FormField
                            control={form.control}
                            name={`customSections.${index}.entries.${entryIndex}.heading`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Heading</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`customSections.${index}.entries.${entryIndex}.subheading`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subheading <span className="text-sm text-zinc-700 dark:text-zinc-300">(if any)</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`customSections.${index}.entries.${entryIndex}.location`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location <span className="text-sm text-zinc-700 dark:text-zinc-300">(if any)</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name={`customSections.${index}.entries.${entryIndex}.startDate`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start date</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" value={field.value?.slice(0, 10)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`customSections.${index}.entries.${entryIndex}.endDate`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End date</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" value={field.value?.slice(0, 10)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name={`customSections.${index}.entries.${entryIndex}.description`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <BulletTextarea
                                            value={field.value || []}
                                            onChange={(newValue) => form.setValue(`customSections.${index}.entries.${entryIndex}.description`, newValue)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant="ghost" type="button" onClick={() => removeEntry(entryIndex)} className="mt-4 text-red-500">
                            <Trash2 />Remove Entry
                        </Button>
                    </div>
                ))}
                <Button variant="secondary" type="button" onClick={() => appendEntry({ heading: "", subheading: "", location: "", startDate: "", endDate: "", description: [] })}>
                    Add Entry
                </Button>
            </div>
            <Button variant="destructive" type="button" onClick={() => remove(index)}>
                Remove
            </Button>
        </div>
    );
}