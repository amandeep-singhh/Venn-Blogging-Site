import React, { Children, useEffect, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation from '../components/inpage-navigation.component'
import { getBlogsByCategory, getCategories, getLatestBlog, getTrendingBlog } from '../../services/operations/blogAPI'
import Loader from '../components/loader.component'
import BlogPostCard from '../components/blog-post.component'
import MinimalBlogPost from '../components/nobanner-blog-post.component'
import toast, { Toaster } from 'react-hot-toast'
import NoDataMessage from '../components/nodata.component'
import LoadMoreDataBtn from '../components/load-more.component'

const Homepage = () => {

  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");
  let [categories, setCategories] = useState(null)
  const initialVisibleTags = 9;
  let [seeMore, setSeeMore] = useState(initialVisibleTags)

  const fetchLatestBlogs = async (page = 1) => {
    let { success, blogs: BLOGS } = await getLatestBlog(blogs, page);
    setBlogs(BLOGS);
  
    if (!success) {
      toast.error("Something went wrong 😓")
    }
  }
  const fetchTrendingBlogs = async () => {
    let { success, blogs: BLOGS } = await getTrendingBlog();

    setTrendingBlogs(BLOGS);
    if (!success) {
      toast.error("Unable to get Trending Blogs 😓")
    }
  }

  const loadBlogByCategory = (e) => {

    let category = e.target.innerText.toLowerCase();
    // console.log("clicked ", category)
    setBlogs(null)
    if (pageState == category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  }

  const fetchBlogsByCategory = async (page = 1) => {
    let { success, blogs: BLOGS } = await getBlogsByCategory(blogs, pageState, page);

    setBlogs(BLOGS);
    if (!success) {
      toast.error("Something went wrong 😓")
    }
  }

  const fetchCategories = async () => {
    let { categories: TAGS, success } = await getCategories();
    setCategories(TAGS);
  
    if (!success) {
      toast.error("unable to get categories")
    }
  }

  const hideUnhideCategories = () => {
    if (seeMore >= categories?.length) {
      setSeeMore(initialVisibleTags)
    } else setSeeMore(seeMore + 5)
  }

  useEffect(() => {
    fetchCategories()
    if (pageState == "home") {
      fetchLatestBlogs();
    } else {
      fetchBlogsByCategory();
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState])

  return (
    <AnimationWrapper>
      <section className='h-cover flex justify-center gap-10'>
        <Toaster />
        {/* latest blogs */}
        <div className='w-full'>

          <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>
            <>
              {
                blogs == null
                  ? (<Loader />) :
                  (blogs.results.length
                    ? blogs.results.map((blog, i) => {
                      return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                        <BlogPostCard content={blog} author={blog.author.personal_info} />
                      </AnimationWrapper>
                    })
                    : <NoDataMessage message="No Blogs present" />
                  )
              }
              <LoadMoreDataBtn fetchDataFun={pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory} state={blogs} />
            </>
            {
              trendingBlogs == null
                ? <Loader /> : (
                  trendingBlogs.length
                    ? trendingBlogs.map((blog, i) => {
                      return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                        <MinimalBlogPost blog={blog} index={i} />
                      </AnimationWrapper>
                    })
                    : <NoDataMessage message={"No Trending Blogs"} />
                )
            }

          </InPageNavigation>

        </div>

        {/* filters and trending blogs */}
        <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden  '>
          <div className='flex flex-col gap-10 '>
            <div>
              <h1 className='font-medium text-xl mb-8 '>
                Stories from all intrests
              </h1>
              <div className='flex gap-3 flex-wrap '>
                {
                  categories == null
                    ? <Loader />
                    : categories.map((category, i) => {
                      return <button
                        onClick={loadBlogByCategory}
                        className={`tag ${pageState == category.toLowerCase() && "bg-black text-white "} ${seeMore < i && "hidden"}`} key={i}>
                        {category}
                      </button>
                    })
                }
                <button
                  onClick={hideUnhideCategories}
                  className='self-end text-sm font-medium text-blue-600 py-1 px-3 rounded-full outline outline-2 outline-blue-600 hover:bg-blue-600 hover:text-white hover:scale-[0.9]'>
                  {seeMore >= categories?.length ? "See less" : "See more"}
                </button>
              </div>
            </div>

            <div>
              <h1 className='font-medium text-xl mb-8 '>Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>
              {
                trendingBlogs == null
                  ? <Loader /> : (
                    trendingBlogs.length
                      ? trendingBlogs.map((blog, i) => {
                        return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * .1 }}>
                          <MinimalBlogPost blog={blog} index={i} />
                        </AnimationWrapper>
                      })
                      : <NoDataMessage message={"No Trending Blogs"} />
                  )
              }

            </div>
          </div>
        </div>

      </section>
    </AnimationWrapper>
  )
}

export default Homepage
