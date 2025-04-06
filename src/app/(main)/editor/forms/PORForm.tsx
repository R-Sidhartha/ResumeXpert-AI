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
import { cn } from "@/lib/utils";
import { porSchema, PORValues } from "@/lib/validation";
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
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import GeneratePORButton from "./GeneratePORButton";
import BulletTextarea from "@/components/BulletTextarea";
// import GenerateProjectsButton from "./GenerateProjectsButton";

export default function PORForm({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const form = useForm<PORValues>({
        resolver: zodResolver(porSchema),
        defaultValues: {
            POR: resumeData.POR || [],
        },
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return;
            setResumeData({
                ...resumeData,
                POR:
                    values.POR?.filter((por) => por !== undefined).map((por) => ({
                        ...por,
                        description: por.description?.filter((desc) => desc !== undefined) || [],
                    })) || [],
            });
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "POR",
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
                <h2 className="text-2xl font-semibold">POR</h2>
                <p className="text-sm text-muted-foreground">
                    Add as many PORs as you like.
                </p>
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
                                <PORItem
                                    id={field.id}
                                    key={field.id}
                                    index={index}
                                    form={form}
                                    remove={remove}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            onClick={() =>
                                append({
                                    position: "",
                                    startDate: "",
                                    endDate: "",
                                    description: [],
                                })
                            }
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="size-5" /> Add POR
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

interface PORItemProps {
    id: string;
    form: UseFormReturn<PORValues>;
    index: number;
    remove: (index: number) => void;
}

function PORItem({
    id,
    form,
    index,
    remove,
}: PORItemProps) {
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
                <span className="font-semibold">POR {index + 1}</span>
                <GripHorizontal
                    className="size-5 cursor-grab text-muted-foreground focus:outline-none"
                    {...attributes}
                    {...listeners}
                />
            </div>
            <div className="flex justify-center">
                <GeneratePORButton
                    onPORGenerated={(por) =>
                        form.setValue(`POR.${index}`, por)
                    }
                />
            </div>
            <FormField
                control={form.control}
                name={`POR.${index}.position`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                            <Input {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`POR.${index}.organization`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Organization</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`POR.${index}.description`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <BulletTextarea
                                value={field.value || []} // Ensure it's an array
                                onChange={(newValue) => form.setValue(`POR.${index}.description`, newValue)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name={`POR.${index}.startDate`}
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
                    name={`POR.${index}.endDate`}
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
