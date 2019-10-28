const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  productName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  productQuantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  referenceNumber: {
    type: String
    // required: true
  },
  productURL: {
    type: [String], // array of strings
    required: true,
    validate: [productURLLimit, '{PATH} exceeds the limit of 3']
  },
  tags: {
    type: [String], // array of strings
    required: true
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'frontEndUser'
      },
      rating: {
        type: Number
      },
      comment: {
        type: String
      }
    }
  ],

  date: {
    type: Date,
    default: Date.now
  }
});
function productURLLimit(val) {
  return val.length <= 10;
}
module.exports = Product = mongoose.model('products', ProductSchema);
