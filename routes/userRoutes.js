const express = require('express');
const router = new express.Router();
const User = require('../models/userModel');

//Registering a User
router.post('/api/users/register', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		return res.status(201).json({
			status: 'Success',
			data: { username: req.body.username, email: req.body.email },
		});
	} catch (e) {
		return res.status(400).json({
			status: 'Failed',
			error: e,
		});
	}
});

//Fetching all users
router.get('/api/users/', async (req, res) => {
	try {
		const users = await User.find();
		return res.status(200).json({
			status: 'Success',
			data: { users },
		});
	} catch (e) {
		return res.status(400).json({
			status: 'Failed',
			error: e,
		});
	}
});

//Fetch a particular user
router.get('/api/users/:username', async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username });
		if (user) {
			return res.status(200).json({
				status: 'Success',
				data: { user },
			});
		}
		return res.status(404).json({
			status: 'Failed',
			data: "User doesn't exists",
		});
	} catch (e) {
		return res.status(400).json({
			status: 'Failed',
			error: e,
		});
	}
});

//Update password
router.patch('/api/users/changepassword/:username', async (req, res) => {
	const username = req.params.username;
	const newPassword = req.body.password;
	const updatedData = { password: newPassword };
	try {
		const user = await User.findOneAndUpdate(
			{ username: username },
			updatedData,
			{ new: true, runValidators: true }
		);
		if (!user) {
			return res.status(404).json({
				status: 'Failed',
				data: "User Doesn't exists",
			});
		}
		return res.status(200).json({
			status: 'Success',
			data: user,
		});
	} catch (e) {
		return res.status(400).json({
			status: 'Failed',
			error: e,
		});
	}
});

//Delete a User
router.delete('/api/users/delete/:username', async (req, res) => {
	const username = req.params.username;
	try {
		const user = await User.findOneAndDelete({ username: username });
		if (!user) {
			return res.status(404).json({
				status: 'Failed',
				data: user,
			});
		} else {
			return res.status(202).json({
				status: 'Success',
			});
		}
	} catch (e) {
		return res.status(400).json({
			status: 'Failed',
			error: e,
		});
	}
});
module.exports = router;
