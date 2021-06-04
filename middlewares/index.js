const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
	isAuth(req, res, next){
		const token = req.headers.authorization.split(' ')[1];
		const user = jwt.verify(token, process.env.SECRETKEY);		
		req.auth = user;
		next()
	},

	async isOwner(req, res, next){
		const user = await req.user;
		if(req.auth._id == req.user._id){
			next();	
		} else {
			return res.status(400).json({error: 'User is not authorized!'});
		}
		
	}
}