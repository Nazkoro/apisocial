const postService = require('../service/post-service');
// const Post = require("../models/Post");
// const User = require("../models/User");
// const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');
const PostModel = require("../models/Post");

class PostController {
   
    async getPosts(req, res, next) {
        try {
            const posts = await postService.getAllPosts();
            return res.json(posts);
        } catch (e) {
            next(e);
        }
    }; 

     async createPost (req, res) {
         req.body.img = req.file.filename;
       console.log(req.body)
        try {
          const savedPost = await postService.addPost(req.body);
           return res.status(200).json(savedPost);
        }  catch (err) {
            res.status(500).json(err);
            // next(e);
        }
      };
  //update a post
  
  async updatePost (req, res) {
    try {
      const resultUpdPost = await postService.updPost(req.params.id, req.body)
      return resultUpdPost

    } catch (e) {
        next(e);
    //   res.status(500).json(err);
    }
  };
  //delete a post
  
    async deletePost (req, res)  {
    try {
        const resultDeltePost = await postService.removePost(req.params.id, req.body)
        return resultDeltePost

    } catch (e) {
        next(e);
    //   res.status(500).json(err);
    }
  };
  //like / dislike a post
  
   async likedPost (req, res)  {
    try {
        // const resultLikedPost = await postService.likePost(req.params.id, req.body)
        const resultLikedPost = await postService.likePost( req.body)
        // return  resultLikedPost
        return  res.status(200).json(resultLikedPost);

    } catch (err) {
        // next(e);
      res.status(500).json(err);
    }
  };
  //get a post
  
    async getPost (req, res)  {
    try {
      const post = await postService.printPost(req.params.id)
      return post
    } catch (err) {
        // next(e);
      res.status(500).json(err);
    }
  };
  
//   router.get("/posts", async (req, res)  {
//     try {
//       const posts = await Post.find()
//       res.status(200).json(posts);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });
  
  //get timeline posts
  
  async getTimelinePosts(req, res)  {
    try {
      const posts = await postService.printPostTimeline(req.params.userId)
      return posts
    } catch (e) {
        next(e);
    //   res.status(500).json(err);
    }
  };
  
  //get user's all posts
  
   async getUserAllPosts(req, res)  {
    try {
        const allPosts = await postService.printPostAll(req.params.username)
        return allPosts
    } catch (e) {
        next(e);
    //   res.status(500).json(err);
    }
  };

    
}


module.exports = new PostController();
