const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    minLength: 8,
    select: false,
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.checkPassword = async function (userPassword, dbPassword) {
  return await bcrypt.compare(userPassword, dbPassword);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
