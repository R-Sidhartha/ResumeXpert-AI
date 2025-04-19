import { Metadata } from "next";
import CreateResumeButton from "./CreateResumeButton";
import { getUserResumes } from "./action";
import ResumeItem from "../ResumeItem";
import Link from "next/link";

export const metadata: Metadata = {
    title: "My Resumes",
};

export default async function Page() {

    const userResumes = await getUserResumes();
    if (!userResumes) {
        console.error("No resumes found for user");
    }

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
            <div className="space-y-1 flex justify-between w-full mt-5">
                <div>
                    <h1 className="text-xl sm:text-3xl font-bold">Your resumes</h1>
                    {userResumes && userResumes.resumes.length > 0 &&
                        <p>Total: {userResumes.count}</p>}
                </div>
                <CreateResumeButton
                    currentResumeCount={(userResumes?.count || 0)}
                />
            </div>
            {userResumes && userResumes.resumes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {userResumes.resumes.map((resume) => (
                        <ResumeItem key={resume.id} userResume={resume} context="userResumes" userResumeCount={userResumes.count || 0} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 min-h-[50vh]">
                    {/* Icon */}
                    <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M6 3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V8.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0016.586 3H6zm5 6a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H7a1 1 0 110-2h4v-4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>

                    {/* Message */}
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                        No resumes found
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        You haven&apos;t created any resumes yet.
                    </p>

                    {/* Create Resume Link */}
                    <Link href="/resume-templates" className="mt-4 inline-flex items-center text-sm font-medium text-green-600 hover:underline">
                        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create a Resume
                    </Link>
                </div>
            )}
        </main>
    );
}
