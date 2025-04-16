import React from 'react'

const Loading = () => {
    return (
        <div className="mx-auto w-full max-w-7xl my-8 space-y-6 px-3 py-6">
            <div className="flex justify-between mb-6">
                <div>
                    <div className="h-10 w-40 bg-gray-300 rounded animate-pulse mb-2"></div>
                    <div className="h-5 w-28 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-32 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-2xl border border-gray-200 p-4 shadow-sm w-full max-w-sm animate-pulse">
                    <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-36 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 w-28 bg-gray-300 rounded mb-4"></div>

                    <div className="w-full h-72 bg-gray-200 rounded-md"></div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4 shadow-sm w-full max-w-sm animate-pulse">
                    <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-36 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 w-28 bg-gray-300 rounded mb-4"></div>

                    <div className="w-full h-72 bg-gray-200 rounded-md"></div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4 shadow-sm w-full max-w-sm animate-pulse">
                    <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-36 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 w-28 bg-gray-300 rounded mb-4"></div>

                    <div className="w-full h-72 bg-gray-200 rounded-md"></div>
                </div>
            </div>
        </div>
    );
}

export default Loading
