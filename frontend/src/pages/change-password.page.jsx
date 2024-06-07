import React, { useRef } from 'react'
import AnimationWrapper from '../common/page-animation'
import InputBox from '../components/input.component'
import toast, { Toaster } from 'react-hot-toast';
import { changePassword } from '../../services/operations/userAPI';
import { useSelector } from 'react-redux';

const ChangePassword = () => {

    let changePasswordForm = useRef();
    const { user } = useSelector((state) => state.auth);
    const access_token = user?.access_token;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const handleSubmit = async(e) => {
        e.preventDefault();
        let form = new FormData(changePasswordForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { currentPassword, newPassword } = formData;

        if (!currentPassword.length || !newPassword.length) {
            return toast.error("Current Password and New Password are required.")
        }
        if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
            return toast.error("Password should be 6 to 20 characters long with 1 numeric , 1 lowercase and 1 uppercase letters")
        }

        e.target.setAttribute("disabled",true);
        let loadingToast=toast.loading("Updating...");
        let {success,message}=await changePassword(formData,access_token);
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");

        if(success){    
            return toast.success("Password Changed");
        }
        else{
            return toast.error(message);
        }
    }

    return (
        <AnimationWrapper>
            <Toaster />
            <form ref={changePasswordForm}>
                <div className=' w-full md:max-w-[400px]  '>
                    <InputBox name="currentPassword" type="password" className="profile-edit-input" placeholder="Current Password" icon="fi fi-rr-unlock" />

                    <InputBox name="newPassword" type="password" className="profile-edit-input" placeholder="New Password" icon="fi fi-rr-unlock" />

                    <button
                        onClick={handleSubmit}
                        className='btn-dark px-10 ' type='submit' >Change Password</button>
                </div>

            </form>
        </AnimationWrapper>
    )
}

export default ChangePassword
