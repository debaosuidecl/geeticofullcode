const express = require('express');
const authMiddleWare = require('../../middleware/auth');
const router = express.Router();
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const { check, validationResult } = require('express-validator');


const extractProduct = async orderDetails => {
  let myProducts = await Promise.all(
    orderDetails.map(prod => {
      return new Promise(async (resolve, reject) => {
        let fullProduct = await Product.findById(prod.product);
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

//@route    GET api/userorders/
//@desc     Fetch All Orders
//@access   private

router.get('/all/:page', authMiddleWare, async (req, res) => {
  const resPerPage = 10; // results per page
  const page = req.params.page || 1; // Page

  if (req.user.id.toString() !== '5d8b3d7b29bd9b1bf0c3e546') {
    return res.status(400).json({
      msg: 'You are not authorized to view this please'
    });
  }
  try {
    // let count = await Order.estimatedDocumentCount();
    let orders = await Order.find({})
      .sort({ dateOfDelivery: 1, timeOfDelivery: 1 })
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

//@route    GET api/userorders/:status/:page
//@desc     Fetch  All Orders by status
//@access   private

router.get('/all/:status/:page', authMiddleWare, async (req, res) => {
  const resPerPage = 20; // results per page
  const page = req.params.page || 1; // Page

  if (req.user.id.toString() !== '5d8b3d7b29bd9b1bf0c3e546') {
    return res.status(400).json({
      msg: 'You are not authorized to view this please'
    });
  }
  try {
    let orders = await Order.find({
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
      'delivered'
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
    if (req.user.id.toString() !== '5d8b3d7b29bd9b1bf0c3e546') {
      return res.status(400).json({
        msg: 'You are not authorized to view this please'
      });
    }
    const { status } = req.body;
    let order = await Order.findById(req.params.orderId);

    order.status = status;

    await order.save();
    res.json({ status });
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
