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
      // product: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'products',
      //   required: true
      // },
      quantity: {
        type: Number,
        required: true
      },
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
  directPaymentMethod: {
    type: Boolean,
    default: false
  },
  company: {
    type: String
  },
  verificationImage: {
    type: String
  }
});
function productURLLimit(val) {
  return val.length <= 10;
}
module.exports = Order = mongoose.model('orders', OrderSchema);
