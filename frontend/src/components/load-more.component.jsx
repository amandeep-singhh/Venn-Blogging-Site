import React from 'react'

const LoadMoreDataBtn = ({ state, fetchDataFun,firstArgIsNotPage }) => {
 console.log("state: ",state)
 
  return (
    (state != null && state.totalDocs > state?.results?.length) &&
    <div className='w-full'>
      <button
        onClick={() => {
          let page = state.page + 1;
          if(firstArgIsNotPage){
            fetchDataFun(undefined,page)
          }else{
            fetchDataFun(page)
          }
          
        }
        }
        className='text-blue-600 font-medium border-2 border-blue-600 p-2 px-3 hover:bg-blue-50 hover:scale-[1.05]  rounded-full flex items-center gap-2 self-center mx-auto'>
        Load More
      </button>
    </div>

  )
}

export default LoadMoreDataBtn
