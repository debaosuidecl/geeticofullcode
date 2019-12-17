const connectDB = require('./config/db');
let User = require('./models/User');
let Product = require('./models/Product');
const escapeRegex = require('./middleware/escapeRegex');
regex = new RegExp(escapeRegex('cooking'), 'gi');

// require('dotenv').config();
connectDB();
let mailingList = [];
(async () => {
  try {
    const foundProducts = await Product.find({ tags: regex })
      .sort({ date: -1 })
      .skip(5 * 1 - 5)
      .limit(5);
    // console.log(foundProducts.user);
    let idList = foundProducts.map(p => p.user.toString());
    // let users = await User.find().populate('-email');
    console.log(idList);
    const set = new Set(idList);
    const newArray = [...set];
    for (i = 0; i < newArray.length; i++) {
      let user = await User.findById(newArray[i]);
      mailingList.push(user.email);
    }
    console.log(mailingList);
    console.log(newArray);

    // console.log(users);
  } catch (error) {
    console.error(error);
  }
})();
