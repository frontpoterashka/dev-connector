const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// @route  POST api/users
// @desc   Register Users
// @access Public
router.post(
	'/',
	[
		check('name', 'Name is Reqired').notEmpty(),
		check('email', 'Please enter valid email').isEmail(),
		check('password', 'Min lenght 6 char').isLength({ min: 6 })
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		res.send('Users rotute');
	}
);

module.exports = router;
