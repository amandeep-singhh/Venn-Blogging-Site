import express from "express";
import { addComment, allLatestBogsCount, createBlog, deleteBlog, deleteComment, getBlog, getBlogComment, getCategories, isLikedByUser, latestBlogs, likeBlog, searchBlogs, searchBogsCount, trendingBlogs, uploadImage } from "../controllers/blog.js";
import { verifyJWT } from "../middleware/verification.js";


const blogRoutes = express.Router();

blogRoutes.get('/get-upload-url', uploadImage);
blogRoutes.post('/create-blog', verifyJWT, createBlog);
blogRoutes.post('/latest-blogs', latestBlogs);
blogRoutes.get('/trending-blogs', trendingBlogs);
blogRoutes.post('/search-blogs', searchBlogs);
blogRoutes.get('/get-categories', getCategories);
blogRoutes.post('/all-latest-blogs-count', allLatestBogsCount);
blogRoutes.post('/search-blogs-count', searchBogsCount);
blogRoutes.post('/get-blog', getBlog);

blogRoutes.post('/like-blog', verifyJWT, likeBlog);
blogRoutes.post('/isliked-by-user', verifyJWT, isLikedByUser);

blogRoutes.post('/add-comment', verifyJWT, addComment);
blogRoutes.post('/get-blog-comment', getBlogComment);
blogRoutes.delete('/delete-comment', verifyJWT, deleteComment);
blogRoutes.delete('/delete-blog', verifyJWT, deleteBlog);


export { blogRoutes }