const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const postController = require('../controllers/post-controller');
const commentController = require('../controllers/comment-controller');

const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

const multerMiddleware = require('../middlewares/multer-middleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.put("/user/:id",authMiddleware, userController.updateUser);
router.delete("/user/:id",authMiddleware, userController.deleteUser);
router.get("/",authMiddleware, userController.getUser);
router.get("/friends/:userId", authMiddleware, userController.getFriends );
router.put("/:id/follow", authMiddleware, userController.putFollowUser); 
router.put("/:id/unfollow", authMiddleware , userController.putUnfollowUser);


router.get('/posts', authMiddleware, postController.getPosts);
router.post("/upload",authMiddleware, multerMiddleware('file'), postController.createPost);
// router.post("/createpost",authMiddleware, postController.createPost);
router.put("/post/:id", authMiddleware , postController.updatePost);
router.delete("/post/:id",authMiddleware, postController.deletePost);
// router.put("/:id/like", authMiddleware, postController.likedPost);
router.put("/like", authMiddleware, postController.likedPost);
router.get("/:id", authMiddleware , postController.getPost);
router.get("/timeline/:userId", authMiddleware,  postController.getTimelinePosts); 
router.get("/profile/:username", authMiddleware ,  postController.getUserAllPosts);


router.get('/printcomment', authMiddleware, commentController.getComments);
router.post("/comment",authMiddleware, multerMiddleware('file'), commentController.createComment);


module.exports = router
