import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: '',
    desc: '',
    content: [],
    tags: [],
    author: { personal_info: {} },
    activity: {},
    banner: '',
    publishedAt: '',
    blog_id: '',
    isLikedByUser: false,
    _id: '',
    commentWrapper: false,
    comments: [],
    replies: {},
}

const currentBlogSlice = createSlice({
    name: 'currentBlog',
    initialState: initialState,
    reducers: {
        setCurrentTitle: (state, value) => {
            state.title = value.payload
        },
        setCurrentDesc: (state, value) => {
            state.desc = value.payload
        },
        setCurrentContent: (state, value) => {
            state.content = value.payload
        },
        setCurrentTags: (state, value) => {
            state.tags.push(value.payload)
        },
        setCurrentAuthor: (state, value) => {
            state.author = value.payload
        },
        setCurrentBanner: (state, value) => {
            state.banner = value.payload
        },
        setCurrentPublishedAt: (state, value) => {
            state.publishedAt = value.payload
        },
        setCurrentActivity: (state, value) => {
            state.activity = value.payload
        },
        setIsLikedByUser: (state, value) => {
            state.isLikedByUser = value.payload
        },
        setTotalLikes: (state, value) => {
            state.activity.total_likes = value.payload
        },
        setTotaComments: (state, value) => {
            state.activity.total_comments = value.payload
        },
        setTotalParentComments: (state, value) => {
            state.activity.total_parent_comments = value.payload
        },
        setCommentWrapper: (state, value) => {
            state.commentWrapper = value.payload
        },
        setComments: (state, value) => {
            if (Array.isArray(value.payload)) {
                state.comments = value.payload;
            } else {
                state.comments.unshift(value.payload)
            }
        },
        removeFromCommentsState: (state, value) => {
            const commentToRemove = value.payload;
            const index = state.comments.findIndex(c => c._id == commentToRemove);
            state.comments.splice(index, 1);
        },
        setMoreComments: (state, value) => {
            value.payload.map(comment => {
                state.comments.push(comment)
            })
        },
        pushReplyIdInCommentChildren: (state, value) => {
            state.comments.map(comment => {
                if (comment._id == value.payload.commentId) {
                    comment.children.unshift(value.payload.replyId)
                }

            })
        },
        pullReplyIdFromCommentChildren: (state, value) => {
            let { parentId, replyId } = value.payload;
            let index;
            state.comments.map(comment=>{
                if (comment._id == parentId) {
                    index=comment.children.indexOf(replyId);
                    comment.children.splice(index,1);
                }
                return
            })

        },
        setReplies: (state, value) => {
            const reply = value.payload;

            //when load more btn clicked
            if (reply.moreReplies) {

                reply.commentReplies.map(newReply => {
                    state.replies[reply.parentComment].push(newReply)
                })
                return
            }
            //when user leaves a new reply
            if (reply.newReply) {
                //since new reply will go to at the very end of the replies
                //we need to check if all the replies of the particular comment are visible
                //if load more btn is visible then there are more replies to be loaded so no need to add the new reply in current replies state
                if (reply.loadMoreVisible) { return }
                state.replies[reply.parentComment].push(reply.newCommentReply)

            }
            //when show replies btn is clicked
            else {
                const replies = reply.commentReplies;
                Object.assign(state.replies, { [reply.parentComment]: replies })

            }
        },
        removeFromRepliesState: (state, value) => {

            const parentCommentId = value.payload;
            delete state.replies[parentCommentId]
        },
        removeOneReply: (state, value) => {
            let { parentId, replyId } = value.payload;
            const index = state.replies[parentId].findIndex(c => c._id == replyId);
            state.replies[parentId].splice(index, 1);
        },
        setCurrentBlogState: (state, value) => {
            state.activity = value.payload.activity;
            state.title = value.payload.title;
            state.banner = value.payload.banner;
            state.content = value.payload.content;
            state.tags = value.payload.tags;
            state.desc = value.payload.desc;
            state.author = value.payload.author;
            state.publishedAt = value.payload.publishedAt;
            state.blog_id = value.payload.blog_id;
            state._id = value.payload._id;
            state.comments = value.payload?.comments?.length ? value.payload.comments : [];
        },
        resetCurrentBlogState: (state, value) => {
            state.title = '';
            state.banner = '';
            state.content = [];
            state.tags = [];
            state.desc = '';
            state.author = { personal_info: {} };
            state.publishedAt = '';
            state.activity = '';
            state._id = '';
            state.blog_id = '';
            state.isLikedByUser = false;
            state.commentWrapper = false;
            state.comments = [];
            state.replies = {};
        }
    }
})

export const { setCurrentAuthor, setCurrentBanner, setCurrentContent, setCurrentDesc, setCurrentPublishedAt, setCurrentTags, setCurrentTitle, resetCurrentBlogState, setCurrentActivity, setCurrentBlogState, setIsLikedByUser, setTotalLikes, setCommentWrapper, setComments, setTotaComments, setTotalParentComments, setMoreComments, pushReplyIdInCommentChildren, setReplies, removeFromRepliesState, removeFromCommentsState, removeOneReply,pullReplyIdFromCommentChildren } = currentBlogSlice.actions;
export default currentBlogSlice.reducer;