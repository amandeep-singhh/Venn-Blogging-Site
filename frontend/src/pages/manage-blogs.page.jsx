import React from 'react'
import TabSwitch from '../common/TabSwitch'
import { Outlet } from 'react-router-dom'

const ManageBlogs = () => {
    return (
        <div  className='p-3 flex flex-col gap-6 max-w-[1300px] mx-auto'>
            <h1 className='text-4xl font-medium '>Manage Blogs</h1>

            <TabSwitch firstTab={"published blogs"} firstIcon={"blog-pencil"} secondTab={"draft blogs"} secondIcon={"folder-open"} firstRoute={"/blogs/published-blogs"} secondRoute={"/blogs/draft-blogs"} />

            <>
                <Outlet />
            </>
        </div>
    )
}

export default ManageBlogs