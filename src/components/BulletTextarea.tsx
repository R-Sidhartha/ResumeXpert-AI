import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface BulletTextareaProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
}

const BulletTextarea = ({ value, onChange, placeholder }: BulletTextareaProps) => {
    const [text, setText] = useState(
        value.length ? value.map((line) => `• ${line}`).join("\n") : ""
    );

    // 🔁 Sync when value changes from outside (e.g., AI-generated)
    useEffect(() => {
        const formatted = value.length ? value.map((line) => `• ${line}`).join("\n") : "";
        setText(formatted);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedText = e.target.value;

        const formattedLines = updatedText
            .split("\n")
            .map((line) =>
                line.trim() === "" ? "" : line.startsWith("•") ? line : `• ${line.trim()}`
            );

        const bulletArray = formattedLines
            .map((line) => line.replace(/^•\s*/, ""))
            .filter((line) => line.length > 0);

        setText(formattedLines.join("\n"));
        onChange(bulletArray);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const cursorPosition = (e.target as HTMLTextAreaElement).selectionStart;

        if (e.key === "Enter") {
            e.preventDefault();
            setText((prev) => prev + "\n• ");
        } else if (e.key === "Backspace") {
            const lines = text.split("\n");
            const currentLineIndex = text.substring(0, cursorPosition).split("\n").length - 1;
            const currentLine = lines[currentLineIndex];

            if (currentLine.trim() === "•") {
                e.preventDefault();
                lines.splice(currentLineIndex, 1);
                const newText = lines.join("\n");
                setText(newText);
                onChange(lines.map((line) => line.replace(/^•\s*/, "")));
            }
        }
    };

    return (
        <Textarea
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Enter in bullet points..."}
            rows={5}
            className="w-full border p-2 rounded"
        />
    );
};

export default BulletTextarea;
