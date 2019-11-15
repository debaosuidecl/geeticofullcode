const express = require('express');
const orderid = require('order-id')('geetico2019');

const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/FrontEndUser'); // bring in the user model
const Product = require('../../models/Product'); // bring in the product model
const authMiddleWare = require('../../middleware/auth');
const getShippingCost = require('../../middleware/getShippingCost');
const path = require('path');
const Order = require('../../models/Order');
const request = require('request');

const { initializePayment, verifyPayment } = require('../../config/paystack')(
  request
);
// @route    POST api/users
// @desc     Register User
// @access   public
router.post(
  '/',
  [
    check('fullName', 'Your full name is required')
      .not()
      .isEmpty(),

    check('email', 'Use a valid Email').isEmail(),
    check(
      'password',
      'Please Enter a password with 6 or more characters'
    ).isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there are errors
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { fullName, email, password } = req.body;

    try {
      // we want to see if the user exist

      // get User's gravatar

      // encrypt the password using bcrypt

      // return a jsonwebtoken so that the user can be logged in immediately

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User Already Exists' }] }); //bad request
      }
      const avatar = gravatar.url(email, {
        s: '200', // default size
        r: 'pg', // rating - cant have any naked people :)
        d: 'mm' // gives a default image
      });
      user = new User({
        fullName,
        email,
        avatar,
        password
      });
      const salt = await bcrypt.genSalt(10); // create the salt
      user.password = await bcrypt.hash(password, salt); // to encrypt the user password

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, config.get('jwtSecret'), null, (error, token) => {
        if (error) throw error;

        res.json({ token, avatar: user.avatar, fullName: user.fullName });
      });
    } catch (e) {
      console.error(e);
      res.status(500).send('Server Error');
    }
  }
);

// @route    POST api/users/userOrderUpdate
// @desc     Update User address before Order
// @access   private
router.post(
  '/userOrderUpdate',
  authMiddleWare,
  [
    check('state', 'state is required')
      .not()
      .isEmpty(),
    check('city', 'Your city is required and must be in Lagos')
      .not()
      .isEmpty()
      .isIn([
        'Agege',
        'Ajeromi-Ifelodun',
        'Alimosho',
        'Amuwo-Odofin',
        'Badagry',
        'Apapa',
        'Epe',
        'Eti Osa',
        'Ibeju-Lekki',
        'Ifako-Ijaiye',
        'Ikeja',
        'Ikorodu',
        'Kosofe',
        'Lagos Island',
        'Mushin',
        'Lagos Mainland',
        'Ojo',
        'Oshodi-Isolo',
        'Shomolu',
        'Surulere Lagos State'
      ]),
    check(
      'street',
      'Your Street address is required and must not be more than 100 characters'
    )
      .not()
      .isEmpty()
      .isLength({ max: 100 }),

    check('phone', 'Phone number is required and must be Real').isNumeric(),
    check('dateOfDelivery', 'Delivery Date is required').isISO8601(),
    check('timeOfDelivery', 'Delivery time is required').isIn([
      1,
      2,
      3,
      4,
      5,
      6
    ])

    // .isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there are errors
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      // find user by user Id
      const user = await User.findById(req.user.id);
      const {
        state,
        city,
        suite,
        street,
        phone,
        company,
        orderNote,
        cartToJson,
        dateOfDelivery,
        timeOfDelivery,
        directSelected
      } = req.body;

      // save the user details

      // update user with validated fields

      user.state = state;
      user.city = city;
      user.suite = suite;
      user.street = street;
      user.phone = phone;
      user.company = company;
      user.orderNote = orderNote;
      await user.save();

      // console.log(user);

      // initialize payment on paystack start by getting the amount from the cart data
      let priceQuantArray = await Promise.all(
        Object.keys(cartToJson).map(
          productId =>
            new Promise(async (resolve, reject) => {
              let productPrice = await Product.findById(productId).select(
                'price'
              );
              resolve({
                productPrice,
                quantity: cartToJson[productId]
              });
            })
        )
      );

      let amount = priceQuantArray
        .map(obj => {
          return { price: obj.productPrice.price, quantity: obj.quantity };
        })
        .reduce((prevValue, curValue) => {
          return prevValue + curValue.price * curValue.quantity;
        }, 0);
      amount += getShippingCost(amount, directSelected);
      // res.json();
      let form = {
        // amount: 1,
        amount: amount * 100,
        email: user.email,
        metadata: {
          fullName: user.fullName,
          cartToJson,
          id: req.user.id,
          dateOfDelivery,
          timeOfDelivery,
          amount: amount * 100,
          state,
          city,
          suite,
          street,
          phone,
          company,
          orderNote
        }
      };

      if (directSelected) {
        const id = orderid.generate();
        // 3016-734428-7759

        orderid.getTime(id);
        // 1479812667797
        res.json({
          bankDetails: {
            bank: 'GTBank',
            accountNumber: '999999999999',
            accountName: 'Geetico',
            orderId: id
          }
        });
      } else {
        initializePayment(form, (error, body) => {
          if (error) {
            //handle errors
            res.status(400).json({ error });
            console.log(error, 'from initilize payment');
            return;
          }
          response = JSON.parse(body);
          res.json({ url: response.data.authorization_url });
        });
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
);

router.get('/paystack/callback', authMiddleWare, async (req, res) => {
  const ref = req.query.reference;
  verifyPayment(ref, async (error, body) => {
    if (error) {
      //handle errors appropriately
      console.log(error);
      return res.status(400).json({ error: '' });
      // return res.redirect('/error');
    }
    let user = await User.findById(req.user.id);

    let response = JSON.parse(body);
    // console.log(response);
    const { reference, amount, customer, metadata, id } = response.data;
    if (user.email !== customer.email) {
      return res.status(400).json({
        success: false,
        msg: 'You are not permitted to perform this operation'
      });
    }

    let data = {
      reference,
      amount,
      // email: customer.email,
      user: req.user.id,
      fullName: metadata.fullName,
      referenceNumber: reference,
      transactionId: id,
      city: metadata.city,
      suite: metadata.suite,
      street: metadata.street,
      phone: metadata.phone,
      company: metadata.company,
      orderNote: metadata.orderNote,
      dateOfDelivery: new Date(metadata.dateOfDelivery),
      timeOfDelivery: metadata.timeOfDelivery,
      orderDetails: Object.keys(metadata.cartToJson).map(prodId => {
        return {
          product: prodId,
          quantity: metadata.cartToJson[prodId]
        };
      })
    };

    let newOrder = new Order(data);
    try {
      const order = await newOrder.save();
      return res.json({ success: true, order });
    } catch (error) {
      // console.log(error.name);
      if (error.name == 'MongoError')
        return res.status(400).json({
          success: false,
          msg: 'Attempting to verify the same transaction twice',
          data
        });
      return res.status(400).json({ error: `${error}` });
      // }
    }
  });
});

module.exports = router;
