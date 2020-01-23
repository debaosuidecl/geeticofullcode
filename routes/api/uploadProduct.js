const express = require('express');
const authMiddleWare = require('../../middleware/auth');
const router = express.Router();
const Product = require('../../models/Product');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const request = require('request');
const escapeRegex = require('../../middleware/escapeRegex');
const config = require('config');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
// const { check, validationResult } = require('express-validator');

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

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + uuid() + file.originalname);
  }
});
var upload = multer({ storage: storage }).array('myImages');

//@route    POST api/upload/test
//@desc     Upload test if no image was uploaded
//@access   public

router.post('/test', upload, async (req, res) => {
  console.log(req.files);
  res.json({ msg: 'done', files: req.files });
});

//@route    POST api/upload/edit/:productId
//@desc     Edit Product fields
//@access   private

router.post(
  '/edit/:productId',
  authMiddleWare,
  [
    check('productName', 'product Name is required')
      .not()
      .isEmpty(),
    check('description', 'Description is required')
      .not()
      .isEmpty(),
    check(
      'description',
      'Description must be between 9 and 300 characters'
    ).isLength({ min: 9, max: 300 }),
    check('category', 'Category is required')
      .not()
      .isEmpty(),
    check('productQuantity', 'Quantity is required')
      .not()
      .isEmpty()
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there are errors
      return res.status(400).json({
        errors: errors.array()
      });
    }
    ``;
    try {
      console.log(req.body);
      const user = await User.findById(req.user.id);

      // console.log(user);
      // I'm gonna change this up very soon
      if (!user.isSeller)
        return res.status(400).json({
          msg: 'not authorized'
        });
      const product = await Product.findOne({
        _id: req.params.productId
      });

      console.log(product, 'line 89');

      const {
        productName,
        price,
        productQuantity,
        category,
        description,
        referenceNumber,
        tags
      } = req.body;
      let adjustedPrice = price
        .toString()
        .split(',')
        .join('');

      product.productName = productName;
      product.price = adjustedPrice;
      product.category = category;
      product.description = description;
      product.referenceNumber = referenceNumber;
      product.tags = tags;
      product.productQuantity = productQuantity;
      product.referenceNumber = referenceNumber;

      await product.save();
      console.log('saved');

      res.json(product);
    } catch (error) {
      res.status(500).json({ msg: 'Server Error' });
      console.log(error);
    }
  }
);

//@route    POST api/upload
//@desc     add productImage
//@access   private
router.post(
  '/addImage/:productId',
  authMiddleWare,
  upload,
  async (req, res) => {
    // console.log(req.files);
    if (req.files[0].size > 2000000) {
      return res.status(400).json({
        errors: {
          msg: 'Image To large. Please compress below 2 mb'
        }
      });
    }
    try {
      const product = await Product.findOne({
        _id: req.params.productId,
        user: req.user.id
      });

      if (product.productURL.length >= 3) {
        return res.status(400).json({
          errors: {
            msg: 'Only 3 images are allowed per product'
          }
        });
      }
      product.productURL = [...product.productURL, req.files[0].filename];
      await product.save();
      return res.json({
        msg: req.files[0].filename
      });
    } catch (error) {}
  }
);

//@route    POST api/upload/deleteImage/:productId/:imageToDelete
//@desc     delete productImage by unlinking
//@access   private

router.delete(
  '/deleteImage/:productId/:imageToDelete',
  authMiddleWare,
  async (req, res) => {
    // console.log(req.files);
    try {
      let product = await Product.findOne({
        _id: req.params.productId,
        user: req.user.id
      });

      if (
        fs.existsSync(
          path.join(__dirname, '..', '..', 'public', req.params.imageToDelete)
        )
      ) {
        try {
          fs.unlinkSync(
            path.join(__dirname, '..', '..', 'public', req.params.imageToDelete)
          );

          let newProductArray = product.productURL.filter(img => {
            return img !== req.params.imageToDelete;
          });
          // console.log(newProductArray);
          product.productURL = newProductArray;
          // console.log('saved');
          await product.save();
          console.log('saved product');
          res.json({
            msg: 'Image Successfully deleted'
          });
        } catch (error) {
          console.log('something went wrong in deleting the file');
          return res.status(400).json({
            errors: {
              msg: 'Something Went Wrong with Deleting the image'
            }
          });
        }
      } else {
        console.error(err, 'from fs exists try catch block');
        return res.status(400).json({
          errors: {
            msg: 'Something Went wrong, image not found'
          }
        });
      }

      // return;
    } catch (error) {
      console.log(error, 'final catch');
      res.status(400).json({
        errors: {
          msg: 'Error deleting this image'
        }
      });
    }
  }
);

//@route    POST api/upload/deleteAll/:productId
//@desc     delete All Product data by unlinking
//@access   private

router.delete('/deleteAll/:productId', authMiddleWare, async (req, res) => {
  // find Product by userId and productId

  // get all product URLs and unlink each one;

  // delete entire product

  // return success message
  try {
    let product = await Product.findOne({
      _id: req.params.productId,
      user: req.user.id
    });
    product.productURL.forEach(image => {
      console.log(image);
      if (fs.existsSync(path.join(__dirname, '..', '..', 'public', image))) {
        console.log('seen', image);
        fs.unlinkSync(path.join(__dirname, '..', '..', 'public', image));
      } else {
        console.log('not seen ', image);
      }
    });
    await Product.deleteOne({ _id: req.params.productId });
    return res.json({ msg: 'Product Sucessfully deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Server Error'
    });
  }
});

//@route    POST api/upload
//@desc     Upload productData
//@access   private
router.post('/', authMiddleWare, upload, async (req, res) => {
  try {
    let productInfo = JSON.parse(req.body.productInfo);

    console.log(productInfo);
    //check if category is allowed
    const {
      productName,
      description,
      category,
      productQuantity,
      price,
      referenceNumber,
      tags
    } = productInfo;

    if (
      allowedCategories.find(category => category === productInfo.category) ===
      undefined
    ) {
      return res.json({ msg: 'Cannot Add that Category' });
    }

    //save productInfo in Mongoose
    let productFilesArray = req.files.map(obj => {
      return obj.filename;
    });
    let adjustedPrice = price.split(',').join('');
    let product = new Product({
      productName,
      description,
      category,
      productQuantity,
      price: adjustedPrice,
      referenceNumber,
      tags,
      productURL: productFilesArray,
      user: req.user.id
    });

    const newProduct = await product.save();

    return res.status(200).json({ msg: newProduct });
  } catch (error) {
    res.json({
      msg: 'Error Adding Product'
    });
    console.log(error);
  }
});

//@route    GET api/upload
//@desc     GET user productData
//@access   private
router.get('/', authMiddleWare, async (req, res) => {
  console.log(req.user.id);
  try {
    const products = await Product.find({ user: req.user.id }).populate(
      'user',
      ['fullName', 'email']
    );
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ msg: 'A Server Error Occured' });
  }
});

//@route    GET api/upload/getAll
//@desc     GET user productData
//@access   private
router.get('/getAll/:page', authMiddleWare, async (req, res) => {
  console.log(req.user.id);

  try {
    // Declaring variable
    const resPerPage = 25; // results per page
    const page = req.params.page || 1; // Page

    if (req.query.search) {
      regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Find Demanded Products - Skipping page values, limit results       per page
      const foundProducts = await Product.find({
        user: req.user.id
      })
        .skip(resPerPage * page - resPerPage)
        .sort({ date: -1 })
        .limit(resPerPage);

      return res.json(foundProducts);
    } else {
      // return res.status(400).json({ msg: 'no query was issued' });
      const foundProducts = await Product.find({ user: req.user.id })
        .skip(resPerPage * page - resPerPage)
        .sort({ date: -1 })
        .limit(resPerPage);
      return res.json(foundProducts);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'A Server Error Occured' });
  }
});
//@route    GET api/upload/getAll
//@desc     GET user specific product
//@access   private
router.get('/usersp/:page', authMiddleWare, async (req, res) => {
  // console.log(req.user.id);
  try {
    // Declaring variable
    const resPerPage = 25; // results per page
    const page = req.params.page || 1; // Page

    if (req.query.search) {
      regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Find Demanded Products - Skipping page values, limit results       per page
      const foundProducts = await Product.find({
        tags: regex,
        user: req.user.id
      })

        .sort({ date: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);
      const foundByCat = await Product.find({
        category: regex,
        user: req.user.id
      })
        .sort({ date: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);
      const foundByName = await Product.find({
        productName: regex,
        user: req.user.id
      })
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
      const foundProducts = await Product.find({ user: req.user.id })
        .sort({ date: -1 })
        .skip(resPerPage * page - resPerPage)
        .limit(resPerPage);
      return res.json(foundProducts);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'A Server Error Occured' });
  }
});

//@route    GET api/upload/details/:productId
//@desc     GET single product
//@access   private

router.get('/details/:productId', authMiddleWare, async (req, res) => {
  try {
    try {
      const product = await Product.findOne({
        _id: req.params.productId
      });
      // console.log(product);
      return res.json(product);
    } catch (error) {
      return res.status(400).json([]);
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

//@route    POST api/profile/
//@desc     Create or update a user profile
//@access   private

router.post(
  '/',
  [
    authMiddleWare,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedIn
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(s => s.trim());
    }

    // build social object

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedIn) profileFields.social.linkedIn = linkedIn;
    if (twitter) profileFields.social.twitter = twitter;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // we want to update it
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //else if none is find we want to create a profile

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
