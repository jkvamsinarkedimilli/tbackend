const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, process.env.AUTHTOKEN);
		const user = await User.findOne({
			_id: decoded._id,
			'tokens.token': token,
		});
		if (!user) {
			throw new Error();
		}
		req.user = user;
		req.token = token;
		next();
	} catch (e) {
		console.log(e);
		return res.status(401).send('Please Login to Continue');
	}
};

module.exports = auth;
