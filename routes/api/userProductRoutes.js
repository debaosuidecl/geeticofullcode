const express = require('express');
const authMiddleWare = require('../../middleware/auth');
const escapeRegex = require('../../middleware/escapeRegex');
const router = express.Router();
const Product = require('../../models/Product');
const { check, validationResult } = require('express-validator');

// const { check, validationResult } = require('express-validator');

// const allowedCategories = [
//   'Beer, Wine & Spirit',
//   'Food Cupboard',
//   'Beverages',
//   'Drinks',
//   'Cooking & Baking',
//   'Dried Beans, Grains & Rice',
//   'Breakfast Foods',
//   'Herbs Spices & Seasoning',
//   'Candy & Chocolate',
//   'Canned, Jarred & Packaged Foods',
//   'Jams, Jellies & Sweet Spreads',
//   'Condiments & Salad Dressings'
// ];

const allowedCategories = [
  'Beer, Wine and Spirit',
  'Beverages',
  'Drinks',
  'Cooking, Spices and Baking Ingredients',
  // 'Cooking, Baking & Ingredients',
  // 'Herbs Spices & Seasoning',
  // 'Dried Beans, Grains & Rice',
  'Food Cupboard and Breakfast Food',
  // 'Food Cupboard',
  // 'Breakfast Foods',
  'Biscuits, Candy and Chocolate',
  'Jams, Canned and Packaged Condiments',
  // 'Canned, Jarred & Packaged Foods',
  // 'Jams, Jellies & Sweet Spreads',
  // 'Condiments & Salad Dressings',
  'Household Supplies'
];
//@route    GET api/userproducts
//@desc     GET user productData
//@access   public
router.get('/:page', async (req, res) => {
  // console.log(req.user.id);
  try {
    // Declaring variable
    const resPerPage = 25; // results per page
    const page = req.params.page || 1; // Page

    if (req.query.search) {
      // Declaring query based/search variables
      //  const searchQuery = req.query.search,
      regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Find Demanded Products - Skipping page values, limit results       per page
      const foundProducts = await Product.find({ tags: regex })
        .sort({ date: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);
      const foundByCat = await Product.find({ category: regex })
        .sort({ date: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);
      const foundByName = await Product.find({ productName: regex })
        .sort({ date: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);

      let possibleDuplicates = req.query.excludeCat
        ? [...foundByName, ...foundProducts].map(j => JSON.stringify(j))
        : req.query.nameOnly
        ? [...foundByName].map(j => JSON.stringify(j))
        : [...foundByName, ...foundProducts, ...foundByCat].map(j =>
            JSON.stringify(j)
          );
      const uniqueSet = new Set(possibleDuplicates);
      const uniqueArray = [...uniqueSet].map(s => JSON.parse(s));

      return res.json(uniqueArray);
    } else {
      // return res.status(400).json({ msg: 'no query was issued' });
      const foundProducts = await Product.find()
        .sort({ date: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);
      return res.json(foundProducts);
    }
  } catch (error) {
    return res.status(500).json({ msg: 'A Server Error Occured' });
  }
});

//@route    GET api/userproducts/details/:productId
//@desc     GET single product
//@access   public

router.get('/details/:productId', async (req, res) => {
  try {
    try {
      const product = await Product.findOne({
        _id: req.params.productId
      });
      // console.log(product);

      // console.log(product);
      if (product === null) {
        return res.json({
          deleteId: req.params.productId
        });
      }
      return res.json(product);
    } catch (error) {
      return res.status(400).json([]);
    }
  } catch (error) {
    return res.status(500).json({ msg: 'A Server Error Occured' });
  }
});

//@route    GET api/userproducts/category/:page
//@desc     GET product in particular category
//@access   public

router.get('/category/:search/:page', async (req, res) => {
  try {
    // Declaring variable
    const resPerPage = 25; // results per page
    const page = req.params.page || 1; // Page
    console.log(req.params.search);
    if (req.params.search) {
      if (
        allowedCategories.find(category => category === req.params.search) ===
        undefined
      ) {
        return res.status(404).json({ msg: 'Cannot find that Category' });
      }

      regex = new RegExp(
        escapeRegex(
          req.params.search
            .replace('&', ' ')
            .replace(',', ' ')
            .split(' ')[0]
        ),
        'gi'
      );

      const foundByCat = await Product.find({ category: regex })
        .sort({ date: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);

      return res.json([...foundByCat]);
    } else {
      return res.status(404).json({ msg: 'Category Product Not Found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'A Server Error Occured' });
  }
});

router.get('/me', authMiddleWare, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

//@route    POST api/userproducts/reviews
//@desc     POST post a review
//@access   private
router.post(
  '/reviews/:id',
  [
    check('rating', 'Rating is required').isNumeric(),
    check('comment', 'Your comment is required')
      .not()
      .isEmpty()
  ],
  authMiddleWare,
  async (req, res) => {
    try {
      const { rating, comment } = req.body;
      let product = await Product.findById(req.params.id);

      let arrayToEdit = [...product.reviews];
      let index = arrayToEdit.findIndex(review => {
        // console.log(review.user.toString(), req.user.id);
        return review.user.toString() === req.user.id;
      });

      console.log(index);
      if (index === -1) {
        arrayToEdit.push({
          user: req.user.id,
          rating,
          comment
        });
      } else {
        arrayToEdit[index] = {
          user: req.user.id,
          rating,
          comment
        };
      }
      product.reviews = arrayToEdit;
      let newProduct = await product.save();
      res.send(newProduct);
    } catch (error) {
      res.status(400).json({ error, msg: 'An error occured' });
    }
  }
);

router.delete('/reviews/:id', authMiddleWare, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    let arrayToEdit = [...product.reviews];
    let newArray = arrayToEdit.filter(review => {
      // console.log(review.user.toString(), req.user.id);
      return review.user.toString() !== req.user.id;
    });

    product.reviews = newArray;
    let newProduct = await product.save();
    res.send(newProduct);
  } catch (error) {
    console.log(error, 'uuu');
    res.status(400).json({ error, msg: 'An error occured' });
  }
});
module.exports = router;
