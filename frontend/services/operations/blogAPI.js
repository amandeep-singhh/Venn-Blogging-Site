import axios from "axios";
import { blogEndpoints } from "../apis.js"
import { store } from "../../redux/store";
import { resetBlogState } from "../../redux/slices/blogSlice.js";
import { filterPaginationData } from "../../src/common/filter-pagination-data.jsx";
// import { setTotalParentCommentsLoaded } from "../../redux/slices/currentBlogSlice.js";



const { CREATE_BLOG, LATEST_BLOGS, TRENDING_BLOGS, SEARCH_BLOGS, GET_CATEGORIES, ALL_BLOGS_COUNT, SEARCH_BLOGS_COUNT, GET_BLOG, LIKE_BLOG, IS_LIKED_BY_USER, ADD_COMMENT, GET_BLOG_COMMENT, DELETE_COMMENT,DELETE_BLOG } = blogEndpoints;

const publishBlog = (blogData, token) => {
    let res = { success: 'pending' };
    console.log("blog Data sending to publish/create a blog:", blogData);

    axios.post(CREATE_BLOG, blogData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((response) => {
            console.log("CREATE_BLOG API RESPONSE...", response);
            store.dispatch(resetBlogState());
            res.success = true;
        })
        .catch(({ response }) => {
            console.log("CREATE_BLOG API ERROR...", response)
            res.success = false;
        })
    return res;
}

const getLatestBlog = async (blogsState, page = 1) => {
    let res = { success: 'pending' };

    try {
        let { data } = await axios.post(LATEST_BLOGS, { page });
        let blogs = data.blogs;
        res.success = true;
        let formatedData = await filterPaginationData({
            state: blogsState,
            data: blogs,
            page,
            countRoute: ALL_BLOGS_COUNT,
        })
        res.blogs = formatedData;
        console.log("LATEST_BLOGS API RESPONSE...", data)
    } catch (err) {
        res.success = false;
        res.blogs = [];
        console.log("LATEST_BLOGS API ERROR...", err);
    }

    return res;
}

const getTrendingBlog = async () => {
    let res = { success: 'pending' };

    try {
        let { data } = await axios.get(TRENDING_BLOGS);
        let blogs = data.blogs;
        res.blogs = blogs;
        res.success = true;
        console.log("TRENDING_BLOGS API RESPONSE...", data)
    } catch (err) {
        res.success = false;
        res.blogs = [];
        console.log("TRENDING_BLOGS API ERROR...", err)
    }

    return res;
}

const getBlogsByCategory = async (blogsState, category, page = 1) => {
    let res = { success: 'pending' };

    try {
        let { data } = await axios.post(SEARCH_BLOGS, { tag: category, page });
        let blogs = data.blogs;
        if (blogs.length != 0) {
            res.success = true;
            let formatedData = await filterPaginationData({
                state: blogsState,
                data: blogs,
                page,
                countRoute: SEARCH_BLOGS_COUNT,
                data_to_send: { tag: category }
            })
            res.blogs = formatedData;
            console.log("(function getBlogsByCategory)SEARCH_BLOGS API RESPONSE...", data)
        } else {
            throw Error
        }


    } catch (err) {
        res.success = false;
        res.blogs = [];
        console.log("(function getBlogsByCategory)SEARCH_BLOGS API ERROR...", err)
    }

    return res;
}

const getCategories = async () => {
    let res = { success: 'pending', categories: [] };
    try {
        let { data } = await axios.get(GET_CATEGORIES);
        res.success = true;
        res.categories = data.categoryArray;
        console.log("GET_CATEGORIES API RESPONSE...", data)

    } catch (err) {
        res.success = false;
        res.categories = []
        console.log("GET_CATEGORIES API ERROR...", err)
    }

    return res
}

const searchBlogs = async (blogsState, query, page = 1, create_new_arr = false) => {
    let res = { success: 'pending' };
    try {
        let { data } = await axios.post(SEARCH_BLOGS, { query, page });
        let blogs = data.blogs;
        res.success = true;
        let formatedData = await filterPaginationData({
            state: blogsState,
            data: blogs,
            page,
            countRoute: SEARCH_BLOGS_COUNT,
            data_to_send: { query },
            create_new_arr
        })
        res.blogs = formatedData;
        console.log("(function searchBlogs)SEARCH_BLOGS API RESPONSE...", data)
    } catch (err) {
        res.success = false;
        res.blogs = [];
        console.log("(function searchBlogs)SEARCH_BLOGS API ERROR...", err)
    }

    return res;

}

const getBlog = async (blog_id) => {
    let res = {};
    try {
        let { data } = await axios.post(GET_BLOG, { blog_id });
        res.blog = data.blog;
        res.success = true;
        console.log("GET_BLOG API RESPONSE...", data)
    } catch (err) {
        res.success = false;
        res.blog = {};
        console.log("GET_BLOG API ERROR...", err)
    }
    return res
}


const getSimilarBlogs = async (tag, limit, eliminate_blog) => {
    let res = {};
    try {
        let { data } = await axios.post(SEARCH_BLOGS, { tag, limit, eliminate_blog });
        res.blogs = data.blogs;
        res.success = true;
        console.log("(function getSimilarBlogs)SEARCH_BLOGS API RESPONSE...", data)
    } catch (err) {
        res.success = false;
        res.blogs = {};
        console.log("(function getSimilarBlogs)SEARCH_BLOGS API ERROR...", err)
    }
    return res
}

const likeBlog = async (_id, isLikedByUser, access_token) => {
    let res = {};
    try {
        let { data } = await axios.post(LIKE_BLOG, { _id, isLikedByUser }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        console.log("LIKE_BLOG API RESPONSE...", data)
        res.success = true;
    } catch (err) {
        res.success = false;
        console.log("LIKE_BLOG API ERROR...", err)
    }
    return res
}

const checkIsLikedByUser = async (blog_id, access_token) => {
    let res = {};
    try {
        let { data } = await axios.post(IS_LIKED_BY_USER, { blog_id }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        console.log("IS_LIKED_BY_USER API RESPONSE...", data)
        res.success = true;
        res.islikedByUser = data.islikedByUser;
    } catch (err) {
        res.success = false;
        res.islikedByUser = undefined;
        console.log("IS_LIKED_BY_USER API ERROR...", err)
    }
    return res
}

const addComment = async ({ _id, blog_author, comment, access_token, isReply, replyig_to_comment, replying_to_user,replyOfReply_Comment,reply_of_reply }) => {
    let res = {};
    let dataToSend = isReply ?
        {
            _id,
            blog_author,
            comment,
            isReply,
            replyig_to_comment,
            replying_to_user,
            replyOfReply_Comment,
            reply_of_reply
        } :
        {
            _id,
            blog_author,
            comment,
            isReply
        };
    try {
        let { data } = await axios.post(ADD_COMMENT, dataToSend, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        console.log("ADD_COMMENT API RESPONSE...", data);
        res.success = true;
        res.data = data;
    }
    catch (err) {
        res.success = false;
        res.data = {};
        console.log("ADD_COMMENT API ERROR...", err)
    }
    return res
}

const getComments = async ({ blog_id, skip = 0, isReply, parentCommentId }) => {
    let res = {};

    try {
        let { data } = await axios.post(GET_BLOG_COMMENT, { blog_id, skip, isReply, parentCommentId });
        console.log("GET_BLOG_COMMENT API RESPONSE...", data);
        res.success = true;
        res.comments = data.comment
    } catch (err) {
        res.success = false;
        res.comments = [];
        console.log("GET_BLOG_COMMENT API ERROR...", err)
    }
    return res
}

const deleteComment = async ({ commentId, isReply, blogId ,access_token,parentId}) => {
    let res = {};
    
    try {
        let response = await axios.delete(DELETE_COMMENT, {data:{ commentId, isReply, blogId ,parentId},
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        console.log("DELETE_COMMENT API RESPONSE...", response.data);
        res.success = true;
    } catch (err) {
        res.success = false;
        console.log("DELETE_COMMENT API ERROR...", err)
    }
    return res
}

const deleteBlog = async (access_token,blog_id) => {
    let res = {};
    
    try {
        let {data} = await axios.delete(DELETE_BLOG, {data:{access_token,blog_id},
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        console.log("DELETE_BLOG API RESPONSE...", data);
        res.success = true;
        res.message=data.message;
    } catch (err) {
        res.success = false;
        res.message=err.response.data.message;
        console.log("DELETE_BLOG API ERROR...", err)
    }
    return res
}

export { publishBlog, getLatestBlog, getTrendingBlog, getBlogsByCategory, getCategories, searchBlogs, getBlog, getSimilarBlogs, likeBlog, checkIsLikedByUser, addComment, getComments, deleteComment ,deleteBlog}