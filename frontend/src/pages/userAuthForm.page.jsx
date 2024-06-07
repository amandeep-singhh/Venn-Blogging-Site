import React, { useRef } from 'react'
import InputBox from '../components/input.component'
import { Link, Navigate } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'
import { toast, Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { signinAndSignup } from '../../services/operations/authAPI'
import logo from '../imgs/LOGO.png'

const UserAuthForm = ({ type }) => {
    const {user}=useSelector((state)=>state.auth)


    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        //formData
        let form = new FormData(formElement)
        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData

        //validaton
        if (fullname && fullname.length < 3) {
            return toast.error('Fullname must be at least 3 letters long')
        }
        if (!email.length) {
            return toast.error('Enter Email')
        }
        if (!emailRegex.test(email)) {
            return toast.error('Email is invalid')
        }
        if (!passwordRegex.test(password) && serverRoute == "/signup") {
            return toast.error('Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters')
        }
        if (!password && serverRoute == "/signup") {
            return toast.error('Please enter password')
        }

        signinAndSignup(serverRoute, formData)

    }

    return (
        user?.access_token?
        <Navigate to="/"/>
        :
        <AnimationWrapper keyValue={type}>
            <section className='h-cover flex flex-col items-center justify-center'>
                <Toaster />
                <div className='flex flex-col mb-32 items-center gap-3'>
                    <img src={logo} alt="logo" className='w-44' />
                    <p className='font-comfortaa  text-3xl text-gradient'>Venn Blogs</p>
                </div>
                <h1 className='text-4xl font-gelasio capitalize text-center mb-9 '>
                    {type == "sign-in" ? "Welcome Back" : "Join us today"}
                </h1>
                <form id="formElement"
                    onSubmit={handleSubmit}
                    className='w-[80%] max-w-[400px] '>

                    {
                        type !== "sign-in" &&
                        <InputBox
                            name="fullname"
                            type="text"
                            placeholder="Full Name"
                            icon="fi-rr-user"
                        />

                    }
                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi-rr-envelope"
                    />
                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-key"
                    />

                    <button
                        type='submit'
                        className='btn-dark center mt-14'>
                        {type.replace("-", " ")}
                    </button>
                    {/* <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold' >
                        <hr className='w-1/2 border-black ' />
                        <p>OR</p>
                        <hr className='w-1/2 border-black ' />
                    </div>
                    <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'>
                        <img src={googleIcon} alt="googleIcon" className='w-5' />
                        continue with google
                    </button> */}
                    {
                        type == "sign-in" ?
                            <p className='mt-6 text-dark-grey text-xl text-center'>
                                Don't have an account?
                                <Link to="/signup" className="underline text-back text-xl ml-1 ">
                                    Join us today
                                </Link>
                            </p>
                            :
                            <p className='mt-6 text-dark-grey text-xl text-center'>
                                Already a member?
                                <Link to="/signin" className="underline text-back text-xl ml-1 ">
                                    Sign in here.
                                </Link>
                            </p>
                    }
                </form>
            </section>
        </AnimationWrapper>

    )
}

export default UserAuthForm
