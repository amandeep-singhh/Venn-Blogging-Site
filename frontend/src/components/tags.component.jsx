import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeTag } from '../../redux/slices/blogSlice';

const Tag = ({tag}) => {
    const dispatch=useDispatch()
    return (
        <div className='relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:opacity-50 pr-10 '>
            <p className='outline-none'>{tag}</p>
            <button 
            className='mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2 '
            onClick={()=>dispatch(removeTag(tag))}>
            <i className="fi fi-br-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    )
}

export default Tag
