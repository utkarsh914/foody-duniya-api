const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.NODEMAILER_EMAIL,      // my email id
		pass: process.env.NODEMAILER_PASSWORD     // my gmail password
	}
});

module.exports = transporter;
