import express from "express";
import { verifyJWT } from "../middleware/verification.js";
import { NotificationsSeen, changePassword, checkNewNotification, getNotifications, getProfile, getUserBlogs, searchUsers, updateProfile, updateProfileImg } from "../controllers/user.js";

const userRoutes = express.Router();

userRoutes.post('/search-users', searchUsers);
userRoutes.post('/get-profile', getProfile);
userRoutes.post('/change-password',verifyJWT, changePassword);
userRoutes.post('/update-profile-img',verifyJWT, updateProfileImg);
userRoutes.post('/update-profile',verifyJWT, updateProfile);
userRoutes.post('/new-notification',verifyJWT, checkNewNotification);
userRoutes.post('/notifications',verifyJWT, getNotifications);
userRoutes.post('/notifications-seen',verifyJWT, NotificationsSeen);
userRoutes.post('/user-blogs',verifyJWT, getUserBlogs);


export { userRoutes }