import React from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react'

const InPageNavigation = ({ routes, defaultHidden = [], defaultActiveIndex = 0, children }) => {
    let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
    let [width, setWidth] = useState(false);
    let [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
    let activeTabLineRef = useRef();
    let activeTabRef = useRef();

    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;
        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";

        setInPageNavIndex(i)
    }

    useEffect(() => {
        if (width > 766 && inPageNavIndex != defaultActiveIndex) {
            changePageState(activeTabRef.current, defaultActiveIndex);
        }

        if (!isResizeEventAdded) {
            window.addEventListener("resize", () => {
                if (!isResizeEventAdded) {
                    setIsResizeEventAdded(true);
                }
                setWidth(window.innerWidth);
            })
        }




    }, [width])

    useEffect(() => {
        changePageState(activeTabRef.current, defaultActiveIndex);
    }, [routes[0]])


    return (
        <>
            <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-auto '>
                {
                    routes.map((route, i) => {
                        return (
                            <button
                                ref={i == defaultActiveIndex ? activeTabRef : null}
                                key={i}
                                className={`p-4 px-5 capitalize ${inPageNavIndex == i ? " text-black" : " text-dark-grey "} ${defaultHidden.includes(route) ? "md:hidden" : ""}`}
                                onClick={(e) => { changePageState(e.target, i) }}>
                                {route}
                            </button>
                        )
                    })
                }
                <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300 border-black' />
            </div>
            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    )
}

export default InPageNavigation
