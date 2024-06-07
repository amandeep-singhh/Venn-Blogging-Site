import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDay } from '../common/date';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import blogBanner from '../imgs/blog banner.png'
import { setCurrentBlogState } from '../../redux/slices/currentBlogSlice';
import BlogsCardStats from '../common/BlogsCardStats';

const UserBlogsCard = ({ blogData, setModalVisible, setBlogIdToDelete, blogType }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [showStats, setShowStats] = useState(false);
    let [scale, setScale] = useState(0);
    const {
        activity,
        banner,
        blog_id,
        publishedAt,
        title,
        _id,
        content,
        tags,
        desc
    } = blogData;
    const total_likes = activity?.total_likes;
    const total_comments = activity?.total_comments;
    const total_reads = activity?.total_reads;

    const handleDeleteClick = () => {
        setModalVisible(true);
        setBlogIdToDelete(_id);
    }

    const handleEdit = () => {

        let currentBlogObj = {
            title,
            banner,
            content,
            tags,
            desc,
        }

        dispatch(setCurrentBlogState(currentBlogObj));
        navigate(`/editor/${blog_id}`);

    }


    useEffect(() => {
        if (showStats) {
            setScale(1)
        } else {
            setScale(0)
        }
    }, [showStats])


    return (
        <div className='flex flex-col md:flex-row md:justify-between gap-9 border-b pb-4 border-gray-400'>
            <div className='flex  gap-3'>
                <img src={banner == "" ? blogBanner : banner} className='w-[150px] aspect-square rounded-lg' />

                <div className='flex flex-col justify-between '>

                    <div className='flex flex-col gap-3'>
                        {
                            blogType != "draft" ?
                                <Link to={`/blog/${blog_id}`} className='text-2xl line-clamp-2 font-medium hover:text-blue-700 hover:underline'>{title}</Link> :
                                <p className='text-2xl line-clamp-2 font-medium '>{title}</p>
                        }

                        <p className='text-gray-500'>{blogType != "draft" ? "Published on " : "Saved as draft on "}{getDay(publishedAt)}</p>
                    </div>

                    <div className='flex gap-3 '>
                        <button
                            onClick={handleEdit}
                            className=' hover:text-white hover:bg-blue-600 hover:scale-[1.1] bg-slate-300 px-4 rounded-lg font-medium  '>{blogType != "draft" ? "Edit" : "Publish"}</button>
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className={`md:hidden hover:text-white hover:bg-blue-600 hover:scale-[1.1] bg-slate-300 px-4 rounded-lg font-medium  ${showStats ? "bg-blue-600 text-white" : ""}`}>{showStats ? "Hide" : "Stats"}</button>
                        <button
                            onClick={handleDeleteClick}
                            className='hover:text-white hover:bg-rose-600 hover:scale-[1.1] bg-rose-400 px-4 rounded-lg font-medium ' >Delete</button>

                    </div>

                </div>
            </div>
            {
                blogType != "draft" && showStats &&
                <div className={`scale-${scale} md:hidden duration-300 flex mx-auto md:mx-0 py-3 md:h-32 my-auto`}>
                    <BlogsCardStats total_comments={total_comments} total_likes={total_likes} total_reads={total_reads} />

                </div>
            }

            {
                blogType != "draft" &&
                <div className={` hidden duration-300 md:flex mx-auto md:mx-0 py-3 md:h-32 my-auto`}>
                    <BlogsCardStats total_comments={total_comments} total_likes={total_likes} total_reads={total_reads} />
                </div>
            }


        </div>
    )
}

export default UserBlogsCard
