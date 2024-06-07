import React from 'react'

const List = ({style,items}) => {
  return (
    <ol className={`pl-5 ${style=="ordered"?" list-decimal ":" list-disc"} ml-5 `}>
      {
        items.map((listItem,i)=>(
                <li key={i} className='my-4' dangerouslySetInnerHTML={{__html:listItem}} ></li>
        ))
      }
    </ol>
  )
}

export default List
