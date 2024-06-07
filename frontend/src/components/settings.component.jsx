import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom'
import TabSwitch from '../common/TabSwitch';

const Settings = () => {
    const { user } = useSelector(state => state.auth);
    const access_token = user?.access_token;

    return (
        access_token ?
            <>
                <section className='relative flex gap-8 py-0 m-0 max-md:flex-colc flex-col'>
                    <div className='flex flex-col gap-6'>
                        <h1 className='text-4xl font-medium '>Settings</h1>

                        <TabSwitch firstTab={"edit profile"} firstIcon={"user"} secondTab={"change password"} secondIcon={"lock"} firstRoute={"/settings/edit-profile"} secondRoute={"/settings/change-password"} />
                        
                    </div>
                    <div className='mt-2 w-full '>
                        <Outlet />
                    </div>
                </section>


            </>
            : <Navigate to={"/signin"} />
    )
}

export default Settings
