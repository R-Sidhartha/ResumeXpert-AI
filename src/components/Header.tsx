"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

const Header = () => {
    const { theme } = useTheme();

    const { isSignedIn } = useUser(); // Check if user is signed in

    return (
        <header className="w-full flex items-center justify-between px-3 md:px-10 py-3 pb-6">
            {/* Logo */}
            <Link href="/" className="text-lg md:text-2xl font-bold">
                ResumeXpert AI
            </Link>

            {/* Navigation Links */}
            <nav className="space-x-3 md:space-x-6 flex items-center">
                <Link href="/subscriptions" className="hover:opacity-65">Pricing</Link>
                <Link href="/resume-templates" className="hover:opacity-65">Templates</Link>

                {/* Show UserButton when signed in, otherwise show Sign In button */}
                {isSignedIn ? (
                    <UserButton appearance={{
                        baseTheme: theme === "dark" ? dark : undefined,
                        elements: {
                            avatarBox: {
                                width: 35,
                                height: 35,
                            },
                        },
                    }} />
                ) : (
                    <SignInButton>
                        <Button variant="outline">Sign In</Button>
                    </SignInButton>
                )}
            </nav>
        </header>
    );
};

export default Header;
