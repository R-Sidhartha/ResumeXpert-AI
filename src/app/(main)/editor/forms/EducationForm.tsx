import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";
import { educationSchema, EducationValues } from "@/lib/validation";
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
import { GripHorizontal, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

export default function EducationForm({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const form = useForm<EducationValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            educations: resumeData.educations || [],
        },
    });

    const [highestQualificationIndex, setHighestQualificationIndex] = useState<number | null>(
        resumeData.educations?.findIndex((edu) => edu.isHighestQualification) ?? null
    );

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return;
            setResumeData({
                ...resumeData,
                educations: values.educations?.filter((edu) => edu !== undefined) || [],
            });
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "educations",
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
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
                <h2 className="text-2xl font-semibold">Education</h2>
                <p className="text-sm text-muted-foreground">
                    Add as many educations as you like.
                </p>
                <h3 className="text-center text-xs text-yellow-600"> Wrap any word in {`{curly braces}`} to highlight it in your resume.</h3>
            </div>
            <Form {...form}>
                <form className="space-y-3">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={fields}
                            strategy={verticalListSortingStrategy}
                        >
                            {fields.map((field, index) => (
                                <EducationItem
                                    id={field.id}
                                    key={field.id}
                                    index={index}
                                    form={form}
                                    remove={remove}
                                    highestQualificationIndex={highestQualificationIndex}
                                    setHighestQualificationIndex={setHighestQualificationIndex}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            onClick={() =>
                                append({
                                    degree: "",
                                    branch: "",
                                    score: "",
                                    school: "",
                                    startDate: "",
                                    endDate: "",
                                })
                            }
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="size-5" /> Add education
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

interface EducationItemProps {
    id: string;
    form: UseFormReturn<EducationValues>;
    index: number;
    remove: (index: number) => void;
    highestQualificationIndex: number | null;
    setHighestQualificationIndex: (index: number | null) => void;
}

function EducationItem({ id, form, index, remove, highestQualificationIndex,
    setHighestQualificationIndex }: EducationItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    return (
        <div
            className={cn(
                "space-y-3 rounded-md border bg-background p-3",
                isDragging && "relative z-50 cursor-grab shadow-xl",
            )}
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            <div className="flex justify-between gap-2">
                <span className="font-semibold">Education {index + 1}</span>
                <GripHorizontal
                    className="size-5 cursor-grab text-muted-foreground focus:outline-none"
                    {...attributes}
                    {...listeners}
                />
            </div>
            <FormField
                control={form.control}
                name={`educations.${index}.isHighestQualification`}
                render={() => (
                    <FormItem className="flex items-center gap-2">
                        <FormControl>
                            <Checkbox
                                checked={index === highestQualificationIndex}
                                onCheckedChange={(checked: boolean) => {
                                    if (checked) {
                                        setHighestQualificationIndex(index);
                                        form.setValue(`educations.${index}.isHighestQualification`, true);
                                    } else {
                                        setHighestQualificationIndex(null);
                                        form.setValue(`educations.${index}.isHighestQualification`, false);
                                    }
                                }}
                            />
                        </FormControl>
                        <FormLabel>Highest Qualification</FormLabel>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`educations.${index}.degree`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                            <Input {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`educations.${index}.branch`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <FormControl>
                            <Input {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`educations.${index}.score`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Grade / Percentage</FormLabel>
                        <FormControl>
                            <Input {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`educations.${index}.school`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>School</FormLabel>
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
                    name={`educations.${index}.startDate`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start date</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    value={field.value?.slice(0, 10)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`educations.${index}.endDate`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End date</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    value={field.value?.slice(0, 10)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Button variant="destructive" type="button" onClick={() => remove(index)}>
                Remove
            </Button>
        </div>
    );
}
