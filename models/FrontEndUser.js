// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const FrontEndUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // isSeller: {
  //   type: Boolean,
  //   default: false
  // },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  suite: {
    type: String
  },
  street: {
    type: String
  },
  phone: {
    type: Number
  },
  company: {
    type: String
  },
  orderNote: {
    type: String
  }
});

module.exports = FrontEndUser = mongoose.model(
  'frontEndUser',
  FrontEndUserSchema
); // takes in model name and schema
