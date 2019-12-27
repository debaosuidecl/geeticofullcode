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

router.get('/', authMiddleWare, async (req, res) => {
  try {
    if (req.query.buyer) {
      // console.log("let's get the buyer");
      const unReadNotifications = await BuyerNotification.find({
        user: req.user.id,
        read: false
      });

      const readNotifications = await BuyerNotification.find({
        user: req.user.id,
        read: true
      });
      let notifications = {
        notifications: [...unReadNotifications, ...readNotifications]
      };
      if (req.query.getCount) {
        let countOfUnreadMessages = await BuyerNotification.countDocuments({
          user: req.user.id,
          read: false
        });
        notifications = { notifications: notifications, countOfUnreadMessages };
      }
      return res.json(notifications);
    }
    // if it is not a buyer
    const unReadNotifications = await SellerNotification.find({
      seller: req.user.id,
      read: false
    });

    const readNotifications = await SellerNotification.find({
      seller: req.user.id,
      read: true
    });
    let notifications = {
      notifications: [...unReadNotifications, ...readNotifications]
    };
    if (req.query.getCount) {
      let countOfUnreadMessages = await SellerNotification.countDocuments({
        seller: req.user.id,
        read: false
      });
      notifications = { notifications: notifications, countOfUnreadMessages };
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
