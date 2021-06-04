const Post = require('../models/post');

module.exports = {
	getPostById(req, res, next, id){
		Post.findById(id).populate('comment', '_id text author').exec(function(err, post){
			if(err) return res.status(400).json({error: 'Post is not found!'});
			req.post = post;
			next();
		});
	},

	async newPost(req, res){
		const post = await new Post(req.body);
		post.author.id = req.user._id;
		post.author.username = req.user.fullName;
		console.log(req.file);
		if(req.file){
			post.image.data = req.file.buffer;
			post.image.contentType = req.file.mimetype;
		}

		post.save((err, post) => {
			if(err) return res.status(400).json({error: err});
			return res.json(post);
		});
	},

	async postIndex(req, res){
		const posts = await Post.find().populate('comment', '_id author.id text author.username').select('-image');
		return res.json(posts);
	},

	postImage(req, res){
		res.set('Content-Type', req.post.image.ContentType);
		return res.send(req.post.image.data);
	},

	async getPost(req, res){
		const post = await Post.findById(req.post._id).select('-image');
		return res.json(post);
	},

	async updatePost(req, res){
		const post = await req.post;
		console.log(post._id)
		console.log(req.body)
		const {title, description} = await req.body;
		post.title = title;
		post.description = description;
		
		if(req.file){
			post.image.data = req.file.buffer;
			post.image.contentType = req.file.mimetype;
		}
		post.save((err, post) => {
			if(err) return res.status(400).json({error: err});
			return res.json(post);
		})
	},

	async removePost(req, res){
		const post = await req.post;
		post.remove((err, post) => {
			if(err) return res.status(400).json({error: err});
			return res.json({message: 'Post has been deleted'});
		})
	},

	async like(req, res){
		const post = await Post.findByIdAndUpdate(req.body.postId, {
			$push: {
				likes: req.body.userId
			}
		}, {new: true});
		return res.json(post);
	},

	async unlike(req, res){
		const post = await Post.findByIdAndUpdate(req.body.postId, {
			$pull: {likes: req.body.userId}
		}, {new: true});
		return res.json(post);
	}
}