const mongoose = require('mongoose');

const CustomOrderSchema = new mongoose.Schema({
  productDetails: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'frontEndUser',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  // isSeller: {
  //   type: Boolean,
  //   default: false
  // },
  avatar: {
    type: String
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
  }
});
function productURLLimit(val) {
  return val.length <= 10;
}
module.exports = CustomOrders = mongoose.model(
  'customorders',
  CustomOrderSchema
);
