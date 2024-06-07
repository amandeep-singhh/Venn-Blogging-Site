import React from 'react'
import pageNotFoundImage from '../imgs/404.png'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center' >
      <img src={pageNotFoundImage} className='select-none border-2 border-grey w-72 aspect-square object-cover rounded-lg ' />
      <h1 className='text-4xl font-gelasio leading-7 ' >Page Not Found</h1>
      <p className='text-dark-grey text-xl leading-7 -mt-8  '>The page you are looking for does not exists.Go back to <Link to={'/'} className='underline text-blue-500'>home page</Link></p>
    </section>
  )
}

export default PageNotFound
