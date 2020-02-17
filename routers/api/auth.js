const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route  GET api/auth
// @desc   test route
// @access Public
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (error) {
		console.error(error.message);
		res.status(500).json('Server error');
	}
});

// @route  POST api/auth
// @desc   Authenticated
// @access Public
router.post(
	'/',
	[
		check('email', 'Please enter valid email').isEmail(),
		check('password', 'Password is reqired').exists()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const { email, password } = req.body;

			const user = await User.findOne({ email });

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credential' }] });
			}

			bcrypt.compare(password, user.password, (err, hash) => {
				if (!hash) {
					return res
						.status(400)
						.json({ errors: [{ msg: 'Invalid credential' }] });
				}

				const payload = {
					id: user.id
				};

				jwt.sign(
					payload,
					config.get('jwtSecert'),
					{
						expiresIn: 3600
					},
					(errToken, token) => {
						if (errToken) {
							throw errToken;
						}
						return res.json({ token });
					}
				);
			});
		} catch (error) {
			console.error(errors.message);
			return res.status(500).send('Server error');
		}
	}
);

module.exports = router;
