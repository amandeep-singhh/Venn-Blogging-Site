import { nanoid } from "nanoid";
import { generateUploadURL } from "../AWS/awsConfig.js"
import Blog from "../Schema/Blog.js"
import Notification from "../Schema/Notification.js"
import Comment from "../Schema/Comment.js"
import User from "../Schema/User.js";
import Tags from "../Schema/Tags.js";

const uploadImage = (req, res) => {
    generateUploadURL()
        .then(url => {
            res.status(200).json({ uploadURL: url })
        })
        .catch(err => {
            console.log("error: ", err.message);
            return res.status(500).json({ error: err.message })
        })
}

const addToTags = async (tags) => {
    tags.map(async (tag) => {
        try {
            const alreadyExits = await Tags.findOne({ tag });
            if (!alreadyExits) {
                await Tags.create({ tag })
            }
        } catch (err) {
            console.log("error while adding in tags schema:", err);
            return res.status(500).json({ error: "Something went wrong please try again" })
        }

    })
}

const createBlog = (req, res) => {
    let authorId = req.user;
    let { title, desc, banner, tags, content, draft, id } = req.body;

    if (!title.length) {
        return res.status(403).json({ error: "Title is missing" });
    }

    if (!draft) {
        if (!desc.length) {
            return res.status(403).json({ error: "Description is missing" });
        }
        if (!banner.length) {
            return res.status(403).json({ error: "Banner is missing" });
        }
        if (!content.blocks.length) {
            return res.status(403).json({ error: "Content is missing" });
        }
        if (!tags.length) {
            return res.status(403).json({ error: "Tags are missing" });
        }
    }


    tags = tags.map(tag => tag.toLowerCase());

    let blog_id = id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();

    if (id) {
        Blog.findOneAndUpdate({ blog_id }, { title, desc, banner, content, tags, draft: draft ? draft : false })
            .then(() => {
                return res.status(200).json({ id: blog_id });
            })
            .catch((err) => {
                return res.status(500).json({ error: err.message });
            })
    } else {
        let blog = new Blog({
            title,
            desc,
            banner,
            content,
            tags,
            author: authorId,
            blog_id,
            draft: Boolean(draft)
        });

        addToTags(tags);


        blog.save()
            .then(blog => {
                let incrementVal = draft ? 0 : 1;
                User.findOneAndUpdate(
                    { _id: authorId },
                    {
                        $inc: { "account_info.total_posts": incrementVal },
                        $push: { "blogs": blog._id }
                    })
                    .then(user => {
                        return res.status(200).json({ id: blog.blog_id })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(500).json({ error: "Failed to update total number of posts" })
                    })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message })
            })


    }




}

const latestBlogs = (req, res) => {
    let { page } = req.body;
    let maxLimit = 5;
    Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title desc banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(blogs => {
            return res.status(200).json({ blogs })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
}

const trendingBlogs = (req, res) => {
    Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select("blog_id title publishedAt -_id ")
        .limit(5)
        .then(blogs => {
            return res.status(200).json({ blogs })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
}

const searchBlogs = (req, res) => {
    let { tag, page, query, author, limit, eliminate_blog } = req.body;

    let findQuery;
    if (tag) {
        findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } };
    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') }
    } else if (author) {
        findQuery = { author, draft: false }
    }


    let maxLimit = limit ? limit : 2;
    Blog.find(findQuery)
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title desc banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(blogs => {
            // console.log("search results:",blogs)
            return res.status(200).json({ blogs })
        })
        .catch(err => {
            console.log("error: ", err)
            return res.status(500).json({ error: err.message })
        })
}

const getCategories = async (req, res) => {
    let categoryArray = []
    try {
        const categories = await Tags.find({}, { tag: true, _id: false });
        categories.map(category => {
            categoryArray.push(category.tag)
        })
        return res.status(200).json({ categoryArray });
    } catch (err) {
        console.log("error while getting Categories/Tags:", err);
        return res.status(500).json({ error: "Unable to get Categories" })
    }
}

const allLatestBogsCount = (req, res) => {
    Blog.countDocuments({ draft: false })
        .then(count => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: err })
        })
}

const searchBogsCount = (req, res) => {
    let { tag, query, author } = req.body;
    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false };
    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') }
    } else if (author) {
        findQuery = { author, draft: false }
    }


    Blog.countDocuments(findQuery)
        .then(count => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: err })
        })

}

const getBlog = (req, res) => {
    let { blog_id, draft, mode } = req.body;
    let incrementalValue = mode != 'edit' ? 1 : 0;
    // console.log("this is blog_id:", blog_id);
    Blog.findOneAndUpdate({ blog_id }, { $inc: { "activity.total_reads": incrementalValue } })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname ")
        .select("blog_id title desc banner activity tags publishedAt content")
        .then(async (blog) => {

            await User.findOneAndUpdate({ "personal_info.username": blog.author.personal_info.username }, { $inc: { "account_info.total_reads": incrementalValue } })
                .catch((err) => {

                    console.log("error: ", err)
                    return res.status(500).json({ error: err.message })
                })
            if (blog.draft && !draft) {
                return res.status(500).json({ error: "you can not access draft blog" })
            }
            return res.status(200).json({ blog })
        })
        .catch(err => {
            console.log("error: ", err)
            return res.status(500).json({ error: err.message })
        })
}

const likeBlog = (req, res) => {
    let user_id = req.user;
    let { _id, isLikedByUser } = req.body;

    let incrementalValue = isLikedByUser ? 1 : -1;

    //to prevent the user from liking same blog twice
    if (isLikedByUser) {
        User.find({ _id: user_id }).select("liked_blogs -_id")
            .then((response) => {

                let userAlreadyLiked = response[0].liked_blogs.includes(_id);
                if (userAlreadyLiked) {
                    return res.status(200).json({ message: "User is trying to like the same blog twice" })
                }

            })
            .catch(err => {
                console.log("error: ", err)
                return res.status(500).json({ error: err.message, message: "Error occured while checking whether user has already liked the blog or not" })
            })
    }
    else {
        //if user is unliking a blog which was never liked in the first place
        User.find({ _id: user_id }).select("liked_blogs -_id")
            .then((response) => {

                let userAlreadyLiked = response[0].liked_blogs.includes(_id);
                if (!userAlreadyLiked) {
                    return res.status(200).json({ message: "User is trying to un-like the same blog twice" })
                }

            })
            .catch(err => {
                console.log("error: ", err)
                return res.status(500).json({ error: err.message, message: "Error occured while checking whether user has already un-liked the blog or not" })
            })
    }

    Blog.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementalValue } })
        .then((blog) => {

            if (isLikedByUser) {
                User.findOneAndUpdate({ _id: user_id }, { $push: { "liked_blogs": _id } })
                    .then((response) => {

                        let like = new Notification({
                            type: "like",
                            blog: _id,
                            notification_for: blog.author,
                            user: user_id
                        })

                        like.save()
                            .catch(err => {
                                console.log("error: ", err)
                                return res.status(500).json({
                                    error: err.message,
                                    message: "Blog schema total likes are incremented and blog id pushed in user.liked_blogs but error occured during notification "
                                })
                            })

                        return res.status(200).json({ response, message: "user liked the blog" });

                    })
                    .catch(err => {
                        console.log("error: ", err)
                        return res.status(500).json({ error: err.message })
                    })

            } else {

                User.findOneAndUpdate({ _id: user_id }, { $pull: { "liked_blogs": _id } })
                    .then((response) => {

                        Notification.deleteOne({ blog: _id, user: user_id, type: "like" })
                            .catch(err => {
                                console.log("error: ", err)
                                return res.status(500).json({
                                    error: err.message,
                                    message: "Blog schema total likes are decremented and blog id pulled from user.liked_blogs but error occured during notification deletion"
                                })
                            })

                        return res.status(200).json({ response, message: "user un-liked the blog" });

                    })
                    .catch(err => {
                        console.log("error: ", err)
                        return res.status(500).json({ error: err.message })
                    })

            }
        })
        .catch(err => {
            console.log("error: ", err)
            return res.status(500).json({ error: err.message })
        })
}

const isLikedByUser = (req, res) => {
    let user_id = req.user;
    let { blog_id } = req.body;
    User.find({ _id: user_id }).select("liked_blogs -_id")
        .then((response) => {
            let islikedByUser = response[0].liked_blogs.includes(blog_id);
            return res.status(200).json({ islikedByUser })
        })
        .catch(err => {
            console.log("error: ", err)
            return res.status(500).json({ error: err.message })
        })
}

const addComment = (req, res) => {
    let user_id = req.user;
    let { _id, comment, replyig_to_comment, replying_to_user, isReply, blog_author, replyOfReply_Comment, reply_of_reply } = req.body;
    if (!comment.length) {
        return res.status(403).json({ error: "Write Something to leave a comment" });
    }
    if (!blog_author) {
        return res.status(403).json({ error: "Blog author is required" });
    }
    if (isReply) {
        if (!replyig_to_comment || !replying_to_user) {
            return res.status(403).json({ error: "Comment for which the reply is for is required as well as the comments author " });
        }
    }

    //creating a comment 
    let commentObj = new Comment({
        blog_id: _id,
        comment,
        commented_by: user_id,
        isReply: isReply,
        parent: replyig_to_comment,
        reply_of_reply
    });
    commentObj.save()
        .then((commentFile) => {
            console.log("commentFile: ", commentFile)
            let { comment, commentedAt, children, parent } = commentFile;

            Blog.findOneAndUpdate({ _id },
                {
                    $push: { "comments": commentFile._id },
                    $inc: {
                        "activity.total_comments": 1,
                        "activity.total_parent_comments": isReply ? 0 : 1
                    }
                })
                .then(blog => {
                    console.log('New Comment created');

                    if (isReply) {

                        Comment.findOneAndUpdate({ _id: replyig_to_comment },
                            {
                                $push: { "children": commentFile._id },
                            })
                            .then(() => {
                                console.log("Reply comment's id pushed in parent comment's children array")

                                let notificationObj = new Notification({
                                    type: "reply",
                                    blog: _id,
                                    notification_for: replying_to_user,
                                    user: user_id,
                                    comment: commentFile._id,
                                    replied_on_comment: replyOfReply_Comment ? replyOfReply_Comment : replyig_to_comment
                                });
                                notificationObj.save()
                                    .then(noti => {
                                        console.log("Noification sent to user that was being replied to")
                                    })
                                    .catch(err => {
                                        console.log("error: ", err)
                                        return res.status(500).json({ error: err.message })
                                    })
                            })

                    }
                    //if blog author and repying to user are same then two  notifications will be going to the same person.
                    //that means blog author commented on his own blog and then someone replied to his comment
                    //so user will get two similar notifications one for the comment on blog and one for the reply
                    //this conditon is to prevent that
                    if (blog_author != replying_to_user) {


                        let notificationObj = new Notification({
                            type: "comment",
                            blog: _id,
                            notification_for: blog_author,
                            user: user_id,
                            comment: commentFile._id,
                        })

                        notificationObj.save()
                            .then(noti => {
                                return res.status(200).json({
                                    comment, commentedAt, _id: commentFile._id, user_id, children, isReply, parent
                                })
                            })
                            .catch(err => {
                                console.log("error: ", err)
                                return res.status(500).json({ error: err.message })
                            })
                    } else {
                        return res.status(200).json({
                            comment, commentedAt, _id: commentFile._id, user_id, children, isReply, parent
                        })
                    }


                })
                .catch(err => {
                    console.log("error: ", err)
                    return res.status(500).json({ error: err.message })
                })


        })
        .catch(err => {
            console.log("error: ", err)
            return res.status(500).json({ error: err.message })
        })
}

const getBlogComment = (req, res) => {
    let { blog_id, skip, isReply, parentCommentId } = req.body;
    let maxLimit = 5;
    let query = isReply ?
        {
            blog_id,
            isReply,
            parent: parentCommentId
        } :
        {
            blog_id,
            isReply
        }

    Comment.find(query)
        .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
        .skip(skip)
        .limit(maxLimit)
        .sort({
            "commentedAt": isReply ? 1 : -1
        })
        .then(comment => {
            return res.status(200).json({ comment })
        })
        .catch(err => {
            console.log("error: ", err)
            return res.status(500).json({ error: err.message })
        })
}

const deleteComment = async (req, res) => {
    let { commentId, isReply, blogId, parentId } = req.body;
    let childrenIds;
    try {
        //if its a parent comment
        if (!isReply) {
            const { children } = await Comment.findById(commentId).select("children -_id");
            childrenIds = children;

            children.map(async (childrenId) => {
                await Notification.deleteMany({ comment: childrenId });
                await Comment.deleteOne({ _id: childrenId });
            })
            console.log("children comments(replies) deleted from notification schema and Comments schema");
        }


        await Notification.deleteMany({ comment: commentId });
        console.log("comment/reply notification deleted");



        const deletedComment = await Comment.deleteOne({ _id: commentId });
        if (!isReply) {
            childrenIds.push(commentId);
            childrenIds.map(async (IdToDelete) => {

                await Blog.findOneAndUpdate({ _id: blogId }, {
                    $pull: { "comments": IdToDelete },
                    $inc: { "activity.total_comments": -1 }
                })

            })

            await Blog.findOneAndUpdate({ _id: blogId }, { $inc: { "activity.total_parent_comments": -1 } });

        } else {
            await Blog.findOneAndUpdate({ _id: blogId },
                {
                    $pull: { "comments": commentId },
                    $inc: {
                        "activity.total_comments": -1
                    }
                })

            await Comment.findOneAndUpdate({ _id: parentId }, {
                $pull: { children: commentId }
            })
        }

        return res.status(200).json({ deletedComment, message: `${commentId} deleted` })

    } catch (err) {
        console.log("error: ", err)
        return res.status(500).json({ error: err.message, message: "Unable to delete comment" })
    }
}

const deleteBlog = async (req, res) => {
    const user_id = req.user;
    let { blog_id } = req.body;

    try {
        let blogToDelete = await Blog.findById(blog_id);

        if (blogToDelete.author != user_id) {
            return res.status(403).json({ error: err.message, message: "You are not the author" });
        }

        await User.findByIdAndUpdate(blogToDelete.author,
            {
                $pull: { blogs: blog_id },
                $inc: { "account_info.total_posts": -1 }
            });

        await User.findOneAndUpdate(
            {
                liked_blogs: { "$in": [blog_id] }
            },
            {
                $pull: { liked_blogs: blog_id }
            });

        await Comment.deleteMany({ blog_id });
        await Notification.deleteMany({ blog: blog_id });
        await Blog.deleteOne({ _id: blog_id })

        return res.status(200).json({ message: "Blog deleted Successfully" });



    } catch (err) {
        console.log("error: ", err)
        return res.status(500).json({ error: err.message, message: "Unable to delete Blog" })
    }

}

export { uploadImage, createBlog, latestBlogs, trendingBlogs, searchBlogs, getCategories, allLatestBogsCount, searchBogsCount, getBlog, likeBlog, isLikedByUser, addComment, getBlogComment, deleteComment, deleteBlog }