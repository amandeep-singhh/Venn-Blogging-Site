import React, { useState } from 'react'
import { getDay } from '../common/date'
import ReplyCard from './reply-card.component'
import { useDispatch, useSelector } from 'react-redux';
import CommentField from './comment-field.component';
import { deleteComment, getComments } from '../../services/operations/blogAPI';
import toast, { Toaster } from 'react-hot-toast';
import { removeFromCommentsState, removeFromRepliesState, setReplies, setTotaComments, setTotalParentComments } from '../../redux/slices/currentBlogSlice';
import AnimationWrapper from '../common/page-animation';
import Loader from './loader.component';

const CommentCard = ({ index, commentData }) => {
    let { blog_id, children, comment, commentedAt, commented_by: { personal_info: { profile_img, fullname, username } } } = commentData;
    let { _id, replies, author, activity } = useSelector(state => state.currentBlog)
    const { user } = useSelector(state => state.auth);

    const access_token = user?.access_token;
    let total_comments = activity?.total_comments;
    let total_parent_comments = activity?.total_parent_comments;

    let [toReply, setToReply] = useState(false);
    let [showReplies, setShowReplies] = useState(false);
    let [loading, setLoading] = useState(false);
    let [moreRepliesLoading, setMoreRepliesLoading] = useState(false);
    const dispatch = useDispatch();

    const getReplies = async (query) => {
        query.skip ? setMoreRepliesLoading(true) : setLoading(true)

        let { success, comments } = await getComments(query);
        if (success) {
            let repliesObj = {
                parentComment: commentData._id,
                commentReplies: comments,
                moreReplies: query.skip ? true : false
            }
            dispatch(setReplies(repliesObj))
        } else {
            toast.error("unable to fetch replies")
        }
        query.skip ? setMoreRepliesLoading(false) : setLoading(false)
    }

    const fetchReplies = async () => {

        //if user has clicked show replies button  
        if (!showReplies) {
            setShowReplies(true)

            await getReplies({ blog_id: _id, isReply: true, parentCommentId: commentData._id })
        }

        //if user clicks on hide replies button
        else {
            //taking the replies object out of the replies array state (if we dont do this next time user click on show replies it will show duplicate results)
            dispatch(removeFromRepliesState(commentData._id))
            setShowReplies(false)
        }
    }

    const handleDeleteComment = async () => {

        let { success } = await deleteComment({
            commentId: commentData._id,
            isReply: commentData.isReply,
            blogId: blog_id,
            access_token: access_token
        });
        if (success) {
            let newTotalComments = total_comments - (children?.length + 1)
            toast.success("comment deleted");
            dispatch(removeFromRepliesState(commentData._id));
            dispatch(removeFromCommentsState(commentData._id));
            dispatch(setTotalParentComments(--total_parent_comments));
            dispatch(setTotaComments(newTotalComments));
            setShowReplies(false);

        } else {
            toast.error("Unable to delete comment")
        }

    }


    return (
        <div className='w-full'>

            <div className='px-4 py-4 rounded-md border border-gray-300 flex flex-col gap-5'>
                <div className='flex justify-between items-center '>
                    <div className='flex gap-3 items-center'>
                        <img className='w-9 aspect-square rounded-full' src={profile_img} />
                        <div className='flex flex-col'>
                            <div className='line-clamp-1 flex gap-1 items-baseline'>
                                <p className='font-medium'>{fullname}</p>
                                <p className='text-sm'> @{username}</p>
                            </div>
                            <p className='min-w-fit'>{getDay(commentedAt)}</p>
                        </div>
                    </div>

                    {
                        (author?.personal_info?.username == user?.username) || (username == user?.username) ?
                            <i
                                onClick={handleDeleteComment}
                                className="fi fi-br-trash text-xl hover:text-rose-700 hover:cursor-pointer text-gray-400"></i> : ""

                    }


                </div>

                <p className='font-gelasio text-xl ' >{comment}</p>
                <div className={`flex ${children.length ? "justify-between" : "justify-end"} items-center `}>
                    {
                        children.length ?
                            <button
                                onClick={fetchReplies}
                                className='flex gap-2 items-center hover:text-blue-400'>
                                <i className="fi fi-rr-comment-arrow-up text-2xl"></i>
                                <p className='font-medium mb-1'>{showReplies ? "Hide" : children.length} {children.length > 1 ? "Replies" : "Reply"}</p>
                            </button>
                            : ""
                    }


                    <button
                        onClick={() => setToReply(!toReply)}
                        className='font-medium hover:text-blue-400'>Reply</button>

                </div>
            </div>
            {
                (showReplies || toReply) &&
                <>
                    <div className='flex flex-col border-l-slate-400 border-l-2 ml-8 pt-3 '>
                        {
                            toReply &&
                            <CommentField action="Reply" replyig_to_comment={commentData._id} replying_to_user={commentData.commented_by._id} showReplies={showReplies} loadMoreVisible={Boolean(children?.length > replies[commentData._id]?.length)} />
                        }
                        {
                            showReplies &&
                                loading ? <Loader /> :
                                replies[commentData._id]?.map((reply, i) => {
                                    //sending loadmoreVisible and showReplies in ReplyCard because CommentField component inside it requires them
                                    return <AnimationWrapper key={i}>
                                        <ReplyCard replyData={reply} loadMoreVisible={Boolean(children?.length > replies[commentData._id]?.length)} showReplies={showReplies} />
                                    </AnimationWrapper>

                                })

                        }

                    </div>
                    {children?.length > replies[commentData._id]?.length ?
                        moreRepliesLoading ? <Loader /> :
                            <button
                                onClick={() => getReplies({ blog_id: _id, skip: replies[commentData._id]?.length, isReply: true, parentCommentId: commentData._id })}
                                className='text-blue-600 font-medium border-2 border-blue-600 p-2 px-3 hover:bg-blue-50 hover:scale-[1.05]  rounded-full flex items-center gap-2 self-center mx-auto mt-3'>
                                Load more
                            </button> : ""}
                </>

            }


        </div>
    )
}

export default CommentCard
