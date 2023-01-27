const jwt = require('jsonwebtoken');
const { Roletypes } = require('../constants');

const getToken = req => {
	return req.headers.authorization.split(' ')[1];
};


const userAuth = function (req, res, next) {
	const token = getToken(req);
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
const adminAuth = function (req, res, next) {
	const token = getToken(req);
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


const dishAuth = function (req, res, next) {
	const token = getToken(req);
	if (!token) {
		return res.status(401).send('No JWT token specified');
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const role = decoded.user.role;
		if (role === Roletypes.ADMIN || role === Roletypes.USER) {
			req.user = decoded.user;
			next();
		}
		else res.status(401).send('Not allowed');
	} catch (err) {
		console.error(err);
		res.status(500).send('Invalid Token');
	}
}


module.exports = {
	userAuth,
	adminAuth,
	dishAuth
};
