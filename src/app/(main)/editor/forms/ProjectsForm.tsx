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
import { projectsSchema, ProjectValues } from "@/lib/validation";
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
import GenerateProjectsButton from "./GenerateProjectsButton";
import BulletTextarea from "@/components/BulletTextarea";

export default function ProjectsForm({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const form = useForm<ProjectValues>({
        resolver: zodResolver(projectsSchema),
        defaultValues: {
            Projects: resumeData.Projects || [],
        },
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if (!isValid) return;
            setResumeData({
                ...resumeData,
                Projects: values.Projects
                    ?.filter((pro) => pro !== undefined)
                    .map((pro) => ({
                        ...pro,
                        description: pro.description?.filter((desc) => desc !== undefined) || [],
                    })) || [],
            });
        });
        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "Projects",
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
                <h2 className="text-2xl font-semibold">Projects</h2>
                <p className="text-sm text-muted-foreground">
                    Add as many Projects as you like.
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
                                <ProjectItem
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
                                    title: "",
                                    link: "",
                                    gitLink: "",
                                    startDate: "",
                                    endDate: "",
                                    description: [],
                                })
                            }
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="size-5" /> Add Projects
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

interface ProjectItemProps {
    id: string;
    form: UseFormReturn<ProjectValues>;
    index: number;
    remove: (index: number) => void;
}

function ProjectItem({
    id,
    form,
    index,
    remove,
}: ProjectItemProps) {
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
                <span className="font-semibold">Project {index + 1}</span>
                <GripHorizontal
                    className="size-5 cursor-grab text-muted-foreground focus:outline-none"
                    {...attributes}
                    {...listeners}
                />
            </div>
            <div className="flex justify-center">
                <GenerateProjectsButton
                    onProjectsGenerated={(projects) =>
                        form.setValue(`Projects.${index}`, projects)
                    }
                />
            </div>
            <FormField
                control={form.control}
                name={`Projects.${index}.title`}
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
            <FormField
                control={form.control}
                name={`Projects.${index}.description`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <BulletTextarea
                                value={field.value || []} // Ensure it's an array
                                onChange={(newValue) => form.setValue(`Projects.${index}.description`, newValue)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`Projects.${index}.link`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Live Link</FormLabel>
                        <FormControl>
                            <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`Projects.${index}.gitLink`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Github Link</FormLabel>
                        <FormControl>
                            <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name={`Projects.${index}.startDate`}
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
                    name={`Projects.${index}.endDate`}
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
