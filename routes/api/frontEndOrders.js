const express = require('express');
const authMiddleWare = require('../../middleware/auth');
const router = express.Router();
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const { check, validationResult } = require('express-validator');
const authConfig = require('../../config/config');
const statusChangeEmail = require('../../middleware/statusChangeEmail');
const nodemailer = require('nodemailer');
const BuyerNotification = require('../../models/BuyerNotification'); // bring in the notification model
const User = require('../../models/FrontEndUser');
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

const extractProduct = async orderDetails => {
  let myProducts = await Promise.all(
    orderDetails.map(prod => {
      return new Promise(async (resolve, reject) => {
        let fullProduct = await Product.findById(prod.product);
        console.log(fullProduct, 'from orders');
        if (fullProduct) {
          resolve({ fullProduct, quantity: prod.quantity });
        }
      });
    })
  );
  return myProducts;
};

//@route    GET api/userorders/
//@desc     Fetch User Orders
//@access   private

router.get('/:page', authMiddleWare, async (req, res) => {
  const resPerPage = 20; // results per page
  const page = req.params.page || 1; // Page
  try {
    let orders = await Order.find({
      user: req.user.id
    })
      .sort('-date')
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage);
    return res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, msg: 'error in fetch' });
  }
});

// @route GET api/userorders/single/:orderId
// @desc Fetch a single order
// @access Private

router.get('/single/:orderId', authMiddleWare, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).send('resource not found');
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
//@route    GET api/userorders/:status/:page
//@desc     Fetch  All Orders by status
//@access   private

router.get('/all/:page', authMiddleWare, async (req, res) => {
  const resPerPage = 20; // results per page
  const page = req.params.page || 1; // Page

  // if (req.user.id.toString() !== '5d8b3d7b29bd9b1bf0c3e546') {
  //   return res.status(400).json({
  //     msg: 'You are not authorized to view this please'
  //   });
  // }
  try {
    // console.log(req.query.status);
    if (req.query.status) {
      let orders = await Order.find({
        status: req.query.status
      })
        .sort('-date')
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);
      return res.json(orders);
    } else {
      let orders = await Order.find({})
        .sort('-date')
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);
      return res.json(orders);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, msg: 'error in fetch' });
  }
});

//@route    POST api/userorders/all/statusChange
//@desc     Change Status
//@access   private

router.post(
  '/all/statusChange/:orderId',
  authMiddleWare,
  [
    check('status', 'Status not found').isIn([
      'shipped',
      'processing',
      'delivered',
      'verification in progress',
      'awaiting verification',
      'verification rejected'
    ])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there are errors
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { status } = req.body;
    let order = await Order.findById(req.params.orderId);

    order.status = status;

    await order.save();
    // console.log('order saved');
    let userBuyer;
    try {
      userBuyer = await User.findById(order.user);
    } catch (error) {
      console.log(error, 'could not find user');
      return res.status(400).json({ msg: 'Could not find the user' });
    }
    if (status = "verification rejected"){
      
    }
    let newBuyerNotification = new BuyerNotification({
      user: order.user,
      notification: status === "verification rejected"? `The verification document you submitted has been rejected`:`The status of your order has been changed to ${status}`,
      order: order._id
    });
    await newBuyerNotification.save();
    // console.log('buyer notification saved');
    let notificationText = `Hi ${order.fullName} the status of your order has been changed to ${status}`;
    await newBuyerNotification.save();
    let content = statusChangeEmail(notificationText, order.order_id);
    let mail = {
      from: 'Geetico.com <contact@geetico.com>',
      to: userBuyer.email,
      subject: `Status of your Order has been changed at geetico.com `,
      html: content
    };

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        // res.send('Failed to send your message');
      } else {
        // res.send('Your message has been sent');
        console.log('sent');
        res.json({ status });
      }
    });
  }
);

//@route    GET api/userorders/single/:transactionId
//@desc     Fetch One Order by transactionId
//@access   private

router.get('/single/:transactionId', authMiddleWare, async (req, res) => {
  try {
    let order = await Order.find({ transactionId: req.params.transactionId });
    if (order.length > 0) {
      return res.json(order);
    } else {
      return res.status(400).json({ msg: "Ooof didn't find that sorry" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'error desu kedo' });
  }
});

//@route    GET api/userorders/:status/:page
//@desc     Fetch One Order by status
//@access   private

router.get('/:status/:page', authMiddleWare, async (req, res) => {
  const resPerPage = 20; // results per page
  const page = req.params.page || 1; // Page
  try {
    let orders = await Order.find({
      user: req.user.id,
      status: req.params.status
    })
      .sort('-date')
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage);

    try {
      await Promise.all(
        orders.map(o => {
          return new Promise(async (resolve, reject) => {
            let editedOrder = {
              ...o._doc,
              orderDetails: await extractProduct(o._doc.orderDetails)
            };
            // console.log(editedOrder, 'edit me');
            if (editedOrder) {
              resolve(editedOrder);
            }
          });
        })
      ).then(result => {
        res.json(result);
      });
    } catch (error) {
      console.log(error, 'fetch issue');
      res.status(400).json({ error, msg: 'error in fetch' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, msg: 'error in fetch' });
  }
});

module.exports = router;
