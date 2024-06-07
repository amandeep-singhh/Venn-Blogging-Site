import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBlog, getComments, getSimilarBlogs } from '../../services/operations/blogAPI'
import toast, { Toaster } from 'react-hot-toast'
import AnimationWrapper from '../common/page-animation'
import Loader from '../components/loader.component'
import { getDay } from '../common/date'
import BlogInteraction from '../components/blog-interaction.component'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentBlogState } from '../../redux/slices/currentBlogSlice'
import BlogPostCard from '../components/blog-post.component'
import BlogContent from '../components/blog-content.component'
import CommentsContainer from '../components/comments.component'

export const blogStructure = {
    title: '',
    desc: '',
    content: [],
    author: { personal_info: {} },
    banner: '',
    publishedAt: ''
}

const BlogPage = () => {
    let { blog_id } = useParams();
    // let {totalParentCommentsLoaded}=useSelector(state=>state.currentBlog)

    let [blog, setBlog] = useState(blogStructure);
    let [similarBlogs, setSimilarBlogs] = useState(null);
    let [loading, setLoading] = useState(true);


    let { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = blog;
    const dispatch = useDispatch();

    const fetchBlog = async () => {
        let { success, blog } = await getBlog(blog_id);
        // console.log("clicked blog:", blog);

        let { success: getComments_Success, comments } = await getComments({blog_id:blog._id,isReply:false});
        blog.comments = comments
        if (!getComments_Success) {
            toast.error("unable to fetch Comments")
        }
        setBlog(blog)
        let similarBlogsRes = await getSimilarBlogs(blog.tags[0], 6, blog_id)
        setSimilarBlogs(similarBlogsRes.blogs);

        if (!similarBlogsRes.success) {
            toast.error("unable to fetch similar blogs");
        }

        if (success) {
            dispatch(setCurrentBlogState(blog));
        } else {
            toast.error("something went wrong");
        }
        setLoading(false)
    }

    const resetStates = () => {
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true)
    }

    useEffect(() => {
        resetStates();
        fetchBlog()
    }, [blog_id])

    return (
        <AnimationWrapper>
            <Toaster />
            {
                loading ? <Loader /> :
                    <>
                        <CommentsContainer />
                        <div className='max-w-[900px] center py-10 max-lg:px-[5vw]  '>
                            <img src={banner} className='aspect-video rounded-md' />
                            <div className='mt-12 '>
                                <h2 className=''>{title}</h2>
                                <div className='flex max-sm:flex-col justify-between my-8  '>
                                    <div className='flex gap-5 items-start '>
                                        <img src={profile_img} className='w-12 aspect-square rounded-full' />
                                        <p className='capitalize'>
                                            {fullname}
                                            <br />
                                            @<Link to={`/user/${author_username}`} className='underline'>{author_username}</Link>
                                        </p>
                                    </div>
                                    <p className='text-dark-grey/75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Published on {getDay(publishedAt)}</p>
                                </div>

                            </div>



                            {/* blog content */}
                            <div className='my-12 font-gelasio blog-page-content '>
                                {
                                    content[0].blocks.map((block, i) => {
                                        return <div key={i} className='my-4 md:my-8' >
                                            <BlogContent block={block} />
                                        </div>
                                    })
                                }
                            </div>

                            <BlogInteraction />

                            {
                                similarBlogs != null && similarBlogs.length ?
                                    <>
                                        <h1 className='text-2xl mt-14 mb-10 font-medium'>Similar Blogs</h1>
                                        {
                                            similarBlogs.map((blog, i) => {
                                                let { author: { personal_info } } = blog;
                                                return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }} >
                                                    <BlogPostCard content={blog} author={personal_info} />

                                                </AnimationWrapper>
                                            }
                                            )
                                        }
                                    </>
                                    : ""
                            }

                        </div>
                    </>

            }
        </AnimationWrapper>
    )
}

export default BlogPage
