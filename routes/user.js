const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// auth middleware
const { userAuth } = require('../middleware/auth');
// models
const User = require('../models/User');


router.post(
	'/signup',
	[
		check('email', 'Please enter a valid email').isEmail(),
		check('password', 'Please enter a valid password').isLength({	min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log('error: ', errors.array());
			return res.status(400).json({
				errors: errors.array()
			});
		};
		try {
			let { name, email, password } = req.body;
			let user = await User.findOne({ email });
			if (user) {
				console.log('User Already Exists');
				return res.status(400).json('User Already Exists');
			}
			const salt = await bcrypt.genSalt(10);
			password = await bcrypt.hash(password, salt);
			if (!user) {
				user = new User({	name, email, password	});
			}
			await user.save();
			const token = user.generateAuthToken();
			res.status(200).json({ token });
		}
		catch (err) {
			console.log(err);
			return res.status(500).send('Some server side error occured');
		}
	}
);


router.post('/login', async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });
			if (!user) {
				console.log('User Not Exist');
				return res.status(400).json('User Not Exist');
			}
			const isMatch = await user.matchPassword(password);
			if (!isMatch) {
				console.log('Incorrect Password!');
				return res.status(400).json('Incorrect Password!');
			}
			const token = user.generateAuthToken();
			delete user.password;
			res.status(200).json({ token, user });
		}
		catch (err) {
			console.error(err);
			return res.status(500).send('Some server side error occured');
		}
	}
)


router.get('/me', userAuth, async (req, res) => {
	try {
		// request.user is getting fetched from Middleware after token authentication
		const user = await User.findById(req.user.id);
		res.json(user);
	} catch (e) {
		console.log('Error in Fetching user');
		res.send('Error in Fetching user');
	}
});

module.exports = router;
