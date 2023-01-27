const express = require('express');
const router = express.Router();
// auth middleware
const { dishAuth, adminAuth } = require('../middleware/auth');
// models
const Dish = require('../models/Dish');

// used to search for one dish by the user
router.get('/search-dish', dishAuth, async (req, res) => {
	try {
		const dish = await Dish.findById(req.query.id);
		return res.send({ dish });
	}
	catch (err) {
		console.error(err);
		return res.status(500).send('Some server side error occured');
	}
});

// used to search for dishes by the user
router.get('/search-dishes', dishAuth, async (req, res) => {
	try {
		const { name } = req.query;
		const dishes = await Dish.find({ name: new RegExp(name, 'i') });
		return res.send({ dishes });
	}
	catch (err) {
		console.error(err);
		return res.status(500).send('Some server side error occured');
	}
});

// TODO: add upload picture as well
router.post('/', adminAuth, async (req, res) => {
	try {
		let { name, description, price } = req.body;
		price = parseInt(price);
		await new Dish({ name, description, price, adminId: req.user._id }).save();
		return res.send('Dish created successfully');
	}
	catch (err) {
		console.error(err);
		return res.status(500).send('Some server side error occured');
	}
});


// TODO: add upload picture as well
router.delete('/', adminAuth, async (req, res) => {
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
router.patch('/', adminAuth, async (req, res) => {
	try {
		const { id, name, price, description } = req.body;
		let dish = await Dish.findById(id);
		if (!dish) return res.status(400).send('Incorrect dish ID');
		dish.name = name;
		dish.price = price;
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
