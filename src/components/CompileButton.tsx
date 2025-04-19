"use client";

import { Button } from "./ui/button";
interface CompileButtonProps {
    onClick: () => void;
    loading: boolean;
    isSaving: boolean;
}

export default function CompileButton({ onClick, loading, isSaving }: CompileButtonProps) {

    return (
        <Button
            onClick={onClick}
            variant={"default"}
            disabled={loading || isSaving}
        >
            {loading ? "Compiling..." : "Compile & Preview"}
        </Button>
    );
}
