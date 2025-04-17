// import prisma from "@/lib/prisma";
// import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import { fetchResumeTemplate, getCustomizations, getUserData } from "./action";
import { prisma } from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
// import ResumeEditor from "./ResumeEditor";

interface PageProps {
    searchParams: Promise<{ resumeId?: string, templateId: string }>;
    // params: Promise<{ templateId: string }>;
}

export const metadata: Metadata = {
    title: "Design your resume",
};


export default async function Page({ searchParams }: PageProps) {
    const { resumeId, templateId } = await searchParams;


    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    // const templateData = await fetchResumeTemplate(templateId) || {
    //     template: '',
    //     name: '',
    //     id: ''
    // };

    // const userData = await getUserData(userId); // ✅ Fetch user data
    // if (!userData) return null;


    // const resumeToEdit = resumeId
    //     ? await prisma.resume.findUnique({
    //         where: { id: resumeId, userId },
    //         include: resumeDataInclude,
    //     })
    //     : null;

    // Fetch user data & resume data & template in parallel
    const [userData, resumeToEdit] = await Promise.all([
        getUserData(userId),
        resumeId
            ? prisma.resume.findUnique({
                where: { id: resumeId, userId },
                include: resumeDataInclude,
            })
            : Promise.resolve(null),
    ]);

    // const templateData = templateId
    //     ? await fetchResumeTemplate(templateId) || { template: "", name: "", id: "" }
    //     : resumeToEdit?.resumeTemplate ?? { template: "", name: "", id: "" };

    // const customizations = resumeId
    //     ? await getCustomizations(resumeId)
    //     : null;

    // fetch customization & template in parallel
    const [customizations, fetchedTemplate] = await Promise.all([
        resumeId ? getCustomizations(resumeId) : Promise.resolve(null),
        templateId ? fetchResumeTemplate(templateId) : Promise.resolve(null),
    ]);

    const templateData =
        fetchedTemplate ??
        resumeToEdit?.resumeTemplate ?? {
            template: "",
            name: "",
            id: "",
        };

    const customization = customizations
        ? {
            bulletIcon: customizations.bulletIcon ?? undefined,
            margin: customizations.margin ?? undefined,
            fontSize: customizations.fontSize ?? undefined,
            lineSpacing: customizations.lineSpacing ?? undefined,
            sectionSpacing: customizations.sectionSpacing ?? undefined,
            itemSpacing: customizations.itemSpacing ?? undefined,
            color: customizations.color ?? undefined,
            sectionOrder: customizations.sectionOrder ?? undefined,
            sectionTitles: typeof customizations.sectionTitles === "object" && customizations.sectionTitles !== null
                ? customizations.sectionTitles as Record<string, string>
                : undefined,
            resumeId: customizations.resumeId ?? undefined,
        }
        : null;

    return <ResumeEditor
        resumeToEdit={resumeToEdit}
        // templateId={templateId}
        templateData={templateData}
        customizations={customization ?? null}
        userData={{
            firstName: userData?.firstName || "",
            lastName: userData?.lastName || "",
            github: userData?.github || "",
            linkedIn: userData?.linkedIn || "",
        }}
    />;

    // return (
    //     <div>
    //         Resume Editor
    //     </div>
    // )
}
