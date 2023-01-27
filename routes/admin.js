const express = require('express');
const router = express.Router();
//for authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// auth middleware
const { adminAuth } = require('../middleware/auth');
// models
const Admin = require('../models/Admin');
const Dish = require('../models/Dish');


// handle admin sign up
router.post('/signup', async (req, res) => {
		try {
			let { username, password } = req.body;
			let admin = await Admin.findOne({ username });
			if (admin) {
				console.log('Admin already Exists');
				return res.status(400).json('Admin already Exists');
			}
			const salt = await bcrypt.genSalt(10);
			password = await bcrypt.hash(password, salt);
			if (!admin) {
				admin = new Admin({	username, password	});
			}
			await admin.save();
			const token = admin.generateAuthToken();
			res.status(200).json({ token });
		}
		catch (err) {
			console.log(err);
			return res.status(500).send('Some server side error occured');
		}
	}
);


// handle admin login
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		//find user in db
		const admin = await Admin.findOne({ username });
		//if not found in db
		if (!admin) {
			return res.status(401).send('Invalid credentials');
		}
		//compare password
		const isMatch = await admin.matchPassword(password);
		if (!isMatch) {
			return res.status(401).send('Incorrect password!');
		}
		const token = admin.generateAuthToken();
		res.send({ token, user: admin });
	}
	catch (e) {
		console.log(e)
		return res.status(500).send('Some server side error occured');
	}
});


module.exports = router;
