import { Metadata } from 'next';
import React from 'react';
import ResumeItem from '../ResumeItem';
import { getResumeTemplates } from './action';
import { cn } from '@/lib/utils'; // optional if you use class merging helper

export const metadata: Metadata = {
    title: 'Resume Templates',
};

const Page = async () => {
    const templates = await getResumeTemplates();

    const freeTemplates = templates.filter((t) => t.subscriptionLevel === 'free');
    const proTemplates = templates.filter((t) => t.subscriptionLevel === 'pro');
    const eliteTemplates = templates.filter((t) => t.subscriptionLevel === 'elite');

    const TierSection = ({
        title,
        description,
        templates,
        badgeColor,
        gradient,
        glass,
    }: {
        title: string;
        description: string;
        templates: typeof freeTemplates;
        badgeColor: string; // e.g., 'green', 'blue', 'rose'
        gradient: string;
        glass?: boolean;
    }) => (
        <section className="w-full mb-20 px-4 sm:px-6 lg:px-0">
            <div className="text-center mb-10">
                {/* Minimal Badge */}
                <span
                    className={cn(
                        'inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide border mb-2',
                        `text-${badgeColor}-600 border-${badgeColor}-200 dark:text-${badgeColor}-400 dark:border-${badgeColor}-400/30 bg-${badgeColor}-50 dark:bg-transparent`
                    )}
                >
                    {title.toUpperCase()}
                </span>

                {/* Gradient Title */}
                <h2
                    className={`text-2xl sm:text-3xl font-bold text-transparent bg-clip-text ${gradient}`}
                >
                    {title} Templates
                </h2>

                <p className="mt-2 text-base text-muted-foreground max-w-xl mx-auto">
                    {description}
                </p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className={cn(
                            'transition-all duration-300 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl',
                            glass
                                ? 'backdrop-blur-xl bg-white/30 dark:bg-zinc-800/30 border border-white/20'
                                : 'bg-white dark:bg-zinc-900'
                        )}
                    >
                        <div className="w-full">
                            {/* Make preview large and prominent */}
                            <ResumeItem template={template} context="templates" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

    return (
        <main className="max-w-7xl mx-auto w-full px-6 mt-12 mb-24 flex flex-col gap-12">
            {/* HEADER */}
            <header className="">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-800 text-center">
                    Professional Resume Templates That Get You Hired
                </h1>
                <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-zinc-400 text-center ">
                    Designed to impress recruiters, optimized for ATS, and customizable to fit your personal brand.
                </p>
            </header>

            {/* FREE SECTION */}
            <TierSection
                title="Free"
                description="Clean and professional templates to get started. Always free."
                templates={freeTemplates}
                badgeColor="green"
                gradient="bg-gradient-to-r from-emerald-400 to-lime-500"
            />

            {/* PRO SECTION */}
            <TierSection
                title="Pro"
                description="For professionals who want elevated designs and layout control."
                templates={proTemplates}
                badgeColor="blue"
                gradient="bg-gradient-to-r from-sky-400 to-indigo-500"
            // glass
            />

            {/* ELITE SECTION */}
            <TierSection
                title="Elite"
                description="Modern, bold, and sophisticated templates built to turn heads."
                templates={eliteTemplates}
                badgeColor="rose"
                gradient="bg-gradient-to-r from-rose-400 to-pink-500"
            // glass
            />
        </main>
    );
};

export default Page;
