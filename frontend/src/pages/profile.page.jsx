import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getUserBlogs, getUserProfile } from '../../services/operations/userAPI';
import toast, { Toaster } from 'react-hot-toast';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import { useSelector } from 'react-redux';
import AboutUser from '../components/about.component';
import InPageNavigation from '../components/inpage-navigation.component';
import BlogPostCard from '../components/blog-post.component';
import LoadMoreDataBtn from '../components/load-more.component';
import MinimalBlogPost from '../components/nobanner-blog-post.component';
import NoDataMessage from '../components/nodata.component';
import PageNotFound from './404.page';

export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: "",
    },
    account_info: {
        total_posts: 0,
        total_reads: 0
    },
    social_links: {},
    joinedAt: ""
}

const ProfilePage = () => {
    let { id: profileId } = useParams();
    let [profile, setProfile] = useState(profileDataStructure);
    let [loading, setLoading] = useState(true);
    let [blogs, setBlogs] = useState(null);
    let [profileLoaded, setProfileLoaded] = useState("");

    const { user } = useSelector((state) => state.auth);
    const username = user?.username;

    let { personal_info: { fullname, username: profile_username, profile_img, bio },
        account_info: { total_posts, total_reads },
        social_links,
        joinedAt } = profile;

    const fetchUserProfile = async () => {
        let { success, user } = await getUserProfile(profileId);
        if (user != null) {
            setProfile(user);
        }
        setProfileLoaded(profileId)
        getBlogs(user?._id)

        if (!success) {
            toast.error("Something went wrong")
        }
        setLoading(false)
    }

    const getBlogs = async (user_id, page) => {
        user_id = user_id == undefined ? blogs?.user_id : user_id;

        let { success, blogs: BLOGS } = await getUserBlogs(blogs, user_id, page);
        setBlogs(BLOGS);

        if (!success) {
            toast.error("Something went wrong")
        }
    }

    const resetStates = () => {
        setProfile(profileDataStructure);
        setLoading(true)
        setProfileLoaded("")
    }

    useEffect(() => {
        if (profileId != profileLoaded) {
            setBlogs(null)
        }
        if (blogs == null) {
            resetStates();
            fetchUserProfile()
        }


    }, [profileId, blogs])
    return (
        <AnimationWrapper>
            <Toaster />
            {
                (loading) ? <Loader /> :
                    profile_username?.length ?
                        <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12  '>
                            <div className='flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky  md:top-[100px] md:py-10 '>
                                <img src={profile_img} className='w-48 aspect-square bg-grey rounded-full md:w-32 ' />
                                <h1 className='text-2xl font-medium'>@{profile_username}</h1>
                                <p className='text-xl capitalize h-6 '>{fullname}</p>
                                <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>
                                <div className='flex gap-4 mt-2 '>
                                    {
                                        profileId == username &&
                                        <Link to="/settings/edit-profile" className='btn-light rounded-md' >Edit Profile</Link>
                                    }

                                </div>
                                <AboutUser classname="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />
                            </div>

                            <div className='max-md:mt-12 w-full '>
                                <InPageNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]}>
                                    <>
                                        {
                                            blogs == null
                                                ? (<Loader />) :
                                                (blogs?.results?.length
                                                    ? blogs.results.map((blog, i) => {
                                                        return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                                                            <BlogPostCard content={blog} author={blog.author.personal_info} />
                                                        </AnimationWrapper>
                                                    })
                                                    : <NoDataMessage message="No Blogs present" />
                                                )
                                        }
                                        <LoadMoreDataBtn fetchDataFun={getBlogs} state={blogs} firstArgIsNotPage={true} />
                                    </>
                                    <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />

                                </InPageNavigation>
                            </div>
                        </section>
                        : <PageNotFound />
            }

        </AnimationWrapper>

    )
}

export default ProfilePage
