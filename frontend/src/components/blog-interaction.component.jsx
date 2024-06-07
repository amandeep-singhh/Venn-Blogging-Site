import React, { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { setCommentWrapper, setIsLikedByUser, setTotalLikes } from '../../redux/slices/currentBlogSlice';
import { checkIsLikedByUser, likeBlog } from '../../services/operations/blogAPI';

const BlogInteraction = () => {
    const { title, desc, content, tags, author, banner, publishedAt, activity, blog_id, isLikedByUser, _id,commentWrapper } = useSelector((state) => state.currentBlog);
    // let isLikedByUser_preVal = useRef(isLikedByUser);
    let [clickedLikeBtn, setClickedLikeBtn] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const username = user?.username;
    const access_token = user?.access_token;
    let total_likes = activity?.total_likes;
    let total_comments = activity?.total_comments;
    let author_username = author?.personal_info?.username;
    const dispatch = useDispatch();

    const handleLike = () => {
        if (access_token) {
            setClickedLikeBtn(true)
            dispatch(setIsLikedByUser(!isLikedByUser));
            !isLikedByUser ? dispatch(setTotalLikes(++total_likes)) : dispatch(setTotalLikes(--total_likes));
            //isLikedByUser useEffect will run after this
        } else {
            toast.error("Please Login to Like this blog");
        }
    }

    const isLikedByUserApiCall = async () => {
        let { success, islikedByUser: IS_LIKED_BY_USER } = await checkIsLikedByUser(_id, access_token);
        dispatch(setIsLikedByUser(IS_LIKED_BY_USER));
        if (!success) {
            console.log('unable to fetch whether the blog is already liked by user or not')
        }
    }
    const showComments=()=>{
        dispatch(setCommentWrapper(true))
        console.log("commentWrapper",commentWrapper)
    }

    useEffect(() => {

        //to prevent useEffect calling the api at first render
        if (clickedLikeBtn) {
            // isLikedByUser_preVal.current = isLikedByUser;
            likeBlog(_id, isLikedByUser, access_token);
        }

    }, [isLikedByUser])

    useEffect(() => {
        if (access_token) {
            isLikedByUserApiCall()
        }
    }, [])

    return (
        <>
            <Toaster />
            <hr className='border-grey my-2 ' />
            <div className='flex gap-6 justify-between'>
                <div className='flex gap-3 items-center'>

                    <button
                        onClick={handleLike}
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-grey`}>
                        <i className={`fi ${isLikedByUser ? "fi-sr-heart text-red " : "fi-rr-heart"}`}></i>
                    </button>
                    <p className='text-xl text-dark-grey '>{total_likes}</p>

                    <button 
                    onClick={showComments}
                    className='w-10 h-10 rounded-full flex items-center justify-center bg-grey'>
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className='text-xl text-dark-grey '>{total_comments}</p>

                </div>


                <div className='flex gap-6 items-center '>
                    {
                        username == author_username &&
                        <Link to={`/editor/${blog_id}`} className=' hover:text-white hover:bg-blue-600 hover:scale-[1.1] bg-slate-300 px-4 rounded-lg font-medium  '>Edit</Link>
                    }
                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} target="_blank"><i className="fi fi-brands-twitter text-2xl  hover:text-twitter"></i></Link>
                </div>

            </div>
            <hr className='border-grey my-2 ' />
        </>
    )
}

export default BlogInteraction
