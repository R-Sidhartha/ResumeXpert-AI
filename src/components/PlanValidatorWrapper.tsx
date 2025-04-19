// src/components/PlanValidatorWrapper.tsx
"use client"
import { useEffect } from "react";
import { usePlanValidator } from "@/hooks/usePlanValidator";

const PlanValidatorWrapper = ({ children }: { children: React.ReactNode }) => {
    const { wasDowngraded } = usePlanValidator(); // Hook to check plan status

    useEffect(() => {
        if (wasDowngraded) {
            console.log("User's plan was downgraded!");
        }
    }, [wasDowngraded]);

    return <>{children}</>;
};

export default PlanValidatorWrapper;
