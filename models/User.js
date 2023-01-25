const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { Roletypes } = require('../constants');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		dropDups: true
	},
	password: {
		type: String,
		required: true
	},
	// otp: {
	// 	type: Number
	// }
	// isActive: {
	// 	type: Boolean,
	// 	default: false
	// },
}, {
	timestamps: true
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

const sendOtp = async function () {
	const from = process.env.MAILER_EMAIL;
	const to = this.email;
	const subject = "Confirm your email"
	const otp = Math.floor(Math.random() * 899999 + 100000);
	const html = `<p>Your one time password is <b>${otp}</b></p>`;
	this.otp = otp;
	await this.save();
	return mailer.send(from, to, subject, html);
}

const verifyOtp = async function (otp) {
	if (this.otp === parseInt(otp)) {
		if (!this.isActive) {
			this.isActive = true;
			await this.save();
		}
		return true;
	}
	else return false;
}

UserSchema.methods = {
	sendOtp,
	verifyOtp,
	matchPassword,
	generateAuthToken
}


// export model user with UserSchema
module.exports = mongoose.model('users', UserSchema)
