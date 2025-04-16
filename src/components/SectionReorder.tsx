"use client";

import {
    DndContext,
    closestCenter,
    useDraggable,
    useDroppable,
    DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultOrder = [
    "experience",
    "education",
    "projects",
    "certifications",
    "skills",
    "por",
    "achievements",
    "extracurriculars",
    "customsections"
];

const prettyLabels: Record<string, string> = {
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    certifications: "Certifications",
    por: "Positions of Responsibility",
    achievements: "Achievements",
    extracurriculars: "Extracurriculars",
    customsections: "Custom Sections"
};

function DraggableItem({ id }: { id: string; index: number }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    });

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : "auto",
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className={cn(
                "flex items-center justify-between px-4 py-2 rounded-md bg-white dark:bg-zinc-900 border hover:bg-muted shadow-sm cursor-grab transition-all",
                isDragging && "ring-2 ring-primary"
            )}
        >
            <span className="text-sm font-medium text-muted-foreground">
                {prettyLabels[id]}
            </span>
            <GripVertical className="w-4 h-4 text-zinc-400" />
        </div>
    );
}

function DroppableWrapper({ id, children }: { id: string; children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({ id });
    return <div ref={setNodeRef}>{children}</div>;
}

export function SectionReorder({
    onChange,
    defaultValue = defaultOrder,
}: {
    onChange: (newOrder: string[]) => void;
    defaultValue?: string[];
}) {
    const [items, setItems] = useState<string[]>(defaultValue);

    useEffect(() => {
        setItems(defaultValue);
        console.log(defaultValue)
    }, [defaultValue]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id && over?.id) {
            const oldIndex = items.indexOf(active.id as string);
            const newIndex = items.indexOf(over.id as string);
            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            onChange(newItems);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h3 className="text-sm font-semibold mb-3 text-zinc-700 dark:text-white">
                Reorder Resume Sections
            </h3>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-2">
                    {items.map((id, index) => (
                        <DroppableWrapper key={id} id={id}>
                            <DraggableItem id={id} index={index} />
                        </DroppableWrapper>
                    ))}
                </div>
            </DndContext>
        </div>
    );
}
