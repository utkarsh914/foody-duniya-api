const jwt = require('jsonwebtoken');
const { Roletypes } = require('../constants');


const userAuth = function (req, res, next) {
	const token = req.header('token');
	if (!token) {
		return res.status(401).send('No JWT token specified');
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded.user.role === Roletypes.USER) {
			req.user = decoded.user;
			next();
		}
		else res.status(401).send('Not allowed');
	} catch (err) {
		console.error(err);
		res.status(500).send('Invalid Token');
	}
};


// check login for admin
const adminAuth = function isLoggedIn (req, res, next) {
	const token = req.header('token');
	if (!token) {
		return res.status(401).send('No JWT token specified');
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded.user.role === Roletypes.ADMIN) {
			req.user = decoded.user;
			next();
		}
		else res.status(401).send('Not allowed');
	} catch (err) {
		console.error(err);
		res.status(500).send('Invalid Token');
	}
};


module.exports = {
	userAuth,
	adminAuth
};
