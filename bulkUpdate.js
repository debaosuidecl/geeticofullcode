const connectDB = require('./config/db');
const Product = require('./models/Product');
// const moment = require('moment');
connectDB();
// let timeout;

// console.log(
//   new Date(
//     moment(new Date())
//       .add(0, 'm')
//       .toISOString()
//   ) > new Date()
// );
console.log(new Date());
// return;
const update = async () => {
  try {
    Product.updateMany(
      {
        category: 'Condiments & Salad Dressings'
      },
      {
        $set: {
          category: 'Jams, Canned and Packaged Condiments'
          // timeTillRevival: new Date()
        }
      },
      (err, data) => {
        console.log(data, ' was affected');
      }
    );
  } catch (error) {
    // update();
    console.log(error);
  }
};

update();
