'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Trash2 } from 'lucide-react';

import {
    Form,
} from '@/components/ui/form';
import { extractPdfText } from '@/lib/extractors';
import { generateFormattedResume } from '@/app/(main)/editor/forms/action';
import { EditorFormProps } from '@/lib/types';
import { mergeAIContentIntoResumeData } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const uploadSchema = z.object({
    extractedText: z.string().min(1, 'Text must be extracted from file before generating resume.'),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export default function FileUploadForm({ resumeData, setResumeData }: EditorFormProps) {
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const form = useForm<UploadFormValues>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            extractedText: '',
        },
    });

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file || uploadedFile) return;

        setLoading(true);
        try {
            let text = '';
            if (file.type === 'application/pdf') {
                text = await extractPdfText(file);
            } else {
                toast.error('Only PDF files are supported currently.');
                return;
            }

            form.setValue('extractedText', text);
            setUploadedFile(file);
            toast.success('Text extracted successfully!');
        } catch (error) {
            console.error('Error extracting file:', error);
            toast.error('Failed to extract file content');
        } finally {
            setLoading(false);
        }
    }, [form, uploadedFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
        disabled: Boolean(uploadedFile), // 🚫 prevent more drops
    });

    const handleGenerateAI = async () => {
        const isValid = await form.trigger();
        if (!isValid) return;

        const extractedText = form.getValues('extractedText');

        setAiLoading(true);
        try {
            const formattedResume = await generateFormattedResume({ extractedText });
            if (formattedResume) {
                const mergedData = mergeAIContentIntoResumeData(resumeData, formattedResume);
                setResumeData(mergedData);
                toast.success('AI Resume content merged successfully!');
                setAiLoading(false)
            }
        } catch (error) {
            console.error('AI Resume Generation Failed:', error);
            toast.error('Something went wrong while generating resume.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setLoading(false);
        form.reset();
        toast.info('File removed.');
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Upload Resume</h2>
                <p className="text-sm text-muted-foreground">Drop your old resume PDF and get an AI-generated boost</p>
            </div>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-8 rounded-xl text-center transition-all cursor-pointer
                    ${uploadedFile ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-300 hover:border-blue-500'}
                `}
            >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-500">
                    {uploadedFile
                        ? 'A file is already uploaded'
                        : isDragActive
                            ? 'Drop the file here...'
                            : 'Drag & drop a PDF file here, or click to select'}
                </p>
            </div>

            {loading && (
                <p className="text-blue-600 text-center">Extracting text...</p>
            )}

            {uploadedFile && (
                <div className="flex items-center justify-between border rounded-md px-4 py-2 bg-white shadow-sm">
                    <p className="text-sm font-medium text-gray-700 truncate">
                        {uploadedFile.name}
                    </p>
                    <button
                        onClick={handleRemoveFile}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Remove file"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            )}

            <Form {...form}>
                <form className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleGenerateAI}
                            disabled={aiLoading || !uploadedFile}
                        >
                            {aiLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {aiLoading ? 'Please wait...' : 'Auto Fill'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
