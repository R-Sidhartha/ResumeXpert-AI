"use client"
import { SignUp } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            localStorage.setItem('referralCode', ref);
        }
    }, [searchParams]);

    return (
        <main className="flex h-screen items-center justify-center p-3">
            <SignUp />
        </main>
    );
}