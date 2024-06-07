import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NotificationsSeen, checkNewNotification, getNotifications } from '../../services/operations/userAPI';
import NotificationCard from '../components/notification-card.component';
import Loader from '../components/loader.component';
import toast, { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { setNewNotificationAvailable } from '../../redux/slices/authSlice';
import AnimationWrapper from '../common/page-animation';
import NoDataMessage from '../components/nodata.component';

const Notifications = () => {
    let filters = ['all', 'like', 'comment', 'reply'];
    const dispatch = useDispatch();

    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(null);
    const [totalNotifications, setTotalNotifications] = useState();


    const { user } = useSelector((state) => state.auth);
    const access_token = user?.access_token;

    const handleFilter = (filterName) => {
        setFilter(filterName);
        fetchNotifications(0, filterName);
    }

    const handleNewNotifications = async (notificationsData) => {
        let newNotifications_ids = []

        notificationsData.map(noti => {
            if (noti.seen == false) {
                newNotifications_ids.push(noti._id);
            }
        })
        if (newNotifications_ids?.length) {
            await NotificationsSeen(access_token, newNotifications_ids);
        }

        //to see if any more new notifications are still available
        //basis on which the red dot (on bell icon in nav bar) will be visible or not
        let { success, new_notification_available } = await checkNewNotification(access_token);
        if (success) {
            dispatch(setNewNotificationAvailable(new_notification_available))
        }


    }

    const fetchNotifications = async (skip = 0, filter = 'all', loadMore = false) => {
        let { message, notificationsData, success, totalDocs } = await getNotifications(access_token, skip, filter);
        if (success) {
            //if this function is called by useEffect not by clicking Load more
            if (!loadMore) {
                setTotalNotifications(totalDocs)
                setNotifications(notificationsData);
            }
            //if loadmore btn is clicked
            else {
                setNotifications(notifications.concat(notificationsData));
            }
            //marking the new notification as seen in backend
            if (notificationsData?.length) {
                handleNewNotifications(notificationsData);
            }


        } else {
            setNotifications([]);
            toast.error(message);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, [])


    return (
        access_token ?
            <div className='p-4 max-w-[750px] mx-auto '>
                <Toaster />
                <h1 className='text-4xl font-medium mb-6'>Notificatons</h1>
                <div className='mb-2 mt-7 mx-1  flex gap-5 '>
                    {
                        filters.map((filterName, i) => {
                            return <button
                                onClick={() => handleFilter(filterName)}
                                key={i}
                                className={`capitalize ${filter == filterName ? "rounded-sm px-2 font-medium" : "font-light text-gray-500"}`}>
                                {filterName}
                            </button>
                        })
                    }
                </div>
                <hr className='border-gray-300 mb-5' />
                <div className='w-full flex flex-col gap-2'>
                    {
                        notifications == null ?
                            <Loader /> :
                            <>
                                {
                                    !notifications?.length ?
                                        <NoDataMessage message={"No Notifications"} /> :
                                        notifications?.map((noti, i) => {
                                            return <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                                                <NotificationCard data={noti} />
                                            </AnimationWrapper>
                                        })
                                }
                                {
                                    totalNotifications > notifications?.length ?
                                        <button
                                            onClick={() => fetchNotifications(notifications?.length, filter, true)}
                                            className='text-blue-600 font-medium border-2 border-blue-600 p-2 px-3 hover:bg-blue-50 hover:scale-[1.05]  rounded-full flex items-center gap-2 self-center mx-auto mt-2'>
                                            Load more
                                        </button>
                                        : ""
                                }
                            </>


                    }


                </div>
            </div>
            : <Navigate to={"/signin"} />
    )
}

export default Notifications
