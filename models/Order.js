const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'frontEndUser',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  orderDetails: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  referenceNumber: {
    type: String,
    required: true,
    unique: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  dateOfDelivery: {
    type: Date,
    required: true
  },
  timeOfDelivery: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'processing'
  },

  date: {
    type: Date,
    default: Date.now
  },
  city: {
    type: String,
    required: true
  },
  suite: {
    type: String
  },
  street: {
    type: String,
    required: true
  },
  fullName: {
    type: String
  },
  phone: {
    type: Number,
    required: true
  },
  orderNote: {
    type: String
  },
  company: {
    type: String
  }
});

module.exports = Order = mongoose.model('orders', OrderSchema);
