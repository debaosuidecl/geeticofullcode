const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const authMiddleWare = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

//@route    GET api/auth
//@desc     test Route
//@access   public
router.get('/', authMiddleWare, async (req, res) => {
  // res.send("auth Route");
  // console.log('here');
  try {
    const user = await User.findById(req.user.id).select('-password'); // req.user was already stored in the middle ware as the the user payload from the decoded json and the select is used to add or remove properties// in this case -password  removes the password from the user
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

//@route    POST api/auth
//@desc     Authenticate user & get token
//@access   public
router.post(
  '/',
  [
    check('email', 'Use a valid Email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there are errors
      return res.status(200).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    try {
      // we want to check to see if there is no user. if there isn't we send an error

      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Incorrect email or password entered. ' }] }); //bad request
      }

      const isMatch = await bcrypt.compare(password, user.password); // first arg is plain text password from request, second is the encrypted password, we want to check if these 2 match

      if (!isMatch) {
        // if it doesn't match
        return res
          .status(400)
          .json({ errors: [{ msg: 'Incorrect email or password entered. ' }] }); //bad request
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, config.get('jwtSecret'), null, (error, token) => {
        if (error) throw error;

        res.json({
          token,
          email: user.email,
          fullName: user.fullName,
          _id: user.id
        });
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        errors: [
          {
            msg: 'A server error occured'
          }
        ]
      });
    }
  }
);

module.exports = router;
