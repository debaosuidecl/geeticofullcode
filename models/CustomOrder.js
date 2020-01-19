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
  }
});
function productURLLimit(val) {
  return val.length <= 10;
}
module.exports = CustomOrders = mongoose.model(
  'cutomorders',
  CustomOrderSchema
);
