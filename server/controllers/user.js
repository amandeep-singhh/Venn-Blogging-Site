import User from "../Schema/User.js";
import Notification from "../Schema/Notification.js"
import bcrypt from 'bcrypt'
import Blog from "../Schema/Blog.js"


const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

export const searchUsers = (req, res) => {
    let { query } = req.body;
    User.find({ "personal_info.username": new RegExp(query, 'i') })
        .limit(50)
        .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .then(users => {
            return res.status(200).json({ users });
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: err })
        })
}

export const getProfile = (req, res) => {
    let { username } = req.body;
    User.findOne({ "personal_info.username": username })
        .select("-personal_info.password -google_auth -updatedAt -blogs")
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: err })
        })
}

export const changePassword = async (req, res) => {
    let { currentPassword, newPassword } = req.body;

    if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
        return res.status(403).json({ error: "Password should be 6 to 20 characters long with 1 numeric , 1 lowercase and 1 uppercase letters" })
    }
    try {
        let user = await User.findOne({ _id: req.user });
        bcrypt.compare(currentPassword, user.personal_info.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err, message: "Error occured while updating password" })
            }
            if (!result) {
                return res.status(403).json({ message: "Incorrect current password" })
            }
            bcrypt.hash(newPassword, 10, async (err, hashed_password) => {
                await User.findOneAndUpdate({ _id: req.user }, { "personal_info.password": hashed_password })
                return res.status(200).json({ status: "Password Changed" })
            })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err, message: "Error occured while updating password" })
    }

}

export const updateProfileImg = async (req, res) => {
    let { url } = req.body;
    try {
        await User.findOneAndUpdate({ _id: req.user }, { "personal_info.profile_img": url });

        return res.status(200).json({ message: "Profile Image Updated", ProfileImg_url: url });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err, message: "Error occured while updating profile picture" })
    }


}

export const updateProfile = async (req, res) => {
    let { username, bio, social_links } = req.body;
    console.log("username:", username)
    console.log("bio", bio)
    console.log("social_links", social_links)
    let bioCharLimit = 150;
    if (username.length < 3) {
        return res.status(403).json({ message: "Username should be at least 3 letters long" })
    }
    if (bio.length > bioCharLimit) {
        return res.status(403).json({ message: `Bio should not be more than ${bioCharLimit} characters` })
    }

    let socialLinksArr = Object.keys(social_links)

    try {
        for (let i = 0; i < socialLinksArr.length; i++) {
            if (social_links[socialLinksArr[i]].length) {
                let hostname = new URL(social_links[socialLinksArr[i]]).hostname;
                if (!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != 'website') {
                    return res.status(500).json({ message: `${socialLinksArr[i]} link is invalid` })
                }
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err, message: "You must provide full social links with https(s) included" })
    }

    let updateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    };

    try {
        await User.findOneAndUpdate({ _id: req.user }, updateObj, { runValidators: true });
        return res.status(200).json({ username, message: "Profile Updated successfully" })

    } catch (err) {
        if (err.code == 11000) {
            return res.status(409).json({ error: err, message: "Username already exists" })
        }
        console.log(err)
        return res.status(500).json({ error: err, message: "Error occurred while updating Profile" })
    }

}

export const checkNewNotification = async (req, res) => {
    let user_id = req.user;
    try {
        let result = await Notification.exists({ notification_for: user_id, seen: false, user: { $ne: user_id } })
        if (result) {
            return res.status(200).json({ new_notification_available: true });
        } else {
            return res.status(200).json({ new_notification_available: false });
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err, message: "Error occurred while checking for notifications" })
    }
}

export const getNotifications = async (req, res) => {
    let user_id = req.user;
    let { filter, deletedDocCount, skip } = req.body;
    let maxLimit = 5;
    let findQuery = {
        notification_for: user_id,
        user: { $ne: user_id }
    };
    // let skipDocs = (page - 1) * maxLimit;
    let skipDocs = skip

    if (filter != 'all') {
        findQuery.type = filter;
    }

    if (deletedDocCount) {
        skipDocs -= deletedDocCount;
    }
    try {
        let notifications = await Notification.find(findQuery)
            .skip(skipDocs)
            .limit(maxLimit)
            .populate({ path: "blog", select: "title blog_id", populate: { path: "author", select: "_id" } })
            .populate("user", "personal_info.fullname personal_info.username personal_info.profile_img")
            .populate("comment", "comment isReply parent")
            .populate("replied_on_comment", "comment")
            .populate("reply", "comment")
            .sort({ createdAt: -1 })
            .select("createdAt type seen reply")

        let totalDocs = await Notification.countDocuments(findQuery)

        return res.status(200).json({ notifications, totalDocs })


    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err, message: "Error occurred while fetching notifications" })
    }

}

export const NotificationsSeen = async (req, res) => {
    let { notifications_ids } = req.body;
    try {
        notifications_ids.map(async (noti) => {
            await Notification.findOneAndUpdate({ _id: noti }, { seen: true }, { new: true });
        });

        return res.status(200).json({ message: "Notifications marked as seen" })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err, message: "Error occurred while updating notifications as seen" })
    }
}

export const getUserBlogs = async (req, res) => {
    let user_id = req.user;
    let { draft, skip } = req.body;
    const maxLimit = 5;

    try {
        let blogs = await Blog.find({ author: user_id, draft })
            .skip(skip)
            .limit(maxLimit)
            .sort({ publishedAt: -1 })
            .select("title banner publishedAt blog_id activity desc draft content tags");

        let totalDocs = await Blog.countDocuments({ author: user_id, draft })

        return res.status(200).json({ blogs, totalDocs })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err, message: "Error occurred while fetching User Blogs" })
    }


}