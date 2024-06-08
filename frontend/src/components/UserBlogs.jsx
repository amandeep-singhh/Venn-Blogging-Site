import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserManageBlogs } from '../../services/operations/userAPI'
import { useSelector } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'
import Loader from './loader.component'
import NoDataMessage from './nodata.component'
import AnimationWrapper from '../common/page-animation'
import Modal from '../common/Modal'
import { deleteBlog } from '../../services/operations/blogAPI'
import LoaderTwo from '../common/LoaderTwo'
import UserBlogsCard from './UserBlogsCard'

const UserBlogs = ({ blogType }) => {
    const { user } = useSelector(state => state.auth);
    const access_token = user?.access_token;

    let [blogsArr, setBlogsArr] = useState(null);
    let [totalBlogs, setTotalBlogs] = useState();
    let [modalVisible, setModalVisible] = useState(false);
    let [blogIdToDelete, setBlogIdToDelete] = useState(null);
    let [loading, setLoading] = useState(false);

    const fetchUserBlogs = async (skip = 0, loadMore = false) => {
        let { success, blogs, message, totalDocs } = await getUserManageBlogs(access_token, blogType == "draft" ? true : false, skip);
        if (success) {
            //if this function is called by useEffect not by clicking Load more
            if (!loadMore) {
                setBlogsArr(blogs);
                setTotalBlogs(totalDocs)
            }
            //if loadmore btn is clicked
            else {
                setBlogsArr(blogsArr.concat(blogs));
            }
        } else {
            setBlogsArr([]);
            toast.error(message);
        }
    }

    const handleDeleteBlog = async (blog_id) => {
        setLoading(true);
        let { success, message } = await deleteBlog(access_token, blog_id);
        setLoading(false)
        if (success) {
            toast.success(message);

            let newBlogsArr = blogsArr
            const index = newBlogsArr.findIndex(blog => blog._id == blog_id);
            newBlogsArr.splice(index, 1)
            setBlogsArr(newBlogsArr)

        } else {
            toast.error(message);
        }


    }


    useEffect(() => {
        setBlogsArr(null)
        fetchUserBlogs();
    }, [blogType])
    return (
        <div className='flex flex-col gap-6 w-full '>
            <Toaster />
            {
                blogsArr == null ?
                    <Loader /> :
                    <>
                        {
                            !blogsArr?.length ?
                                <NoDataMessage message={"You have written no Blogs"} /> :
                                blogsArr.map((blog, i) => {
                                    return <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                                        <UserBlogsCard blogData={blog} setModalVisible={setModalVisible} setBlogIdToDelete={setBlogIdToDelete} blogType={blogType} />
                                    </AnimationWrapper>
                                })
                        }
                        {
                            totalBlogs > blogsArr?.length ?
                                <button
                                    onClick={() => fetchUserBlogs(blogsArr?.length, true)}
                                    className='text-blue-600 font-medium border-2 border-blue-600 p-2 px-3 hover:bg-blue-50 hover:scale-[1.05]  rounded-full  mx-auto '>
                                    Load more
                                </button>
                                : ""
                        }
                    </>
            }
            {
                modalVisible &&
                <Modal setVisible={setModalVisible} btn={"Delete"} statement={"Are you sure you want to delete this Blog?"} btnFun={handleDeleteBlog} paramsForFunc={blogIdToDelete} />

            }
            {
                loading && <LoaderTwo />
            }

        </div>
    )
}

export default UserBlogs
