const express = require('express');
const orderid = require('order-id')('geetico2019');

const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/FrontEndUser'); // bring in the user model
const Seller = require('../../models/User'); // bring in the seller model
const Product = require('../../models/Product'); // bring in the product model
const Order = require('../../models/Order'); // bring in the order model
const SellerNotification = require('../../models/SellerNotification'); // bring in the notification model
const BuyerNotification = require('../../models/BuyerNotification'); // bring in the notification model
const authMiddleWare = require('../../middleware/auth');
const getShippingCost = require('../../middleware/getShippingCost');
const contentGenerator = require('../../middleware/contentGenerator');
const sellerVerificationEmailContent = require('../../middleware/sellerVerificationEmailContent');
// const contentGenerator = require('../../middleware/contentGenerator');
// const path = require("path");
// const Order = require('../../models/Order');
const request = require('request');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const authConfig = require('../../config/config');
const nodemailer = require('nodemailer');
const { initializePayment, verifyPayment } = require('../../config/paystack')(
  request
);
const multer = require('multer');

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

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'test-public');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + uuid() + file.originalname);
  }
});
var upload = multer({ storage: storage }).array('myImages');

// @route    POST api/users
// @desc     Register User
// @access   public
router.post(
  '/',
  [
    check('fullName', 'Your full name is required')
      .not()
      .isEmpty(),
    check('phoneNumber', 'Please enter a valid Nigerian Phone Number').matches(
      /^[0]\d{10}/
    ),
    check('email', 'Use a valid Email').isEmail(),
    check(
      'password',
      'Please Enter a password with 8 or more characters'
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

    const { fullName, email, password, phoneNumber } = req.body;

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
        password,
        phone: phoneNumber
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

        const url = `https://geetico.com/confirmation/${token}`;

        transporter.sendMail({
          from: 'Geetico.com <contact@geetico.com>',
          to: user.email,
          subject: 'Please confirm your email address with geetico.com',
          html: `Hi ${user.fullName}!. <br> <p> Thanks a lot for registering on geetico.com. Please click this link to confirm your email: <a href="${url}">${url}</a></p>`
        });
        res.json({
          timeToVerifyUser: true
        });
        // res.json({ token, avatar: user.avatar, fullName: user.fullName });
      });
    } catch (e) {
      console.error(e);
      res.status(500).send('Server Error');
    }
  }
);

// @route GET /api/users/confirmation/:token
// @DESC  confirm the user
// @ public...

router.get('/confirmation/:token', async (req, res) => {
  try {
    const {
      user: { id }
    } = jwt.verify(req.params.token, config.get('jwtSecret'));
    let userToConfirm = await User.findById(id);
    if (!userToConfirm) {
      return res.status(404).json({
        success: false,
        msg: 'User not found'
      });
    }
    console.log('found user');
    userToConfirm.isConfirmed = true;
    userToConfirm.save();
    const payload = {
      user: {
        id: userToConfirm.id
      }
    };

    jwt.sign(payload, config.get('jwtSecret'), null, (error, token) => {
      if (error) throw error;

      res.json({
        token,
        email: userToConfirm.email,
        fullName: userToConfirm.fullName,
        _id: userToConfirm.id,
        avatar: userToConfirm.avatar
      });
    });

    // return res.json({ success: true });
  } catch (error) {
    return res.status(500).send('server error');
  }
});

const extractProduct = async orderDetails => {
  let myProducts = await Promise.all(
    orderDetails.map(prod => {
      return new Promise(async (resolve, reject) => {
        let fullProduct = await Product.findById(prod.product);
        console.log(fullProduct, 'from orders');
        if (fullProduct) {
          resolve({ ...fullProduct._doc, quantity: prod.quantity });
        }
      });
    })
  );
  return myProducts;
};

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
    check('timeOfDelivery', 'Delivery time is required').isIn([1, 2, 3, 4])
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
        let data = {
          amount: amount * 100,
          // email: customer.email,
          directPaymentMethod: true,
          user: req.user.id,
          fullName: user.fullName,
          referenceNumber: id,
          transactionId: id,
          city: city,
          suite: suite,
          street: street,
          phone: phone,
          company: company,
          orderNote: orderNote,
          dateOfDelivery: new Date(dateOfDelivery),
          timeOfDelivery: timeOfDelivery,
          status: 'awaiting verification',
          orderDetails: Object.keys(cartToJson).map(prodId => {
            return {
              product: prodId,
              quantity: cartToJson[prodId]
            };
          })
        };
        data = {
          ...data,
          orderDetails: await extractProduct(data.orderDetails)
        };
        // save the user details
        let newOrder = new Order(data);
        await newOrder.save();

        // console.log(newArray);

        // let notification =- new Notification({
        //   seller:
        // })
        // let {name, email, message} = req.body;
        // let orderdetails = data.orderDetails.map(
        //   prod => `<p>${prod.productName} X ${prod.quantity} </p>`
        // );
        let content = contentGenerator(
          data,
          data.orderDetails,
          getShippingCost(amount, directSelected)
        );
        let mail = {
          from: 'Geetico.com <contact@geetico.com>',
          to: user.email,
          subject: `Verify your order at geetico.com`,
          html: content
        };

        transporter.sendMail(mail, (err, data) => {
          if (err) {
            console.log(err);
            res.send('Failed to send your message');
          } else {
            // res.send('Your message has been sent');
            res.json({
              bankDetails: {
                bank: 'GTBank',
                accountNumber: '0122958763',
                accountName: 'Geetico HQ',
                newOrder
              }
            });
          }
          console.log(data, 'data');
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
    data = {
      ...data,
      orderDetails: await extractProduct(data.orderDetails)
    };
    console.log(data, 'after the effect');
    let newOrder = new Order(data);
    try {
      const order = await newOrder.save();
      return res.json({ success: true, order });
    } catch (error) {
      console.log(error);
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

router.get('/directPaymentOrder', authMiddleWare, async (req, res) => {
  try {
    // let user = await User.findById(req.user.id);
    let directPaymentOrder = await Order.findOne({
      transactionId: req.query.transactionId,
      directPaymentMethod: true
      // status: 'awaiting verification'
    });
    if (!directPaymentOrder) {
      return res.status(400).json({ noDirectPayment: true });
    }
    if (
      directPaymentOrder.status === 'verification rejected' ||
      directPaymentOrder.status === 'awaiting verification'
    ) {
      return res.json({
        ...directPaymentOrder,
        bankDetails: {
          bank: 'GTBank',
          accountNumber: '0122958763',
          accountName: 'Geetico HQ'
        }
      });
    } else {
      return res.status(400).json({ noDirectPayment: true });
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

//@route    POST api/users/verification-image
//@desc     upload a verificationImage
//@access   private

router.post(
  '/verification-image/:transactionId',
  authMiddleWare,
  upload,
  async (req, res) => {
    console.log(req.files);
    try {
      let user = await User.findById(req.user.id);
      let order = await Order.findOne({
        transactionId: req.params.transactionId,
        // status: 'awaiting verification',
        directPaymentMethod: true
      });
      console.log(order);
      let isRejected = order.status === 'verification rejected';
      if (!order) {
        return res.status(400).send('No order awaiting verification found');
      }
      // if(order === "verification rejected")

      if (order.status === 'verification rejected') {
        try {
          fs.unlinkSync(
            path.join(
              __dirname,
              '..',
              '..',
              'test-public',
              order.verificationImage
            )
          );
          console.log('unlink success');
        } catch (error) {
          console.log(error, "image doesn't exist");
        }
      }

      order.status = 'verification in progress';
      order.verificationImage = req.files[0].filename;
      // console.log(order.transactionId, 'the tranac');
      await order.save();

      let mailingList = [];

      let idList = order.orderDetails.map(p => p.user.toString());
      // let users = await User.find().populate('-email');
      // console.log(idList);
      const set = new Set(idList);
      const newArray = [...set];
      for (i = 0; i < newArray.length; i++) {
        let seller = await Seller.findById(newArray[i]);
        mailingList.push({
          sellerEmail: seller.email,
          sellerName: seller.fullName,
          sellerID: seller._id,
          buyerName: user.fullName
        });
      }
      console.log(mailingList);

      for (i = 0; i < mailingList.length; i++) {
        let newSellerNotification = new SellerNotification({
          user: req.user.id,
          seller: mailingList[i].sellerID,
          notification: `You just received a payment verification document from ${
            mailingList[i].buyerName
          } ${isRejected ? 'whose document was previously rejected.' : ''}`,
          order: order._id
        });
        await newSellerNotification.save();
      }
      let newBuyerNotification = new BuyerNotification({
        user: req.user.id,
        notification: `${
          isRejected
            ? 'Your document has been resubmitted and will be verified with our team shortly'
            : 'You just Completed your order'
        }`,
        order: order._id
      });
      await newBuyerNotification.save();

      mailingList.forEach(function(to, i, array) {
        let content = sellerVerificationEmailContent(
          to.sellerName,
          to.buyerName
        );

        let mail = {
          from: 'Geetico.com <contact@geetico.com>',
          to: to.sellerEmail,
          subject: `verification picture submitted at geetico.com`,
          html: content
        };

        transporter.sendMail(mail, (err, data) => {
          if (err) {
            console.log(err);
            // res.send('Failed to send your message');
          } else {
            // res.send('Your message has been sent');
          }
        });
        if (i === mailingList.length - 1) {
          res.json({ msg: 'done', orderId: order.transactionId });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error,
        msg: 'there was an error in adding the product'
      });
    }
  }
);

module.exports = router;
