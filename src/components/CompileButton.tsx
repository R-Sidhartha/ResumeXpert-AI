"use client";

import { Button } from "./ui/button";

// import { useEffect, useRef } from "react";

interface CompileButtonProps {
    onClick: () => void;
    loading: boolean;
    isSaving: boolean;
}

export default function CompileButton({ onClick, loading, isSaving }: CompileButtonProps) {
    // const hasMounted = useRef(false);
    // useEffect(() => {
    //     // Only trigger onClick once on the first mount
    //     if (!hasMounted.current && !loading && engineReady) {
    //         setTimeout(() => {
    //             onClick();
    //             hasMounted.current = true;
    //         }, 2000);
    //     }
    // }, [onClick, loading, engineReady]);
    return (
        <Button
            onClick={onClick}
            // className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg"
            variant={"default"}
            disabled={loading || isSaving}
        >
            {loading || isSaving ? "Compiling..." : "Save & Preview"}
        </Button>
    );
}
