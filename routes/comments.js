const express = require('express');
const router = express.Router();

const {
	isAuth,
	isOwner
} = require('../middlewares');

const {
	getUserById
} = require('../controllers/users');

const {
	getPostById
} = require('../controllers/posts');


const {
	create
} = require('../controllers/comments');

router.post('/:postId/new/:userId', isAuth, create);


router.param('userId', getUserById);
router.param('postId', getPostById);

module.exports = router;
