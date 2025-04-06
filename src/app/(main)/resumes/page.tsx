import { Metadata } from 'next';
import React from 'react'
import ResumeItem from '../ResumeItem';
import { getResumeTemplates } from './action';

export const metadata: Metadata = {
    title: "Resume Templates",
};


const Page = async () => {
    const templates = await getResumeTemplates()
    if (!templates) {
        console.error("No templates found");
    }
    return (
        <main className='max-w-7xl mx-auto mb-8 mt-10 flex flex-col gap-4'>
            <section>
                <h1 className='text-3xl font-bold'>Resume Templates</h1>
                <p className='text-gray-500 dark:text-zinc-400'>Personalize Your Resume in Minutes – Choose a Template Now!</p>
                <div className="py-8 w-full">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {templates.map((template) => (
                            <ResumeItem key={template.id} template={template} context='templates' />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Page
