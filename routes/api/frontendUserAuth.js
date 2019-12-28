const express = require('express');
const User = require('../../models/FrontEndUser');
const router = express.Router();
const authMiddleWare = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const authConfig = require('../../config/config');

const transport = {
  host: 'smtp.geetico.com',
  port: 587,
  secure: false,
  auth: {
    user: authConfig.USER,
    pass: authConfig.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true
};
const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages', success);
  }
});
//@route    GET api/auth
//@desc     test Route
//@access   public
router.get('/', authMiddleWare, async (req, res) => {
  // res.send("auth Route");
  try {
    const user = await User.findById(req.user.id).select('-password'); // req.user was already stored in the middle ware as the the user payload from the decoded json and the select is used to add or remove properties// in this case -password  removes the password from the user
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
});
router.get('/pub/:user', async (req, res) => {
  // console.log('get in');
  try {
    const user = await User.findById(req.params.user)
      .select('fullName')
      .select('avatar'); // req.user was already stored in the middle ware as the the user payload from the decoded json and the select is used to add or remove properties// in this case -password  removes the password from the user
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

      if (user.isConfirmed !== true) {
        console.log('gotem');
        const payload = {
          user: {
            id: user.id
          }
        };

        return jwt.sign(
          payload,
          config.get('jwtSecret'),
          null,
          (error, token) => {
            if (error) throw error;

            const url = `https://geetico.com/confirmation/${token}`;

            transporter.sendMail({
              from: 'Geetico.com <contact@geetico.com>',
              to: user.email,
              subject: 'Please confirm your email address with geetico.com',
              html: `Hi ${user.fullName}!. <br> <p> Thanks a lot for registering on geetico.com. Please click this link to confirm your email: <a href="${url}">${url}</a></p>`
            });

            res.status(400).json({ notConfirmed: true });
          }
        );
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
          _id: user.id,
          avatar: user.avatar
        });
        console.log('logged in');
        console.log('token');
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
