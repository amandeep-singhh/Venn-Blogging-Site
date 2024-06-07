import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const TabSwitch = ({firstTab,firstIcon,secondTab,secondIcon,firstRoute,secondRoute}) => {
    let page = location.pathname.split("/")[2];
    let [pageState, setPageState] = useState(page.replace("-", " "));
    let activeTabLine = useRef();


    useEffect(() => {

        let tab = document.getElementById(pageState);
        activeTabLine.current.style.width = (tab?.offsetWidth) + "px"
        activeTabLine.current.style.left = (tab?.offsetLeft) + "px"


    }, [pageState])

    return (
        <div className='flex flex-col gap-2'>
            <div className='relative flex  gap-6'>
                <Link
                    id={firstTab}
                    to={firstRoute}
                    onClick={(e) => setPageState(e.target.innerText.toLowerCase())}
                    className={`${pageState == firstTab ? "text-black font-medium" : "text-gray-500"} flex gap-2 px-2 items-center justify-center `}>
                    <i className={`fi fi-rr-${firstIcon}`}></i>
                    <p className='capitalize'>{firstTab}</p>
                </Link>

                <Link
                    id={secondTab}
                    to={secondRoute}
                    onClick={(e) => setPageState(e.target.innerText.toLowerCase())}
                    className={`${pageState == secondTab ? "text-black font-medium" : "text-gray-500"} flex gap-2 px-2 items-center justify-center`}>
                    <i className={`fi fi-rr-${secondIcon}`}></i>
                    <p className='capitalize'>{secondTab}</p>
                </Link>
            </div>
            <div className='relative w-full h-[1px] bg-gray-300'>
                <div ref={activeTabLine} className='absolute bottom-0  h-[2px] bg-black duration-300'></div>
            </div>
        </div>
    )
}

export default TabSwitch
