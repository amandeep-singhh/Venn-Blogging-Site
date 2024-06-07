import axios from "axios";
import { UserEndpoints, blogEndpoints } from "../apis.js"
import { searchBlogs } from "./blogAPI.js";
import { filterPaginationData } from "../../src/common/filter-pagination-data.jsx";

const { SEARCH_USERS, GET_PROFILE, CHANGE_PASSWORD,UPDATE_PROFILE_IMG,UPDATE_PROFILE,NEW_NOTIFICATION,GET_NOTIFICATIONS,NOTIFICATIONS_SEEN,USER_BLOGS } = UserEndpoints;
const { SEARCH_BLOGS, SEARCH_BLOGS_COUNT } = blogEndpoints;

export const getUsers = async (query) => {
    let res = { success: 'pending' };
    try {
        let { data } = await axios.post(SEARCH_USERS, { query });
        res.users = data.users;
        res.success = true;
        console.log("SEARCH_USERS API RESPONSE...", data)
    } catch (err) {
        res.success = false;
        res.users = [];
        console.log("SEARCH_USERS API ERROR...", err)
    }
    return res;
}

export const getUserProfile = async (profileId) => {
    let res = {};
    try {
        let { data } = await axios.post(GET_PROFILE, { username: profileId });
        res.user = data;
        res.success = true;
        console.log("GET_PROFILE API RESPONSE...", data)
    } catch (err) {
        res.success = false;
        res.user = {};
        console.log("GET_PROFILE API ERROR...", err)
    }
    return res;
}

export const getUserBlogs = async (blogsState, author, page = 1) => {
    let res = {};
    try {
        let { data } = await axios.post(SEARCH_BLOGS, { author, page });
        let blogs = data.blogs;
        let formatedData = await filterPaginationData({
            state: blogsState,
            data: blogs,
            page,
            countRoute: SEARCH_BLOGS_COUNT,
            data_to_send: { author },
        })
        formatedData.user_id = author;
        res.blogs = formatedData;
        res.success = true;
        console.log("(function getUserBlogs)SEARCH_BLOGS API RESPONSE...", data)
    } catch (err) {
        res.success = false;
        res.blogs = {};
        console.log("(function getUserBlogs)SEARCH_BLOGS API ERROR...", err)
    }
    return res;
}

export const changePassword = async (formdata,access_token) => {
    let res = {};

    try {
        let response = await axios.post(CHANGE_PASSWORD,formdata,
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
        console.log("CHANGE_PASSWORD API RESPONSE...", response.data);
        res.success = true;
    } catch (err) {
        res.success = false;
        res.message=err.response.data.message;
        console.log("CHANGE_PASSWORD API ERROR...", err)
    }
    return res
}

export const updateUserProfileImg = async (url,access_token) => {
    let res = {};

    try {
        let response = await axios.post(UPDATE_PROFILE_IMG,{url},
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
        console.log("UPDATE_PROFILE_IMG API RESPONSE...", response.data);
        res.success = true;
        res.profileImgUrl=response.data.ProfileImg_url;
    } catch (err) {
        res.success = false;
        res.profileUrl="";
        console.log("UPDATE_PROFILE_IMG API ERROR...", err)
    }
    return res
}

export const updateUserProfile = async (username,bio,social_links,access_token) => {
    let res = {};

    try {
        let {data} = await axios.post(UPDATE_PROFILE,{username,bio,social_links},
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
        console.log("UPDATE_PROFILE API RESPONSE...", data);
        res.success = true;
        res.message=data.message;
        res.username=data.username;
    } catch (err) {
        res.success = false;
        res.message=err.response.data.message;
        console.log("UPDATE_PROFILE API ERROR...", err)
    }
    return res
}

export const checkNewNotification = async (access_token) => {
    let res = {};

    try {
        let {data} = await axios.post(NEW_NOTIFICATION,{},
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
        console.log("NEW_NOTIFICATION API RESPONSE...", data);
        res.success = true;
        res.new_notification_available=data.new_notification_available;
    } catch (err) {
        res.success = false;
        res.message=err.response.data.message;
        console.log("NEW_NOTIFICATION API ERROR...", err)
    }
    return res
}

export const getNotifications = async (access_token,skip,filter) => {
    let res = {};

    try {
        let {data} = await axios.post(GET_NOTIFICATIONS,{skip,filter},
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
        console.log("GET_NOTIFICATIONS API RESPONSE...", data);
        res.success = true;
        res.notificationsData=data.notifications;
        res.totalDocs=data.totalDocs;
    } catch (err) {
        res.success = false;
        res.message=err.response.data.message;
        console.log("GET_NOTIFICATIONS API ERROR...", err)
    }
    return res
}

export const NotificationsSeen = async (access_token,notifications_ids) => {
    let res = {};

    try {
        let {data} = await axios.post(NOTIFICATIONS_SEEN,{notifications_ids},
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
        console.log("NOTIFICATIONS_SEEN API RESPONSE...", data);
        res.success = true;
        res.message=data.message;
    } catch (err) {
        res.success = false;
        res.message=err.response.data.message;
        console.log("NOTIFICATIONS_SEEN API ERROR...", err)
    }
    return res
}

export const getUserManageBlogs = async (access_token,draft,skip) => {
    let res = {};

    try {
        let {data} = await axios.post(USER_BLOGS,{draft,skip},
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
        console.log("USER_BLOGS API RESPONSE...", data);
        res.success = true;
        res.blogs=data.blogs;
        res.totalDocs=data.totalDocs;
    } catch (err) {
        res.success = false;
        res.message=err.response.data.message;
        console.log("USER_BLOGS API ERROR...", err)
    }
    return res
}