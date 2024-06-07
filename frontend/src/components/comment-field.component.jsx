import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../../services/operations/blogAPI';
import { pushReplyIdInCommentChildren, setComments, setReplies, setTotaComments, setTotalParentComments } from '../../redux/slices/currentBlogSlice';
// import { setComments, setTotaComments, setTotalParentComments, setTotalParentCommentsLoaded } from '../../redux/slices/currentBlogSlice';

const CommentField = ({ action, replyig_to_comment, replying_to_user, showReplies, loadMoreVisible, replyOfReply, replyToUsername,replyOfReply_Comment }) => {
    let [comment, setComment] = useState("");
    const { user } = useSelector((state) => state.auth);
    const { author, _id, comments, activity } = useSelector((state) => state.currentBlog);
    const token = user?.access_token;
    const dispatch = useDispatch();

    let total_comments = activity?.total_comments;
    let total_parent_comments = activity?.total_parent_comments;

    // console.log("loadMoreVisible:",loadMoreVisible)

    const handleComment = async () => {
        if (!token) {
            return toast.error("Please Login to comment")
        }
        if (!comment.length) {
            return toast.error("Please write something to comment")
        }


        let dataToSend = action == 'Reply' ?
            {
                _id,
                blog_author: author?._id,
                comment,
                isReply: true,
                replyig_to_comment,
                replying_to_user,
                access_token: token,
                replyOfReply_Comment,
                reply_of_reply:replyOfReply
            } :
            {
                _id,
                blog_author: author?._id,
                comment,
                isReply: false,
                access_token: token
            };


        let { success, data } = await addComment(dataToSend);
        if (!success) {
            return toast.error("Something went wrong , unable to add comment");
        }

        let newCommentObj = {
            _id: data._id,
            blog_id: _id,
            comment: data.comment,
            children: data.children,
            commented_by: {
                personal_info: {
                    fullname: user?.fullname,
                    username: user?.username,
                    profile_img: user?.profile_img,
                },
                _id: data.user_id
            },
            isReply: data.isReply,
            commentedAt: data.commentedAt,
        }
        if (action == "Reply") {
            dispatch(pushReplyIdInCommentChildren({ commentId: replyig_to_comment, replyId: data._id }));
            //if user has not clicked on show replies then no need to store new reply in reply state
            //only if replies are already rendered on  screen we need to update it with new comment user just posted
            if (showReplies) {
                newCommentObj.parent = data.parent;
                let replyObj = {
                    newReply: true,
                    newCommentReply: newCommentObj,
                    parentComment: data.parent,
                    loadMoreVisible
                }
                dispatch(setReplies(replyObj))
            }

        } else {
            dispatch(setComments(newCommentObj));
            dispatch(setTotalParentComments(++total_parent_comments));
        }
        toast.success("Comment added!")
        dispatch(setTotaComments(++total_comments));
        setComment("")
    }

    useEffect(() => {
        if(replyOfReply){
            setComment(`@${replyToUsername}`)
        }
    }, [])

    return (
        <div className={`${action == "Reply" ? "my-3 ml-4 " : ""}`}>
            
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={action == "Reply" ? 'Leave a Reply' : 'Leave a comment'}
                className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto '></textarea>
            <button
                onClick={handleComment}
                className='btn-dark  px-10 '>{action}</button>
        </div>
    )
}

export default CommentField
