const mongoose = require('mongoose');
const {Schema} = mongoose;

const postSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	image: {
		data: Buffer,
		contentType: String
	},
	description: {
		type: String,
		required: true
	},
	author: {
		id: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	comments: [
		{
			_id:{
				type: Schema.Types.ObjectId,
				ref: 'Comment'
			},
			text: String,
			author: {
				_id: {
					type: Schema.Types.ObjectId,
					ref: 'User'
				},
				username: String
			}
		}
	]
});


module.exports = mongoose.model('Post', postSchema);