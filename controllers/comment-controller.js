const commentService = require('../service/comment-service');
const postService = require("../service/post-service");
// const ApiError = require('../exceptions/api-error');

class CommentController {

    async getComments(req, res) {
        console.log('0000000000000000000')
        try {
            console.log(1111111111111111111111)
         const comments = await commentService.getAllCommentS();
            console.log(2222222222222222222,comments)
            return res.json(comments);
        }  catch (err) {
            res.status(500).json(err);
            // next(e);
        }
        // catch (e) {
        //     next(e);
        // }
    };

    async createComment (req, res) {
        req.body.img = req.file.filename;
      console.log(req.body)
       try {
         const savedComment = await commentService.addComment(req.body);
          return res.status(200).json(savedComment);
       }  catch (err) {
           res.status(500).json(err);
           // next(e);
       }
     };












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
        } catch (e) {
            next(e);
            //   res.status(500).json(err);
        }
    };

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


module.exports = new CommentController();
