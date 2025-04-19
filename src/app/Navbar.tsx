"use client";

import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import { UserButton, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import clsx from "clsx";
import {
    CreditCard,
    FileText,
    LayoutTemplate,
    ListOrdered,
    Menu,
    LogIn,
    Gift,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
    const { isSignedIn } = useAuth();
    const { theme } = useTheme();
    const pathname = usePathname();

    return (
        <header className="shadow-sm">
            <div className="mx-auto flex w-full lg:max-w-7xl items-center justify-between gap-3 p-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src={logo} alt="Logo" width={100} />
                    {/* <span className="text-base md:text-xl font-semibold md:font-bold tracking-tight">
                        ResumeXpert AI
                    </span> */}
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-3">
                    <NavLink
                        href="/resume-templates"
                        label="Templates"
                        icon={<LayoutTemplate className="w-4 h-4 mr-1" />}
                        pathname={pathname}
                    />
                    {isSignedIn && (
                        <>
                            <NavLink
                                href="/my-resumes"
                                label="MyResumes"
                                icon={<FileText className="w-4 h-4 mr-1" />}
                                pathname={pathname}
                            />
                            <NavLink
                                href="/referral"
                                label="Refer & Earn"
                                icon={<Gift className="w-4 h-4 mr-1" />}
                                pathname={pathname}
                            />
                        </>
                    )}
                    <NavLink
                        href="/subscriptions"
                        label="Pricing"
                        icon={<ListOrdered className="w-4 h-4 mr-1" />}
                        pathname={pathname}
                    />
                    <ThemeToggle />

                    {isSignedIn ? (
                        <UserButton
                            appearance={{
                                baseTheme: theme === "dark" ? dark : undefined,
                                elements: {
                                    avatarBox: { width: 35, height: 35 },
                                },
                            }}
                        >
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="Billing"
                                    labelIcon={<CreditCard className="size-4" />}
                                    href="/billing"
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    ) : (
                        // <SignInButton>
                        <Button variant={"default"} className="px-4 py-2 bg-green-600 text-white shadow hover:bg-green-700 transition-all" asChild>
                            <Link href={"/sign-in"}>
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </Link>
                        </Button>
                        // </SignInButton>
                    )}
                </div>

                {/* Mobile Sheet Navigation */}
                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger>
                            <Menu className="w-6 h-6" />
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                            <SheetTitle className="hidden">Are you absolutely sure?</SheetTitle>
                            <div className="flex flex-col gap-4 mt-6">
                                <div>
                                    {isSignedIn ? (
                                        <UserButton
                                            appearance={{
                                                baseTheme: theme === "dark" ? dark : undefined,
                                                elements: { avatarBox: { width: 35, height: 35 } },
                                            }}
                                        />
                                    ) : (
                                        <Button variant={"default"} className="px-4 py-2 bg-green-600 text-white shadow hover:bg-green-700 transition-all" asChild>
                                            <Link href={"/sign-in"}>
                                                <LogIn className="w-4 h-4" />
                                                Sign In
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                                <MobileNavLink
                                    href="/resume-templates"
                                    label="Templates"
                                    icon={<LayoutTemplate className="w-4 h-4" />}
                                />
                                {isSignedIn && (
                                    <MobileNavLink
                                        href="/my-resumes"
                                        label="MyResumes"
                                        icon={<FileText className="w-4 h-4" />}
                                    />
                                )}
                                {isSignedIn && (
                                    <MobileNavLink
                                        href="/referral"
                                        label="Refer & Earn"
                                        icon={<Gift className="w-4 h-4" />}
                                    />
                                )}
                                <MobileNavLink
                                    href="/subscriptions"
                                    label="Pricing"
                                    icon={<ListOrdered className="w-4 h-4" />}
                                />
                                {isSignedIn && (
                                    <MobileNavLink
                                        href="/billing"
                                        label="Billing"
                                        icon={<CreditCard className="w-4 h-4" />}
                                    />
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

function NavLink({
    href,
    label,
    icon,
    pathname,
}: {
    href: string;
    label: string;
    icon?: React.ReactNode;
    pathname: string;
}) {
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={clsx(
                "relative flex items-center gap-1 text-sm md:text-base font-medium transition-all duration-200 px-3 py-2 rounded-md",
                isActive
                    ? "text-green-700 font-bold dark:text-green-700"
                    : "text-gray-600 hover:text-green-700 dark:text-gray-300 dark:hover:text-green-700"
            )}
        >
            {icon}
            {label}
            {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-700 dark:bg-green-700 rounded-full"></span>
            )}
        </Link>
    );
}

function MobileNavLink({
    href,
    label,
    icon,
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-green-700 transition"
        >
            {icon}
            {label}
        </Link>
    );
}
