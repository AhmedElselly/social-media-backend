const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports = {
	async create(req, res){
		const comment = await new Comment(req.body);
		comment.author._id = await req.user._id;
		comment.author.username = await req.user.fullName;
		comment.save();
		// const post = await req.post;
		// post.comments.push(comment);


		const post = await Post.findByIdAndUpdate(req.post._id, {
			$push:{
				comments: comment
			}
		},{new: true}).populate('comments.author', 'id username');
		return res.json(post);
		// post.save((err, post) => {
		// 	if(err) return res.status(400).json({error: err});
		// 	return res.json(post);
		// })
	}
}