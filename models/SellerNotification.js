// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const SellerNotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'frontEndUser',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  notification: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orders',
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Notification = mongoose.model(
  'sellerNotification',
  SellerNotificationSchema
); // takes in model name and schema
