import React from 'react'
import AnimationWrapper from '../common/page-animation'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setDesc, setEditorState, setTags, setTitle } from '../../redux/slices/blogSlice'
import Tag from './tags.component'
import { publishBlog } from '../../services/operations/blogAPI'
import { useNavigate, useParams } from 'react-router-dom'

const PublishForm = () => {
  let urlParam = useParams();
  const { banner, title, tags, desc ,content} = useSelector((state) => state.blog);
  const { user} = useSelector((state) => state.auth);
  const token=user?.access_token;
  const dispatch = useDispatch();
  let characterLimit = 200;
  let tagsLimit = 10;
  let navigate=useNavigate();

  const handleCloseEvent = () => {
    dispatch(setEditorState("editor"))
  }

  const handleBlogTitleChange = (e) => {
    let input = e.target;
    dispatch(setTitle(input.value))
  }
  const handleBlogDescChange = (e) => {
    let input = e.target;
    dispatch(setDesc(input.value))
  }
  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13)//enter key
    {
      e.preventDefault();
    }
  }
  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188)//enter key or comma
    {
      e.preventDefault();
      let tag=e.target.value;
      if(tags.length<tagsLimit){
        if(!tags.includes(tag) && tag.length ){
          dispatch(setTags(tag))
        }
      }else{
        toast.error(`You can add maximum of ${tagsLimit} Tags`)
      }
      e.target.value="";
    }
  }

  const handlePublishBlog=(e)=>{
    if(e.target.className.includes("disable")){
      return
    }
    if(!title.length){
      return toast.error("Please write a title for your blog");
    }
    if(!desc.length || desc.length>characterLimit){
      return toast.error(`Please write a description under ${characterLimit} characters`);
    }
    if(!tags.length){
      return toast.error("Please enter atleast 1 Tag");
    }

    const loadingToast=toast.loading("Publishing...");

    e.target.classList.add('disable')

    let blogData={
      title,
      banner,
      desc,
      content,
      tags,
      draft:false
    }

    const {success}=publishBlog({...blogData,id:urlParam?.blog_id},token);
    if(success){
      e.target.classList.remove('disable');
      toast.dismiss(loadingToast);
      toast.success("Published 👍🏼");

      setTimeout(()=>{
        navigate("/")
      },500)

    }else{
      e.target.classList.remove('disable');
      toast.dismiss(loadingToast);
      toast.success("Something went wrong 😓");
    }

  }



  return (
    <AnimationWrapper>
      <section className='w-screen min-h-screen  grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
        <Toaster />
        <button
          className='w-21 h-12 absolute right-[5vw] z-10 top-[5%] '
          onClick={handleCloseEvent}>
          <i className="fi fi-br-cross"></i>
        </button>

        <div className='max-w-[550px] center '>
          <p className='text-dark-grey mb-1'>Preview</p>
          <div className='w-full aspect-video  rounded-lg overflow-hidden bg-grey mt-4 '>
            <img src={banner} />
          </div>
          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2 ' >{title}</h1>
          <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4 '>{desc}</p>
        </div>
        <div className='border-grey lg:border-1 lg:pl-8  '>
          <p className='text-dark-grey mb-2 mt-9 '>
            Blog Title
          </p>
          <input
            type="text"
            placeholder='Blog Title'
            defaultValue={title}
            className='input-box pl-4 '
            onChange={handleBlogTitleChange}
          />

          <p className='text-dark-grey mb-2 mt-9 '>
            Short Description about your blog
          </p>
          <textarea
            name="" id=""
            maxLength={characterLimit}
            defaultValue={desc}
            className='h-40 resize-none leading-7 input-box pl-4 '
            onChange={handleBlogDescChange}
            onKeyDown={handleTitleKeyDown}>
          </textarea>
          <p className='mt-1 text-dark-grey text-sm text-right '>{characterLimit - desc.length} characters left</p>
          <p className='text-dark-grey mb-2 mt-9 '>
            Topics - (Helps in searching and ranking your blog post)
          </p>

          <div className='relative input-box pl-2 py-2 pb-4 '>
            <input 
            type='text'
            placeholder='Topic'
            className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white '
              onKeyDown={handleKeyDown}
            />
            {
              tags.map((tag,i)=>{
                return <Tag tag={tag} key={i} />
              })
            }
          </div>
          <p className='mt-1 mb-4 text-dark-grey text-right text-sm'>{tagsLimit-tags.length} Tags left</p>
          <button 
          className='btn-dark px-8'
          onClick={handlePublishBlog}>
          Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default PublishForm
