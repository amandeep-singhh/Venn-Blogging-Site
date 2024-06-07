import React, { useEffect, useState } from 'react'
import logo from '../imgs/LOGO.png'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import UserNavigationPanel from './user-navigation.component'
import { checkNewNotification } from '../../services/operations/userAPI'
import { setNewNotificationAvailable } from '../../redux/slices/authSlice'

const Navbar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const access_token = user?.access_token;
    const newNotificationAvailable = user?.newNotificationAvailable;
    const [userNavPanel, setUserNavPanel] = useState(false);
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const handelUserNavPanel = () => {
        setUserNavPanel(!userNavPanel)
    }

    const handelBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false)
        }, 200)
    }

    const handleSearch = (e) => {
        let query =e.target.value;
        if(e.keyCode==13 && query.length){
            navigate(`/search/${query}`);
        }
    }

    const notificationAvailable=async()=>{
        let {success,new_notification_available}=await checkNewNotification(access_token);
        if(success){
            dispatch(setNewNotificationAvailable(new_notification_available))
        }
    }

    useEffect(()=>{
        if(access_token){
            notificationAvailable()
        }
    },[access_token])

    return (
        <>
            <nav className='navbar z-50'>
                <Link to="/">
                    <img src={logo} alt="logo" className='w-[5rem] flex-none ' />
                </Link>
                <div className={`absolute py-4 px-[5vw] bg-white w-full left-0 top-full mt-0.5 border-b border-grey md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${searchBoxVisibility ? "show" : "hide"}`}>
                    <input
                        type='text'
                        placeholder='Search'
                        className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'
                        onKeyDown={handleSearch}
                    />
                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                </div>
                <div className='flex items-center gap-3 md:gap-6 ml-auto'>
                    <button className='md:hidden bg-grey h-12 w-12 rounded-full items-center justify-center'
                        onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}>
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>
                    <Link to="/editor" className='hidden md:flex gap-2 link'>
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>

                    {
                        user?.access_token ?
                            <>
                                <Link to="/notifications">
                                    <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                                        <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                                        {
                                            newNotificationAvailable && <span className='aspect-square w-3 rounded-full bg-red absolute top-2 right-2'></span>
                                        }
                                        
                                    </button>
                                </Link>

                                <div className='relative'
                                    onClick={handelUserNavPanel}
                                    onBlur={handelBlur}>
                                    <button className='w-12 h-12 mt-1'>
                                        <img src={user?.profile_img} alt="profileImg" className='w-full h-full object-cover rounded-full' />
                                    </button>
                                    {
                                        userNavPanel && <UserNavigationPanel />
                                    }

                                </div>
                            </>
                            :
                            <>
                                <Link className='btn-dark py-2' to="/signin">
                                    Sign In
                                </Link>
                                <Link className='btn-light py-2 hidden md:block' to="/signup">
                                    Sign Up
                                </Link>
                            </>
                    }


                </div>
            </nav>
            <Outlet />
        </>
    )
}

export default Navbar
