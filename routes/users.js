const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const {
	isAuth,
	isOwner
} = require('../middlewares');

const {
	register,
	login,
	users,
	getUserById,
	user,
	updateUser,
	userPhoto,
	addFollowing,
	addFollower,
	removeFollowing, 
	removeFollower
} = require('../controllers/users');

router.post('/register', register);
router.post('/login', login);

router.get('/users', users);
router.get('/user/:userId', user);
router.get('/user/:userId/image', userPhoto);
router.put('/user/follow', isAuth, addFollowing, addFollower);
router.put('/user/unfollow', isAuth, removeFollowing, removeFollower);
router.put('/user/:userId', isAuth, isOwner, upload.single('image'), updateUser);


router.param('userId', getUserById);

module.exports = router;