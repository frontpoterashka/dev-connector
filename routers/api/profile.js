const express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');

// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
	try {
		Profile.findOne({ user: req.user.id })
			.populate('user', ['name', 'avatar'])
			.then(profile => {
				if (!profile) {
					return res
						.status(400)
						.json({ msg: 'There is not profile for this user' });
				}
				return res.json(profile);
			})
			.catch(err => res.status(404).json(err));
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
