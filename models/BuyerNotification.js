// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const BuyerNotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'frontEndUser',
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
  }
});

module.exports = BuyerNofication = mongoose.model(
  'buyerNotification',
  BuyerNotificationSchema
); // takes in model name and schema
