const BASE_URL=import.meta.env.VITE_SERVER_DOMAIN;

const authEndpoints={
    SIGNIN_API:BASE_URL+"/signin",
    SIGNUP_API:BASE_URL+"/signup",
}

const blogEndpoints={
    IMG_UPLOAD:BASE_URL+"/get-upload-url",
    CREATE_BLOG:BASE_URL+"/create-blog",
    LATEST_BLOGS:BASE_URL+"/latest-blogs",
    TRENDING_BLOGS:BASE_URL+"/trending-blogs",
    SEARCH_BLOGS:BASE_URL+"/search-blogs",
    GET_CATEGORIES:BASE_URL+"/get-categories",
    ALL_BLOGS_COUNT:BASE_URL+"/all-latest-blogs-count",
    SEARCH_BLOGS_COUNT:BASE_URL+"/search-blogs-count",
    GET_BLOG:BASE_URL+"/get-blog",
    LIKE_BLOG:BASE_URL+"/like-blog",
    IS_LIKED_BY_USER:BASE_URL+"/isliked-by-user",
    ADD_COMMENT:BASE_URL+"/add-comment",
    GET_BLOG_COMMENT:BASE_URL+"/get-blog-comment",
    DELETE_COMMENT:BASE_URL+"/delete-comment",
    DELETE_BLOG:BASE_URL+"/delete-blog",
}

const UserEndpoints={
    SEARCH_USERS:BASE_URL+"/search-Users",
    GET_PROFILE:BASE_URL+"/get-profile",
    CHANGE_PASSWORD:BASE_URL+"/change-password",
    UPDATE_PROFILE_IMG:BASE_URL+"/update-profile-img",
    UPDATE_PROFILE:BASE_URL+"/update-profile",
    NEW_NOTIFICATION:BASE_URL+"/new-notification",
    GET_NOTIFICATIONS:BASE_URL+"/notifications",
    NOTIFICATIONS_SEEN:BASE_URL+"/notifications-seen",
    USER_BLOGS:BASE_URL+"/user-blogs",
}

export {authEndpoints,blogEndpoints,UserEndpoints}