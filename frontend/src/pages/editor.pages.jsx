import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';


const Editor = () => {
    const { user } = useSelector((state) => state.auth);
    const {editorState}=useSelector((state)=>state.blog);


    return (
        !user?.access_token ?
            <Navigate to="/signup" />
            : editorState==="editor"?<BlogEditor/>:<PublishForm/>
  )
}

export default Editor
