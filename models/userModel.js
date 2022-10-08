const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
//User Model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minLength:[6,'Username should have atleast 6 charecters'],
  },
  email:{
    type:String,
    required:[true,'Email is required'],
    unique:true,
    trim:true,
    lowercase:true,
    validate:[validator.isEmail,'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    minLength: [8,'Password should have atleast 8 charecters'],
    select: false, //This will not be selected in any output
  },
});

userSchema.pre('save', async function (next) {
  //Saving only when the password is modified
  if (!this.isModified('password')) return next(); //Call next if the password is not modified
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.checkPassword = async function (userPassword, dbPassword) {
  return await bcrypt.compare(userPassword, dbPassword);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
