"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { setUserData } from "./action";
import { z } from "zod";

const onboardingSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    github: z.string().url("GitHub must be a valid URL").optional(),
    linkedIn: z.string().url("LinkedIn must be a valid URL").optional(),
});

export default function Onboarding() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [github, setGithub] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { isSignedIn } = useAuth();

    useEffect(() => {
        if (!isSignedIn) {
            router.push("/sign-in");
        }
    }, [isSignedIn, router]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const result = onboardingSchema.safeParse({
            firstName,
            lastName,
            github,
            linkedIn,
        });

        if (!result.success) {
            setError(result.error.errors[0].message);
            setLoading(false);
            return;
        }

        try {
            await setUserData(result.data);
            router.push("/resume-templates");
        } catch (error) {
            console.error("Error saving user data:", error);
            setError("Something went wrong while saving.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-center">Complete Your Profile</h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Input
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Input
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3 italic">
                This information will be permanently associated with your resumes and cannot be modified later.
            </p>
            <div className="flex flex-col gap-2">
                <Input
                    placeholder="GitHub URL"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Your GitHub profile link</p>
            </div>

            <div className="flex flex-col gap-2">
                <Input
                    placeholder="LinkedIn URL"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Your LinkedIn profile link</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading ? "Saving..." : "Save and Continue"}
            </Button>
        </div>
    );
}
