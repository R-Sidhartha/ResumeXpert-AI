"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { LockIcon, MoreVertical, Trash2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResumeServerData } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deleteResume } from "./my-resumes/action";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import { ThumbnailImage } from "@/components/ThumbnailImage";
import { useRequirePremium } from "@/lib/requirePremium";
import { useSubscriptionLevel } from "./SubscriptionLevelProviderWrapper";

interface ResumeTemplate {
    id: string;
    name: string | null;
    template: string;
    description: string | null;
    subscriptionLevel: string;
    thumbnailUrl: string;
}

type PlanType = keyof typeof planRank;
interface ResumeItemProps {
    template?: ResumeTemplate;
    userResume?: ResumeServerData;
    context: "templates" | "userResumes";
    userResumeCount: number;
}

const planRank = {
    free: 0,
    pro: 1,
    elite: 2,
};

const planLimits = {
    free: 3,
    pro: 10,
    elite: Infinity,
};


export default function ResumeItem({ userResume, context, template, userResumeCount }: ResumeItemProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const requirePremium = useRequirePremium();

    const userPlan = useSubscriptionLevel()

    const maxAllowed = planLimits[userPlan] ?? 0;
    const canCreate = userResumeCount < maxAllowed;

    const isLocked = planRank[userPlan as PlanType] < planRank[template?.subscriptionLevel as PlanType];

    const href =
        context === "userResumes"
            ? `/editor?resumeId=${userResume?.id}` // Editing an existing resume
            : `/editor?templateId=${template?.id}`; // Creating a new resume

    // Determine the thumbnail image dynamically
    const thumbnailUrl = userResume?.resumeTemplate?.thumbnailUrl || template?.thumbnailUrl;

    // Determine whether to show Created At or Updated At
    const createdAt = userResume?.createdAt ? new Date(userResume.createdAt).toLocaleDateString() : null;
    const updatedAt = userResume?.updatedAt ? new Date(userResume.updatedAt).toLocaleDateString() : null;
    const isUpdated = createdAt !== updatedAt;

    const handleTemplateClick = () => {
        if (isLocked) {
            requirePremium({
                feature: "Premium Templates",
                description:
                    "This template is not available in the Free plan. Please upgrade to Pro or Elite to access premium templates.",
            });
        } else if (!canCreate) {
            requirePremium({
                feature: "Resume Creation Limit Reached",
                description:
                    userPlan === "free"
                        ? "Free plan allows only 3 resumes. Upgrade to Pro or Elite to create more."
                        : "Pro plan allows only 10 resumes. Upgrade to Elite for unlimited resume creation.",
            });
        }
    };


    return (
        <>
            <Card className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl px-4 py-3 bg-zinc-100 dark:bg-zinc-800 transition-all duration-300 ease-in-out">
                <CardHeader>
                    {isLocked && (
                        <div className="absolute top-2 right-2 z-10">
                            <LockIcon className="text-white w-5 h-5 bg-yellow-500 p-1 rounded-full" />
                        </div>
                    )}
                    <CardTitle className="capitalize">{context === "userResumes" ? userResume?.title || "Untitled Resume" : template?.name || "No Title"}</CardTitle>
                    <CardDescription className="flex flex-col gap-1">
                        {context === "userResumes" ? userResume?.description || "Crafted with precision to showcase your best self." : template?.description || "Professionally designed to help you stand out with clarity and confidence."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative p-0 overflow-hidden h-60 sm:h-80 rounded-sm">
                    {context === "userResumes" && (
                        <span className="text-xs text-zinc-800 dark:text-zinc-300">{isUpdated ? `Updated at: ${updatedAt}` : `Created at: ${createdAt}`}</span>
                    )}
                    {thumbnailUrl && (
                        context === "userResumes" ? (
                            <Link href={href}>
                                <ThumbnailImage
                                    resumeId={userResume?.id || ""}
                                    fallbackUrl={thumbnailUrl}
                                    altText={userResume?.title || "User Resume Thumbnail"}
                                />
                            </Link>
                        ) : isLocked || !canCreate ? (
                            <div onClick={handleTemplateClick} className=" opacity-70" role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && handleTemplateClick()}>
                                <Image
                                    src={thumbnailUrl}
                                    width={800}
                                    height={200}
                                    alt={template?.name || "Locked Template"}
                                    className="w-full border border-gray-300"
                                />
                            </div>
                        ) : (
                            <Link href={href}>
                                <Image
                                    src={thumbnailUrl}
                                    width={800}
                                    height={200}
                                    alt={template?.name || "Template"}
                                    className="w-full cursor-pointer border border-gray-300"
                                />
                            </Link>
                        )
                    )}
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2 p-4">
                    {context == "templates" &&
                        <Button variant="outline" onClick={() => setSelectedImage(thumbnailUrl || '')}>
                            Preview
                        </Button>}
                </CardFooter>
                {context == "userResumes" &&
                    <MoreMenu resumeId={userResume?.id || ''}
                    // onPrintClick={reactToPrintFn} 
                    />
                }
            </Card>

            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-auto">
                    <div className="absolute top-0 p-8">
                        <Image
                            src={selectedImage}
                            width={600}
                            height={600}
                            alt="Preview"
                            className="mx-auto rounded-lg shadow-lg"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:opacity-70"
                        >
                            <X className="w-6 h-6 text-black" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

interface MoreMenuProps {
    resumeId: string;
    // onPrintClick: () => void;
}

function MoreMenu({ resumeId,
    // onPrintClick 
}: MoreMenuProps) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0.5 top-0.5 opacity-30 transition-opacity group-hover:opacity-100 dark:hover:text-zinc-300"
                    >
                        <MoreVertical className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        className="flex items-center gap-2 text-red-500 hover:text-red-800"
                        onClick={() => setShowDeleteConfirmation(true)}
                    >
                        <Trash2 className="size-4" />
                        Delete
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={onPrintClick}
                    >
                        <Printer className="size-4" />
                        Print
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteConfirmationDialog
                resumeId={resumeId}
                open={showDeleteConfirmation}
                onOpenChange={setShowDeleteConfirmation}
            />
        </>
    );
}

interface DeleteConfirmationDialogProps {
    resumeId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog({
    resumeId,
    open,
    onOpenChange,
}: DeleteConfirmationDialogProps) {

    const [isPending, startTransition] = useTransition();

    async function handleDelete() {
        startTransition(async () => {
            try {
                await deleteResume(resumeId);
                onOpenChange(false);
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong. Please try again.");
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete resume?</DialogTitle>
                    <DialogDescription>
                        This will permanently delete this resume. This action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <LoadingButton
                        variant="destructive"
                        onClick={handleDelete}
                        loading={isPending}
                    >
                        Delete
                    </LoadingButton>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
