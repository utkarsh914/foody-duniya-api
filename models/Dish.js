const mongoose = require('mongoose');
mongoose.promise = Promise;
const { ObjectId } = mongoose.Schema.Types;

const dishSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	// picture_uri: {
	// 	type: String,
	// 	required: true
	// },
	adminId: {
		type: ObjectId,
		ref: 'admins',
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	}
});

const Dish = mongoose.model('dishes', dishSchema);
module.exports = Dish;
