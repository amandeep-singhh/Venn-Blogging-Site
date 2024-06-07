import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCommentWrapper, setMoreComments } from '../../redux/slices/currentBlogSlice';
import CommentField from './comment-field.component';
import NoDataMessage from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import CommentCard from './comment-card.component';
import { calcLength } from 'framer-motion';
import LoadMoreDataBtn from './load-more.component';
import { getComments } from '../../services/operations/blogAPI';
import toast, { Toaster } from 'react-hot-toast';

const CommentsContainer = () => {
    let { _id, commentWrapper, totalParentCommentsLoaded, title, comments, activity: { total_comments,total_parent_comments } } = useSelector((state) => state.currentBlog);
    const dispatch = useDispatch();

    const fetchMoreComments = async (skip) => {
        
        let { success, comments: moreComments } = await getComments({ blog_id: _id, skip,isReply:false });
        if (success) {
            dispatch(setMoreComments(moreComments));
        } else {
            toast.error("Unable to load more comments");
        }
    }

    return (
        <div className={`max-sm:w-full fixed ${commentWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]"} duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-7 overflow-y-auto overflow-x-hidden flex flex-col gap-5`}>
            <Toaster />
            <div className='relative flex flex-col gap-1 '>
                <h1 className='text-3xl font-medium '>Comments</h1>
                <p className='text-lg w-[70%] text-dark-grey line-clamp-1' >{title}</p>
                <button
                    onClick={() => dispatch(setCommentWrapper(false))}
                    className='absolute top-0 right-0 flex justify-center items-center w-10 h-10 rounded-full bg-grey '>
                    <i className="fi fi-br-cross mt-1"></i>
                </button>
            </div>
            <CommentField action="Comment" />
            {
                comments && comments.length ?
                    <>
                        {
                            comments.map((comment, i) => {
                                return <AnimationWrapper key={i}>
                                    <CommentCard commentData={comment} />
                                </AnimationWrapper>
                            })
                        }
                        {
                            total_parent_comments > comments?.length ?
                                <button
                                onClick={()=>fetchMoreComments(comments?.length)}
                                    className='text-blue-600 font-medium border-2 border-blue-600 p-2 px-3 hover:bg-blue-50 hover:scale-[1.05]  rounded-full flex items-center gap-2 self-center mx-auto'>
                                    Load more
                                </button>
                                :""
                        }

                    </>
                    : <NoDataMessage message="No comments" />


            }



        </div>
    )
}

export default CommentsContainer
