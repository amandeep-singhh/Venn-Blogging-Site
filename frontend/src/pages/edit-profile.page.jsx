import React, { useEffect, useRef, useState } from 'react'
import { profileDataStructure } from './profile.page';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateUserProfile, updateUserProfileImg } from '../../services/operations/userAPI';
import toast, { Toaster } from 'react-hot-toast';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import InputBox from '../components/input.component';
import { uploadImage } from '../common/aws';
import { setUserProfileImg, setUsername } from '../../redux/slices/authSlice';


const EditProfile = () => {
    let bioCharLimit = 150;
    let profileImgEle = useRef();
    let editProfileForm = useRef();
    const dispatch = useDispatch();

    let [profile, setProfile] = useState(profileDataStructure);
    let [loading, setLoading] = useState(true);
    let [updatedProfileImg, setUpdatedProfileImg] = useState(null);

    let [characterLeft, setCharacterLeft] = useState(bioCharLimit);
    const { user } = useSelector((state) => state.auth);
    const username = user?.username;
    const access_token = user?.access_token;

    let { personal_info: { fullname, username: profile_username, profile_img, bio, email }, social_links } = profile;

    const fetchUserProfile = async () => {
        let { success, user } = await getUserProfile(username);
        if (user != null) {
            setProfile(user);
        }

        if (!success) {
            toast.error("Something went wrong")
        }
        setLoading(false)
    }

    const handleCharChange = (e) => {
        setCharacterLeft(bioCharLimit - e.target.value.length)
    }

    const handleImgPreview = (e) => {
        let img = e.target.files[0];
        profileImgEle.current.src = URL.createObjectURL(img);

        setUpdatedProfileImg(img)
    }

    const handleImgUpload = async (e) => {
        e.preventDefault();
        let loadingToast = toast.loading("Saving new profile pic...");
        e.target.setAttribute("disabled", true);
        try {
            let url = await uploadImage(updatedProfileImg);
            if (url) {
                let { success, profileImgUrl } = await updateUserProfileImg(url, access_token);
                if (success) {
                    toast.success("Profile Image updated");
                    dispatch(setUserProfileImg(profileImgUrl));
                    

                } else {
                    toast.error("Error occured please try again");
                }
            }
        } catch (err) {
            console.log("error:", err);
            toast.error("Error occured please try again");
        }
        toast.dismiss(loadingToast);
        setUpdatedProfileImg(null);
        e.target.removeAttribute("disabled");
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        let form = new FormData(editProfileForm.current);
        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }
        let { username: form_username, bio, youtube, facebook, twitter, github, instagram, website } = formData;
        if (form_username.length < 3) {
            return toast.error("Username should be at least 3 letters long");
        }
        if (bio.length > bioCharLimit) {
            return toast.error(`Bio should not be more than ${bioCharLimit} characters`)
        }

        let loadingToast = toast.loading("Updating...");
        e.target.setAttribute("disabled", true);

        let social_linksObj={ youtube, facebook, twitter, github, instagram, website};
        for(let website in social_linksObj){
            if(social_linksObj[website]=="https://"){
                social_linksObj[website]=""
            }
        }
        try {
            let {success,message,username:updatedUsername}=await updateUserProfile(form_username,bio,social_linksObj,access_token);
            toast.dismiss(loadingToast);
            if(success){
                if(username!=updatedUsername){
                    console.log("updatedUsername",updatedUsername)
                    dispatch(setUsername(updatedUsername));
                }
                toast.success(message);
            }else{
                toast.error(message);
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            console.log("error",err)
            toast.error("Something went wrong");
        }
        
        e.target.removeAttribute("disabled");
    }

    useEffect(() => {
        if (access_token) {
            fetchUserProfile()
        }
    }, [access_token])
    return (
        <AnimationWrapper>
            <Toaster />
            {
                loading ? <Loader /> :
                    <form ref={editProfileForm}>
          
                        <div className='flex flex-col lg:flex-row itmes-start  gap-8 lg:gap-10'>
                            <div className='max-lg:center mb-5 '>

                                <div className='relative'>
                                    <img ref={profileImgEle} src={profile_img} className='w-48 aspect-square rounded-full' />
                                    <label htmlFor="uploadImg" id="profileImgLable"
                                        className='absolute right-3 -bottom-1 aspect-square rounded-full hover:cursor-pointer'>
                                        <i className="fi fi-sr-pen-circle text-4xl flex bg-white rounded-full hover:text-gray-700"></i>
                                    </label>
                                </div>

                                <input type="file" id='uploadImg' accept='.jpeg, .png, .jpg' hidden onChange={handleImgPreview} />
                                <button onClick={handleImgUpload} className={`${updatedProfileImg ? "opacity-100" : "opacity-0 h-0"} border-green-500 border-2 rounded-full text-green-500 mt-5 max-lg:center lg:w-full px-6 py-1 font-medium hover:scale-[1.1]`} >Save</button>
                            </div>

                            <div className='w-full'>
                                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                                    <div>
                                        <InputBox name="fullname" type="text" value={fullname} placeholder={"Full Name"} disable={true} icon="fi-rr-user" />
                                    </div>
                                    <div>
                                        <InputBox name="email" type="email" value={email} placeholder={"Email"} disable={true} icon="fi-rr-envelope" />
                                    </div>
                                </div>

                                <InputBox name="username" type="text" value={profile_username} placeholder={"Username"} icon="fi-rr-at" />

                                <textarea name="bio" maxLength={bioCharLimit} defaultValue={bio} placeholder='Bio'
                                    className='placeholder:italic input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5' onChange={handleCharChange}></textarea>

                                <p className='mt-1 text-dark-grey'>{characterLeft} characters left</p>

                                <p className='my-6 text-dark-grey'>Add your social handles below</p>
                                <div className='md:grid md:grid-cols-2 gap-x-6'>
                                    {
                                        Object.keys(social_links).map((key, i) => {
                                            let link = social_links[key];
                                            return <InputBox key={i} name={key} type={"text"} value={link?link:"https://"} placeholder={"https://"} icon={`fi ${key != 'website' ? `fi-brands-${key}` : 'fi-rr-globe'} text-xl`} />
                                        })
                                    }
                                </div>
                                <button onClick={handleSubmit} className='btn-dark w-auto px-10' type="submit" >Update</button>
                            </div>

                        </div>
                    </form>

            }
        </AnimationWrapper>
    )
}

export default EditProfile
