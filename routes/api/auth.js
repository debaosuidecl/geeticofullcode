const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const authMiddleWare = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
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

// user seller\
// @route    POST api/users
// @desc     Register User
// @access   public
// router.post(
//   '/seller',
//   [
//     check('fullName', 'Your full name is required')
//       .not()
//       .isEmpty(),

//     check('email', 'Use a valid Email').isEmail(),
//     check(
//       'password',
//       'Please Enter a password with 6 or more characters'
//     ).isLength({ min: 8 })
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       // if there are errors
//       return res.status(400).json({
//         errors: errors.array()
//       });
//     }

//     const { fullName, email, password } = req.body;

//     try {
//       // we want to see if the user exist

//       // get User's gravatar

//       // encrypt the password using bcrypt

//       // return a jsonwebtoken so that the user can be logged in immediately

//       let user = await User.findOne({ email });
//       if (user) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'User Already Exists' }] }); //bad request
//       }
//       const avatar = gravatar.url(email, {
//         s: '200', // default size
//         r: 'pg', // rating - cant have any naked people :)
//         d: 'mm' // gives a default image
//       });
//       user = new User({
//         fullName,
//         email,
//         avatar,
//         password
//       });
//       const salt = await bcrypt.genSalt(10); // create the salt
//       user.password = await bcrypt.hash(password, salt); // to encrypt the user password

//       await user.save();

//       const payload = {
//         user: {
//           id: user.id
//         }
//       };

//       jwt.sign(payload, config.get('jwtSecret'), null, (error, token) => {
//         if (error) throw error;

//         res.json({ token, avatar: user.avatar, fullName: user.fullName });
//       });
//     } catch (e) {
//       console.error(e);
//       res.status(500).send('Server Error');
//     }
//   }
// );

module.exports = router;
