const PostModel = require('../models/Post');
const User = require("../models/User");
// const router = require("express").Router();
// const ApiError = require('../exceptions/api-error');

class PostService {
  
    async getAllPosts() {
        const posts = await PostModel.find();
        return posts;
    }

    
//create a post

 async addPost (bodyOfPost)  {
      const newPost = new PostModel(bodyOfPost);
      const savePost = await newPost.save();
      return savePost;
    //   res.status(200).json(savedPost);
     
    //   res.status(500).json(err);
  };
  //update a post
  
  async updPost(id, bodyOfPost) {
  
      const post = await PostModel.findById(id);
      if (post.userId === bodyOfPost.userId) {
        await post.updateOne({ $set: bodyOfPost });
       return res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
 
  };
  //delete a post
  
  async removePost(id, bodyOfPost) {
    
      const post = await PostModel.findById(id);
      if (post.userId === bodyOfPost.userId) {
        await post.deleteOne();
        return res.status(200).json("the post has been deleted");
      } else {
        return res.status(403).json("you can delete only your post");
      }
  };
  //like / dislike a post
  
  async likePost (id, bodyOfPost) {
    
      const post = await PostModel.findById(id);
      if (!post.likes.includes(bodyOfPost.userId)) {
        await post.updateOne({ $push: { likes: bodyOfPost.userId } });
        return res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: bodyOfPost.userId } });
        return  res.status(200).json("The post has been disliked");
      }
  };
  //get a post
  async printPost (id)  {
      const post = await PostModel.findById(id);
      return res.status(200).json(post);
  };
  
//   router.get("/posts", async (req, res) => {
//     try {
//       const posts = await PostModel.find()
//       res.status(200).json(posts);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });
  
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
  
  //get user's all posts
  
  async printPostAll (username) {
      const user = await User.findOne({ username: username });
      const posts = await PostModel.find({ userId: user._id });
      return res.status(200).json(posts);
  };
}

module.exports = new PostService();
