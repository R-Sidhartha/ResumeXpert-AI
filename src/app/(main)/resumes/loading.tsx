import React from 'react'

const Loading = () => {
    return (
        <div className="max-w-7xl w-full mx-auto mb-8 mt-10 flex flex-col gap-4">
            <div className='flex flex-col gap-2'>
                <div className="h-10 w-2/3 bg-gray-300 rounded animate-pulse mb-2 mx-auto"></div>
                <div className="h-5 w-1/2 bg-gray-300 rounded animate-pulse mx-auto"></div>
            </div>
            <div className='w-full my-5 text-center flex flex-col gap-2 items-center justify-center'>
                <span className='w-16 h-5 bg-gray-200 animate-pulse rounded-lg'></span>
                <h2 className='w-36 h-8 bg-gray-200 animate-pulse rounded-lg'></h2>
                <h4 className='w-1/3 h-5 bg-gray-200 animate-pulse rounded-lg'></h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                <div className="rounded-2xl border border-gray-200 p-4 shadow-sm w-full max-w-sm animate-pulse">
                    <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-36 bg-gray-300 rounded mb-1"></div>

                    <div className="w-full h-72 bg-gray-200 rounded-md mt-3"></div>
                    <div className="mt-3 mx-auto w-24 h-8 bg-gray-200 rounded-md"></div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4 shadow-sm w-full max-w-sm animate-pulse">
                    <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-36 bg-gray-300 rounded mb-1"></div>

                    <div className="w-full h-72 bg-gray-200 rounded-md mt-3"></div>
                    <div className="mt-3 mx-auto w-24 h-8 bg-gray-200 rounded-md"></div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4 shadow-sm w-full max-w-sm animate-pulse">
                    <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-36 bg-gray-300 rounded mb-1"></div>

                    <div className="w-full h-72 bg-gray-200 rounded-md mt-3"></div>
                    <div className="mt-3 mx-auto w-24 h-8 bg-gray-200 rounded-md"></div>
                </div>
            </div>
        </div>
    );
}

export default Loading
