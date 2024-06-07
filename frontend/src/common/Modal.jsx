import React, { useEffect, useRef, useState } from 'react'

const Modal = ({ setVisible, statement, btn, btnFun, paramsForFunc }) => {

    let outsideDiv = useRef();
    let [scale, setScale] = useState(0);

    const closeModal = (e) => {
        if (e.target == outsideDiv.current) {
            setVisible(false)
        }
    }

    useEffect(() => {
        setScale(1);
        const html = document.querySelector("html");
        html.style.overflowY = "hidden";
        return () => {
            html.style.overflowY = "auto";
        }
    }, [])

    return (
        <div
            onClick={closeModal}
            ref={outsideDiv}
            className='fixed inset-0 bg-black/75 flex items-center justify-center '>

            <div className={`max-w-[450px]  bg-white flex flex-col gap-8  rounded-lg p-5 scale-${scale} duration-300`}>
                <p className='text-2xl' >{statement}</p>

                <div className='flex justify-between mx-12'>
                    <button
                        onClick={() => {
                            btnFun(paramsForFunc)
                            setVisible(false)
                        }}
                        className='text-xl font-medium bg-rose-700 text-white px-5 py-2 rounded-full hover:bg-rose-800 '>
                        {btn}
                    </button>
                    <button
                        onClick={() => setVisible(false)}
                        className='text-xl font-medium bg-gray-500 text-white px-5 py-2 rounded-full hover:bg-gray-600'>
                        Cancel
                    </button>
                </div>

            </div>

        </div>
    )
}

export default Modal
