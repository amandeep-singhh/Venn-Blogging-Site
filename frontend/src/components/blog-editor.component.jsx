import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import logo from "../imgs/LOGO.png"
import AnimationWrapper from '../common/page-animation'
import defaultBanner from '../imgs/blog banner.png'
import { uploadImage } from '../common/aws'
import { useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { resetBlogState, setBanner, setContent, setDesc, setEditorState, setTags, setTextEditor, setTitle } from '../../redux/slices/blogSlice'
import { useEffect } from 'react'
import EditorJS from '@editorjs/editorjs'
import tools from './tools.component.jsx'
import { publishBlog } from '../../services/operations/blogAPI.js'


const BlogEditor = () => {

    let urlParam = useParams();

    let { title, banner, content, tags, desc, author, textEditor } = useSelector((state) => state.blog);
    const currentBlog = useSelector((state) => state.currentBlog);
    const { user } = useSelector((state) => state.auth);
    const token = user?.access_token;
    const dispatch = useDispatch();
    let navigate = useNavigate();

    useEffect(() => {
        //in case when user is viewing a blog and then clicks on edit . In that case url will contain blog_id
        if (urlParam?.blog_id) {
            dispatch(setBanner(currentBlog.banner));
            dispatch(setTitle(currentBlog.title));
            dispatch(setContent(currentBlog.content));
            dispatch(setTags(currentBlog.tags));
            dispatch(setDesc(currentBlog.desc));
        }else{
            //if the user is clicking "write" to write a blog we need to clear already present banner and title 
            dispatch(resetBlogState())
        }
        dispatch(setTextEditor(new EditorJS({
            holder: "textEditor",
            data: urlParam?.blog_id ? currentBlog.content[0] : content,
            tools: tools,
            placeholder: "Write a great blog!"
        })))
    }, [])

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13)//enter key
        {
            e.preventDefault();
        }
    }
    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
        dispatch(setTitle(input.value))
    }



    const handleBannerUpload = (e) => {
        let img = e.target.files[0];

        if (img) {
            let loadingToast = toast.loading("uploading...")
            uploadImage(img)
                .then((url) => {
                    if (url) {
                        toast.dismiss(loadingToast)
                        toast.success("Uploaded")
                        // blogBannerRef.current.src = url;
                        dispatch(setBanner(url))
                    }
                })
                .catch((err) => {
                    toast.dismiss(loadingToast);
                    return toast.error(err)
                })
        }
    }

    const handlePublishEvent = () => {

        if (!banner.length) {
            return toast.error("Upload a blog banner to publish it")
        }
        if (!title.length) {
            return toast.error("Write a blog title to publish it")
        }
        if (textEditor.isReady) {
            textEditor.save()
                .then(data => {
                    if (data.blocks.length) {
                        dispatch(setContent(data));
                        dispatch(setEditorState("publish"));
                    } else {
                        return toast.error("Write something in your blog to publish it")
                    }
                })
                .catch(err => {
                    console.log("Text Editor error: ", err);
                })
        }

    }

    const handleSaveDraft = (e) => {
        if (e.target.className.includes("disable")) {
            return
        }
        if (!title.length) {
            return toast.error("Please write a title for your blog to save as a Draft");
        }

        const loadingToast = toast.loading("Saving Draft...");

        e.target.classList.add('disable')

        if (textEditor.isReady) {
            textEditor.save()
                .then(content => {
                    let blogData = {
                        title,
                        banner,
                        desc,
                        content,
                        tags,
                        draft: true
                    }
                    
                    const { success } = publishBlog({...blogData,id:urlParam?.blog_id}, token);
                    if (success) {
                        e.target.classList.remove('disable');
                        toast.dismiss(loadingToast);
                        toast.success("Saved 👍🏼");

                        setTimeout(() => {
                            navigate("/")
                        }, 500)

                    } else {
                        e.target.classList.remove('disable');
                        toast.dismiss(loadingToast);
                        toast.success("Something went wrong 😓");
                    }

                })
                .catch(err => {
                    console.log("Text Editor error: ", err);
                })
        }


    }

    return (
        <>
            <nav className='navbar'>
                <Link to="/" className="flex-none w-[5rem] ">
                    <img src={logo} />
                </Link>
                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    {title.length ? title : "New Blog"}

                </p>

                <div className='flex gap-4 ml-auto '>
                    <button className='btn-dark py-2'
                        onClick={handlePublishEvent}>
                        Publish
                    </button>
                    <button
                        className='btn-light py-2'
                        onClick={handleSaveDraft}>
                        Save Draft
                    </button>
                </div>
            </nav>
            <Toaster />
            <AnimationWrapper>
                <section>
                    <div className='mx-auto max-w-[900p] w-full '>
                        <div className='relative aspect-video bg-white hover:opacity-80  border-2 border-gray-300 hover:border-gray-200 rounded-md'>
                            <label htmlFor="uploadBanner">
                                <img
                                    src={banner ? banner : defaultBanner}
                                    className='z-20 rounded-md ' />
                                <input id='uploadBanner'
                                    type='file'
                                    accept='.png, .jpg, .jpeg'
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>
                        <textarea
                            defaultValue={urlParam?.blog_id ? currentBlog?.title:(title?"":title)}
                            placeholder="Blog Title"
                            className='text-4xl font-medium w-full h-20 outline outline-gray-300 px-3 py-2 rounded-md resize-none mt-10 leading-tight placeholder:opacity-40 '
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}>
                        </textarea>
                        <hr className='w-full opacity-10 my-5 ' />

                        <div id='textEditor'
                            className='font-gelasio outline outline-gray-300 px-3 py-2 rounded-md'>

                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </>

    )
}

export default BlogEditor
