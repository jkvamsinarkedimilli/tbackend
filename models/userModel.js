const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username is Required'],
		minLength: [6, 'Username should have minimum six charecters'],
		unique: [true, 'Username already exists'],
		trim: true,
		lowercase: true,
	},
	email: {
		type: String,
		required: [true, 'Email is Required'],
		unique: [true, 'Email already exists'],
		trim: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please enter a valid email'],
	},
	password: {
		type: String,
		required: [true, 'Password is Required'],
		minLength: [8, 'Password should have minimum 8 charecters'],
		trim: true,
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.statics.findByCredentials = async (username, password) => {
	const user = await User.findOne({ username });
	if (!user) {
		throw new Error('Invalid Username');
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error('Invalid Password');
	}
	return user;
};

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, process.env.AUTHTOKEN);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.methods.toJSON = function () {
	const user = this;
	const userObj = user.toObject();
	delete userObj.token;
	delete userObj.password;
	return userObj;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
