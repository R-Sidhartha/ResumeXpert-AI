import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { steps } from "./steps";

interface BreadcrumbsProps {
    currentStep: string;
    setCurrentStep: (step: string) => void;
    allowedFields: string[];
}

export default function Breadcrumbs({
    currentStep,
    setCurrentStep,
    allowedFields
}: BreadcrumbsProps) {
    const filteredSteps = steps.filter((step) => allowedFields.includes(step.key));
    return (
        <div className="flex justify-center">
            <Breadcrumb>
                <BreadcrumbList>
                    {filteredSteps.map((step) => (
                        <React.Fragment key={step.key}>
                            <BreadcrumbItem>
                                {step.key === currentStep ? (
                                    <BreadcrumbPage>{step.title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <button onClick={() => setCurrentStep(step.key)}>
                                            {step.title}
                                        </button>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="last:hidden" />
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
