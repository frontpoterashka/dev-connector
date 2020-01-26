const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

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
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const { name, email, password } = req.body;

			let user = await User.findOne({ email });
			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exist' }] });
			}

			const avatar = gravatar.url({
				s: '200',
				r: 'pg',
				d: 'mm'
			});

			user = new User({
				name,
				email,
				avatar,
				password
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);
			await user.save();

			return res.send('Users rerister');
		} catch (error) {
			console.error(errors.message);
			return res.status(500).send('Server error');
		}
	}
);

module.exports = router;
