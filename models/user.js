const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	fullName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	educator: {
		type: Boolean,
		default: false
	},
	about: {
		type: String,
		trim: true
	},
	image: {
		data: Buffer,
		contentType: String
	},
	following: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	followers: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	]
});

userSchema.pre('save', async function(next){
	this.password = await bcrypt.hashSync(this.password, 10);
	this.fullName = `${this.firstName} ${this.lastName}`;
	next();
});

userSchema.methods = {
	comparePassword(password){
		bcrypt.compareSync(password, this.password);
	}
}

module.exports = mongoose.model('User', userSchema);