const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { Roletypes } = require('../constants');
mongoose.promise = Promise;

const adminSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

const matchPassword = async function (password) {
	const result = await bcrypt.compare(password, this.password);
	return result;
};

const generateAuthToken = function (timeToLive = 24 * 60 * 60 * 1000) {
	const payload = {
		user: {
			_id: this._id,
			username: this.username,
			role: Roletypes.ADMIN
		}
	};
	const token = jwt.sign(payload, process.env.JWT_SECRET, {	expiresIn: timeToLive });
	return token;
};

adminSchema.methods = {
	matchPassword,
	generateAuthToken
};

module.exports = mongoose.model('admins', adminSchema);
