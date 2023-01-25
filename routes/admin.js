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
			let { adminId, password } = req.body;
			let admin = await Admin.findOne({ adminId });
			if (admin) {
				console.log('Admin already Exists');
				return res.status(400).json('Admin already Exists');
			}
			const salt = await bcrypt.genSalt(10);
			password = await bcrypt.hash(password, salt);
			if (!admin) {
				admin = new Admin({	adminId, password	});
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
		const { adminId, password } = req.body;
		//find user in db
		const admin = await Admin.findOne({ adminId });
		//if not found in db
		if (!admin) {
			return res.status(401).send('Invalid credentials');
		}
		//compare password
		const isMatch = await bcrypt.compare(password, admin.password);
		if (!isMatch) {
			return res.status(401).send('Incorrect password!');
		}
		//create payload
		const payload = {
			user: {
				role: 'admin',
				id: admin.id,
			}
		};
		const token = jwt.sign( payload, process.env.JWT_SECRET, { expiresIn: 12*60*60 });
		res.send({ token });
	}
	catch (e) {
		console.log(e)
		return res.status(500).send('Some server side error occured');
	}
});


// TODO: add upload picture as well
router.post('/dish', adminAuth, async (req, res) => {
	try {
		const { name, description } = req.body;
		const adminId = req.user.id;
		await new Dish({ name, description, adminId }).save();
		return res.send('Dish created successfully');
	}
	catch (err) {
		console.error(err);
		return res.status(500).send('Some server side error occured');
	}
});


// TODO: add upload picture as well
router.delete('/dish', adminAuth, async (req, res) => {
	try {
		const { dishId } = req.body;
		const { deletedCount } = await Dish.deleteOne({ id: dishId });
		if (!deletedCount) return res.status(400).send('No dish exists with provided dish ID');
		return res.send('Dish deleted successfully');
	}
	catch (err) {
		console.error(err);
		return res.status(500).send('Some server side error occured');
	}
});


// TODO: add upload picture as well
router.patch('/dish', adminAuth, async (req, res) => {
	try {
		const { dishId, name, description } = req.body;
		let dish = await Dish.findById(dishId);
		if (!dish) return res.status(400).send('Incorrect dish ID');
		dish.name = name;
		dish.description = description;
		await dish.save();
		return res.send('Dish updated successfully');
	}
	catch (err) {
		console.error(err);
		return res.status(500).send('Some server side error occured');
	}
});


module.exports = router;
