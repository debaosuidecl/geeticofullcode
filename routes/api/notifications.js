const express = require('express');
const SellerNotification = require('../../models/SellerNotification');
const BuyerNotification = require('../../models/BuyerNotification');
const User = require('../../models/User');
const router = express.Router();
const authMiddleWare = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

//@route    GET api/notifications
//@desc     get seller specific notifications
//@access   private

router.get('/:page', authMiddleWare, async (req, res) => {
  try {
    const resPerPage = 50; // results per page
    const page = req.params.page || 1; // Page
    let notifications;

    if (req.query.buyer) {
      // console.log("let's get the buyer");
      let newNotifications = await BuyerNotification.find({
        user: req.user.id
      })
        .sort('-date')
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);
      // console.log(newNotifications);
      if (req.query.getCount) {
        let countOfUnreadMessages = await BuyerNotification.countDocuments({
          user: req.user.id,
          read: false
        });
        notifications = {
          notifications: newNotifications,
          countOfUnreadMessages
        };
      }
      // console.log(notifications);
      return res.json(notifications);
    }
    // if it is not a buyer

    let newNotifications = await SellerNotification.find({
      seller: req.user.id
    })
      .sort('-date')
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage);

    if (req.query.getCount) {
      let countOfUnreadMessages = await SellerNotification.countDocuments({
        seller: req.user.id,
        read: false
      });
      notifications = {
        notifications: newNotifications,
        countOfUnreadMessages
      };
    }
    return res.json(notifications);
  } catch (error) {
    res.status(500).send('server error');
  }
});
//@route    POST  api/notifications/changesellertoread/:orderId
//@desc     Change Notification to read
//@access   private

router.get('/changesellertoread/:orderId', authMiddleWare, async (req, res) => {
  try {
    if (req.query.buyer) {
      let notification = await BuyerNotification.findOne({
        order: req.params.orderId,
        user: req.user.id,
        read: false
      });
      if (!notification) {
        return res.status(404).send('not found');
      }
      notification.read = true;
      await notification.save();
      return res.send('success');
    }
    let notification = await SellerNotification.findOne({
      order: req.params.orderId,
      seller: req.user.id,
      read: false
    });
    if (!notification) {
      return res.status(404).send('not found');
    }
    notification.read = true;
    await notification.save();
    res.send('success');
  } catch (error) {
    console.log(error);
    res.status(500).send('server error');
  }
});
module.exports = router;
