import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import blogSlice from "./slices/blogSlice";
import currentBlogSlice from "./slices/currentBlogSlice";

export const store=configureStore({
    reducer:{
        auth:authSlice,
        blog:blogSlice,
        currentBlog:currentBlogSlice
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['blog/setTextEditor'],
        // // Ignore these field paths in all actions
        // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // // Ignore these paths in the state
        ignoredPaths: ['blog.textEditor'],
      },
    })
})