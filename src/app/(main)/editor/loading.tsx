import React from 'react'

const Loading = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center rounded-xl animate-pulse mt-10">
            <div className="w-3/4 h-[80%] rounded-lg flex flex-col items-center justify-center">
                <div className="w-11/12 sm:w-48 h-8 bg-gray-200 rounded mb-4"></div>
                <div className="w-full md:w-1/2 h-6 bg-gray-200 rounded mb-2"></div>
            </div>
            <div className='flex gap-4 justify-center w-full mt-5 h-full'>
                <div className="w-full md:w-1/2 md:h-80 rounded mb-2 flex flex-col items-center">
                    <div className='w-11/12 h-12 animate-pulse bg-gray-200 rounded-lg'></div>
                    <div className='w-44 h-12 animate-pulse bg-gray-200 rounded-lg mt-10'></div>
                    <div className='w-1/2 h-6 animate-pulse bg-gray-200 rounded-lg mt-2'></div>
                    <div className='grid grid-cols-1 w-full md:grid-cols-2 gap-4 mt-12'>
                        <div className='bg-gray-200 w-11/12 lg:w-80 rounded-lg h-12 animate-pulse'>
                        </div>
                        <div className='bg-gray-200 w-11/12 lg:w-80 rounded-lg h-12 animate-pulse'>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 w-full md:grid-cols-2 gap-4 mt-8'>
                        <div className='bg-gray-200 w-11/12 lg:w-80 rounded-lg h-12 animate-pulse'>
                        </div>
                        <div className='bg-gray-200 w-11/12 lg:w-80 rounded-lg h-12 animate-pulse'>
                        </div>
                    </div>
                </div>
                <div className=" hidden md:block w-1/2 h-screen bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}

export default Loading
