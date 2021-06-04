const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const {
	isAuth,
	isOwner
} = require('../middlewares');

const {
	getUserById
} = require('../controllers/users');

const{
	newPost,
	postIndex,
	getPostById,
	postImage,
	getPost,
	updatePost,
	removePost,
	like,
	unlike
} = require('../controllers/posts');

router.get('/', postIndex);
router.post('/new/:userId', isAuth, upload.single('image'), newPost);
router.get('/:postId', getPost);
router.get('/image/:postId', postImage);

router.put('/:postId/update/:userId', isAuth, isOwner, upload.single('image'), updatePost)
router.put('/:postId/like', isAuth, like)
router.put('/:postId/like', isAuth, like)
router.put('/:postId/unlike', isAuth, unlike)
router.delete('/:postId/remove/:userId', isAuth, isOwner, removePost)

router.param('userId', getUserById);
router.param('postId', getPostById);


module.exports = router;