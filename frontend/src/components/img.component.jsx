import React from 'react'

const Img = ({url,caption}) => {
  return (
    <div>
      <img src={url} className='rounded-md' />
      {caption.length&&
      <p className='w-full text-center my-3 md:12 text-base text-dark-grey ' >{caption}</p>}
    </div>
  )
}

export default Img
