const mongoose = require('mongoose');
const validator = require('validator');
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
    select: false,
    trim: true,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
