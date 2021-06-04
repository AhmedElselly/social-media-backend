const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
	getUserById(req, res, next, id){
		User.findById(id).select('-password').exec((err, user) => {
			if(err) return res.status(400).json({error: 'could not find the user'});
			// console.log('user', user)
			req.user = user;
			next();
		});
	},

	async register(req, res){
		const user = await new User(req.body);
		user.save((err, user) => {
			if(err) return res.status(400).json({error: err});
			return res.json(user);
		})
	},

	async login(req, res){
		const user = await User.findOne({email: req.body.email});

		const password = await user.comparePassword(req.body.password);
		
		const token = await jwt.sign({_id: user._id, email: user.email, fullName: user.fullName}, process.env.SECRETKEY);
		const {_id, email, firstName, lastName, fullName, educator} = user;
		return res.json({token, user: {
			_id,
			email,
			firstName,
			fullName,
			lastName,
			educator
		}});
	},

	async users(req, res){
		const users = await User.find().select('-image');
		return res.json(users);
	},

	async user(req, res){
		const user = await User.findById(req.user._id).select('-image')
		return res.json(user);
	},

	async updateUser(req, res){
		const user = await req.user;
		const {email, firstName, lastName, password, about} = req.body;
		
		user.email = email;
		user.firstName = firstName;
		user.lastName = lastName;
		user.password = password;
		user.about = about;
		console.log('photo', req.file)
		if(req.file){
			user.image.data = req.file.buffer;
			user.image.contentType = req.file.mimetype;
		}

		user.save((err, user) => {
			if(err) return res.status(400).json({error: err});
			return res.json(user);
		});
	},

	userPhoto(req, res){
		res.set('Content-Type', req.user.image.contentType);
		return res.send(req.user.image.data);
	},

	async addFollowing(req, res, next){
		try{
			await User.findByIdAndUpdate(req.body.userId, {
				$push: {following: req.body.followId}
			});
			next();
		} catch(err){
			return res.status(400).json({error: 'addFollowing error'})
		}
	},

	async addFollower(req, res){
		const result = await User.findByIdAndUpdate(req.body.followId, {
			$push:{
				followers: req.body.userId
			}
		},{new: true}).populate('following', '_id fullName')
		.populate('followers', '_id fullName')
		.exec()
		return res.json(result);
	},

	async removeFollowing(req, res, next){
		await User.findByIdAndUpdate(req.body.userId, {
			$pull: {
				following: req.body.unfollowId
			}
		})
		next();
	},

	async removeFollower(req, res){
		const result = await User.findByIdAndUpdate(req.body.unfollowId, {
			$pull: {
				followers: req.body.userId
			}
		},{new: true}).populate('following', '_id fullName')
		.populate('followers', '_id fullName')
		.exec()
		return res.json(result);
	}
}