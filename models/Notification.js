// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
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
  }
});

module.exports = Notification = mongoose.model(
  'notification',
  NotificationSchema
); // takes in model name and schema
