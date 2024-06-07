import React, { useState } from 'react'
import { getDay } from '../common/date';
import CommentField from './comment-field.component';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment } from '../../services/operations/blogAPI';
import { pullReplyIdFromCommentChildren, removeOneReply, setTotaComments } from '../../redux/slices/currentBlogSlice';
import toast, { Toaster } from 'react-hot-toast';

const ReplyCard = ({ replyData, loadMoreVisible, showReplies }) => {
    let { blog_id, isReply, parent, comment, commentedAt, commented_by: { personal_info: { profile_img, fullname, username } } } = replyData;
    let { author, activity } = useSelector(state => state.currentBlog)
    let { user } = useSelector(state => state.auth);
    let [replyComment, setReplyComment] = useState(false);
    const dispatch = useDispatch();

    let total_comments = activity?.total_comments;

    const handleDeleteReply = async () => {
        let { success } = await deleteComment({
            commentId: replyData._id,
            isReply: isReply,
            blogId: blog_id,
            access_token: user?.access_token,
            parentId: parent
        });
        if (success) {
            toast.success("Reply deleted");
            dispatch(setTotaComments(--total_comments));
            dispatch(removeOneReply({ parentId: parent, replyId: replyData._id }));
            dispatch(pullReplyIdFromCommentChildren({ parentId: parent, replyId: replyData._id }));
            setReplyComment(false);

        } else {
            toast.error("Unable to delete reply")
        }
    }

    return (
        <div className='px-4 py-4  border-b border-gray-300 flex flex-col gap-5 '>

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
                            onClick={handleDeleteReply}
                            className="fi fi-br-trash text-xl hover:text-rose-700 hover:cursor-pointer text-gray-400"></i> : ""

                }


            </div>

            <p className='font-gelasio text-xl ' >{comment}</p>
            <div className='flex  justify-end'>

                <button
                    onClick={() => setReplyComment(!replyComment)}
                    className='font-medium hover:text-blue-400'>Reply</button>


            </div>
            {
                replyComment &&
                <CommentField action="Reply" loadMoreVisible={loadMoreVisible} replyig_to_comment={parent} replying_to_user={replyData.commented_by._id} showReplies={showReplies} replyOfReply={true} replyToUsername={username} replyOfReply_Comment={replyData._id} />
            }

        </div>

    )
}

export default ReplyCard
