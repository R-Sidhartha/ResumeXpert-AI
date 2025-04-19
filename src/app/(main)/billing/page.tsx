import React from "react";
import { PlanInfo } from "./PlanInfo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
    return (
        <div className="w-full px-4 sm:px-6 md:px-0 max-w-4xl mx-auto mt-12 space-y-6">
            <PlanInfo />
            <div className="text-center">
                <Button asChild className="mt-4 px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 dark:bg-zinc-900 dark:text-white dark:border-white border dark:hover:bg-zinc-700">
                    <Link href="/resume-templates">Continue to Create Resumes</Link>
                </Button>
            </div>
        </div>
    );
};

export default Page;
