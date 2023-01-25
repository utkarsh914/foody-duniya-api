const { Roletypes } = require('../constants');
const mongoose = require('mongoose');
mongoose.promise = Promise;

const adminSchema = mongoose.Schema({
	adminId: {
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
			id: this._id,
			email: this.email,
			role: Roletypes.USER
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
