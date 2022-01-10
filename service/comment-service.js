const PostModel = require('../models/Post');
const User = require("../models/User");
const CommentModel = require("../models/Comment");
// const router = require("express").Router();
// const ApiError = require('../exceptions/api-error');

class CommentService {
    async getAllCommentS() {
        const comments = await CommentModel.find();
        return comments;
    }











    async updPost(id, bodyOfPost) {
        const post = await PostModel.findById(id);
        if (post.userId === bodyOfPost.userId) {
            await post.updateOne({ $set: bodyOfPost });
            return res.status(200).json("the post has been updated");
        } else {
            res.status(403).json("you can update only your post");
        }
    };

    async removePost(id, bodyOfPost) {

        const post = await PostModel.findById(id);
        if (post.userId === bodyOfPost.userId) {
            await post.deleteOne();
            return res.status(200).json("the post has been deleted");
        } else {
            return res.status(403).json("you can delete only your post");
        }
    };

    async likePost (bodyOfPost) {
        console.log('=============bodyOfPost================',bodyOfPost)
        const post = await PostModel.findById(bodyOfPost._id);
        // if (!post.likes.includes(bodyOfPost.userId)) {
        if (!post.likes.includes(bodyOfPost.currentId)) {
            console.log(1)
            await post.updateOne({ $push: { likes: bodyOfPost.currentId } });
            return post
        } else {
            console.log(2)
            await post.updateOne({ $pull: { likes: bodyOfPost.currentId } });
            return  post
        }
    };
    //get a post
    async printPost (id)  {
        const post = await PostModel.findById(id);
        return res.status(200).json(post);
    };

    //get timeline posts

    async printPostTimeline(userId) {
        const currentUser = await User.findById(userId);
        const userPosts = await PostModel.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return PostModel.find({ userId: friendId });
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts));
    };


    async printPostAll (username) {
        const user = await User.findOne({ username: username });
        const posts = await PostModel.find({ userId: user._id });
        return res.status(200).json(posts);
    };
}

module.exports = new CommentService();
