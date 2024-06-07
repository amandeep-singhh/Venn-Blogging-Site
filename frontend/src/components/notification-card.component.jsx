import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { addComment } from '../../services/operations/blogAPI';
import { getDay } from '../common/date';
import { Link, useNavigate } from 'react-router-dom';


const NotificationCard = ({ data }) => {
    let [replyClicked, setReplyClicked] = useState(false)
    let [reply, setReply] = useState("")
    let [postReplyLoading, setPostReplyLoading] = useState(false);

    const navigate = useNavigate();

    const { user: userAuth } = useSelector((state) => state.auth);
    const access_token = userAuth?.access_token;

    const {
        type,
        user,
        comment: commentData,
        blog,
        replied_on_comment,
        createdAt,
        seen
    } = data;
    const comment = commentData?.comment;
    const comment_id = commentData?._id;
    const isReply = commentData?.isReply;
    const parentComment = commentData?.parent;
    const username = user?.personal_info?.username;
    const user_id = user?._id;
    const profile_img = user?.personal_info?.profile_img;
    const repliedOnComment = replied_on_comment?.comment;
    const blog_title = blog?.title;
    const blog_id = blog?._id;
    const blog_URL_ID = blog?.blog_id;
    const author_id = blog?.author?._id;

    const handleReplyClicked = () => {
        //if you click on "reply" button
        if (!replyClicked) {
            if (isReply) {
                setReply(`@${username} `)
            }
        }
        //if you click on "cancle" button
        else { setReply("") }

        setReplyClicked(!replyClicked)

    }

    const handlePostReply = async () => {
        if (!reply.length || reply == `@${username} `) {
            return toast.error("Please write something to reply");
        }

        let dataToSend =
        {
            _id: blog_id,
            blog_author: author_id,
            comment: reply,
            isReply: true,
            replyig_to_comment: isReply ? parentComment : comment_id,
            replying_to_user: user_id,
            access_token,
            replyOfReply_Comment: isReply ? parentComment : comment_id,
            reply_of_reply: isReply
        };

        setPostReplyLoading(true);
        let { success, data } = await addComment(dataToSend);
        setPostReplyLoading(false);
        if (success) {
            toast.success("Reply posted");
            setReply("");
            setReplyClicked(false);
        } else {
            toast.success("Something went wrong, please try again");
        }

    }

    return (
        <div className={`flex w-full gap-3 p-3   border rounded-lg   relative ${seen ? "border-gray-300" : "border-red"}`}>
            {!seen && <span className='absolute  rounded-full aspect-square w-4  bg-red -top-1 -right-1'></span>}

            <img
                onClick={() => navigate(`/user/${username}`)}
                src={profile_img}
                className='w-16 aspect-square rounded-full bg-slate-800 border-2 border-gray-700 cursor-pointer' />

            <div className='flex flex-col gap-2 w-full'>
                <div className='flex flex-col '>

                    <p className=''>
                        <Link to={`/user/${username}`} className='text-blue-600 cursor-pointer hover:underline'>{username}</Link>
                        {
                            type == 'like' ? " ❤️liked your blog" :
                                type == 'comment' ? " 🗨️left a comment on your blog" :
                                    " 📝replied to your comment"
                        }
                    </p>
                    <Link to={`/blog/${blog_URL_ID}`}>
                        <p className={` text-gray-500 mb-3`}>
                            {
                                type == 'comment' || type == 'like' ? blog_title :
                                    type == 'reply' ? repliedOnComment
                                        : ""
                            }
                        </p>

                        <p className='font-medium line-clamp-2 '>{comment}</p>
                    </Link>


                </div>

                <div className='flex justify-between mt-3'>
                    <button
                        onClick={handleReplyClicked}
                        className={`${replyClicked ? "hover:text-red" : "hover:text-blue-600 "} text-gray-700 w-fit `} >
                        {type != "like" && `${replyClicked ? "Cancle" : "Reply"}`}
                    </button>
                    <p className='text-gray-700 text-sm'>{getDay(createdAt)}</p>
                </div>


                {
                    replyClicked &&
                    <div className='flex flex-col gap-2'>
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder='Write a reply...'
                            rows={3}
                            className='resize-none border-gray-400 p-3 border rounded-lg '
                        ></textarea>
                        {
                            !postReplyLoading ?
                                <button
                                    onClick={handlePostReply}
                                    className='w-fit self-end rounded-lg text-sm bg-slate-800 text-white px-3 py-1 hover:bg-slate-700'>
                                    Post Reply
                                </button>
                                : <div
                                    className='w-fit self-end rounded-lg text-sm bg-slate-800  px-3 py-1 min-w-[81.16px] min-h-[25px] '>
                                    <div className='loader mx-auto '></div>
                                </div>
                        }


                    </div>
                }


            </div>
        </div>
    )
}

export default NotificationCard
