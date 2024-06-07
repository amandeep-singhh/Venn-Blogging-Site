import React from 'react'
import { Link } from 'react-router-dom';
import NoDataMessage from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import Loader from './loader.component';

const UserCard = ({ users }) => {

    return (
        <>
            {
                users == null
                    ? <Loader />
                    : (
                        users.length
                            ? users.map((user, i) => {
                                let { personal_info: { fullname, username, profile_img } } = user;
                                return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }} >


                                    <Link to={`/user/${username}`} className='flex gap-5 items-center mb-5' >
                                        <img src={profile_img} className='w-14 h-14 rounded-full ' />
                                        <div>
                                            <h1 className='font-medium text-xl line-clamp-2 '>{fullname}</h1>
                                            <p className='text-dark-grey ' >@{username}</p>
                                        </div>
                                    </Link>

                                </AnimationWrapper>
                            })
                            : <NoDataMessage message="No User found" />
                    )
            }
        </>


    )
}

export default UserCard
