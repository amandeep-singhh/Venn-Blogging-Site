import React from 'react'
import AnimationWrapper from '../common/page-animation'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromSession } from '../common/session'
import { setUser } from '../../redux/slices/authSlice'
import { resetBlogState } from '../../redux/slices/blogSlice'
import { resetCurrentBlogState } from '../../redux/slices/currentBlogSlice'

const UserNavigationPanel = () => {
    const { user } = useSelector((state) => state.auth);
    const username = user?.username;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signOutUser = () => {
        removeFromSession("user");
        dispatch(setUser(null));
        dispatch(resetBlogState());
        dispatch(resetCurrentBlogState());
        navigate("/signin")
    }

    return (
        <AnimationWrapper
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50"
        >

            <div className='bg-white absolute right-0 border border-grey w-60  duration-200'>
                <Link to="/editor" className="flex gap-2 link  md:hidden pl-8 py-4">
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>
                <Link to={`/user/${username}`} className="link pl-8 py-4 " >
                    Profile
                </Link>
                <Link to="/blogs/published-blogs" className="link pl-8 py-4 " >
                    Manage Blogs
                </Link>
                <Link to="/settings/edit-profile" className="link pl-8 py-4 " >
                    Settings
                </Link>

                <span className='absolute border-t border-grey  w-[100%] '>
                </span>

                <button className='text-left p-4 hover:bg-grey w-full pl-8 py-4'
                    onClick={signOutUser}>
                    <h1 className='font-bold text-xl mg-1'>Sing Out</h1>
                    <p className='text-dark-grey'>@{username}</p>
                </button>

            </div>

        </AnimationWrapper>
    )
}

export default UserNavigationPanel
