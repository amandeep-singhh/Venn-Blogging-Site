import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InPageNavigation from '../components/inpage-navigation.component';
import NoDataMessage from '../components/nodata.component';
import LoadMoreDataBtn from '../components/load-more.component';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import BlogPostCard from '../components/blog-post.component';
import { searchBlogs } from '../../services/operations/blogAPI';
import toast, { Toaster } from 'react-hot-toast';
import UserCard from '../components/usercard.component';
import { getUsers } from '../../services/operations/userAPI';

const SearchPage = () => {
    let { query } = useParams();
    let [blogs, setBlogs] = useState(null);
    let [users, setUsers] = useState(null);

    const fetchSearchBlogs = async (page = 1, create_new_arr = false) => {
        let { success, blogs: BLOGS } = await searchBlogs(blogs, query, page, create_new_arr);

        setBlogs(BLOGS);
        if (!success) {
            toast.error("Something went wrong 😓")
        }
    }

    const resetState = () => {
        setBlogs(null);
        setUsers(null);
    }

    const fetchUsers = async () => {
        let { success, users } = await getUsers(query);
        setUsers(users);
        if (!success) {
            toast.error("Something went wrong 😓")
        }
    }

    useEffect(() => {
        resetState();
        fetchSearchBlogs(1, true);
        fetchUsers();
    }, [query])

    return (
        <section className='h-cover flex justify-center gap-10 '>
            <Toaster />
            <div className='w-full '>
                <InPageNavigation routes={[`Search results for "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}  >
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
                        <LoadMoreDataBtn fetchDataFun={fetchSearchBlogs} state={blogs} />
                    </>

                    <><UserCard users={users} />
                        {/* {
                            users==null
                            ?<Loader/>
                            :(
                                users.length
                                ?users.map((user,i)=>{
                                    return <AnimationWrapper key={i} transition={{duration:1,delay:i*0.08}} >
                                        <UserCard user={user} />
                                    </AnimationWrapper>
                                })
                                :<NoDataMessage message="No User found" />
                            )
                        } */}
                    </>

                </InPageNavigation>
            </div>

            <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden  '>
                <h1 className='font-medium text-xl mb-8  '>Users related to search <i className="fi fi-rr-user mt-1"></i></h1>
                <UserCard users={users} />
            </div>

        </section>
    )
}

export default SearchPage
