import React from 'react'

const BlogsCardStats = ({ total_likes, total_comments, total_reads }) => {
    return (
        <>
            <div className='flex flex-col gap-2 items-center justify-center px-8'>
                <p className='text-2xl font-medium'>{total_likes}</p>
                <p className='font-medium text-gray-600 whitespace-nowrap'>Likes❤️</p>
            </div>

            <div className='flex flex-col gap-2 items-center justify-center border-r border-l border-gray-400  px-8'>
                <p className='text-2xl font-medium'>{total_comments}</p>
                <p className='font-medium text-gray-600 whitespace-nowrap'>Comments🗨️</p>
            </div>

            <div className='flex flex-col gap-2 items-center justify-center px-8'>
                <p className='text-2xl font-medium'>{total_reads}</p>
                <p className='font-medium text-gray-600 whitespace-nowrap'>Reads📖</p>
            </div>
        </>
    )
}

export default BlogsCardStats
