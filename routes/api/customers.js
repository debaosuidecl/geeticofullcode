const express = require('express');

const FrontEndUser = require('../../models/FrontEndUser');
const router = express.Router();
const authMiddleWare = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

//@route    GET api/customers
//@desc     get seller specific notifications
//@access   private

router.get('/:page', authMiddleWare, async (req, res) => {
  try {
    const resPerPage = 20; // results per page
    const page = req.params.page || 1; // Page
    const customers = await FrontEndUser.find({})
      .sort('-date')
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage);

    return res.json(customers);
  } catch (error) {
    res.status(500).send('server error');
  }
});

module.exports = router;
