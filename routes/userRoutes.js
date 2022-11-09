const express = require('express');
const router = new express.Router();
const User = require('../models/userModel');
const auth = require('../middlewares/Auth');
//Registering a User
router.post('/api/users/register', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();
		return res.status(201).json({
			status: 'Success',
			data: { username: req.body.username, email: req.body.email, token },
		});
	} catch (e) {
		return res.status(400).json({
			status: 'Failed',
			error: e,
		});
	}
});

//Login a user
router.post('/api/users/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findByCredentials(username, password);
		const token = await user.generateAuthToken();
		return res.status(200).json({
			status: 'Success',
			data: { username: user.username, email: user.email },
			token: token,
		});
	} catch (e) {
		return res.status(400).json({
			status: 'Failed',
			error: e,
		});
	}
});

//Logout
router.post('/api/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		console.log('Logout Success');
		return res.status(200).json({
			status: 'Logged Out Successfully',
		});
	} catch (e) {
		console.log('Logout from a session');
		console.log(e);
		return res.status(400).json({
			status: 'Failed',
			error: e,
		});
	}
});

//Logout all sessions
router.post('/api/users/logoutall', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		console.log('Success');
		res.status(200);
	} catch (e) {
		console.log('Logout from all session');
		console.log(e);
		res.status(401).json({
			status: 'Failed',
			error: e,
		});
	}
});

//Fetching my profile
router.get('/api/users/me', auth, async (req, res) => {
	return res.status(200).json({
		staus: 'Success',
		data: req.user,
	});
});

//Update password
router.patch('/api/users/me/changepassword/', auth, async (req, res) => {
	const newPassword = req.body.password;
	try {
		req.user.password = newPassword;
		await req.user.save();
		return res.status(200).json({
			status: 'Success',
			data: req.user,
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({
			status: 'Failed',
			error: e,
		});
	}
});

//Delete a User
router.delete('/api/users/me', auth, async (req, res) => {
	try {
		await req.user.remove();
		return res.status(200).json({
			status: 'Deleted',
			data: req.user,
		});
	} catch (e) {
		return res.status(400).json({
			status: 'Failed',
			error: e,
		});
	}
});
module.exports = router;
