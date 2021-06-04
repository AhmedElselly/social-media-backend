const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	author: {
		_id: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	}
});

module.exports = mongoose.model('Comment', commentSchema);