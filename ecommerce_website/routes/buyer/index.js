const express = require('express');
const router = express.Router({ mergeParams: true });
const Products = require('../../models/products');
const User = require('../../models/user');
const passport = require('passport');
const catchAsync = require('../../utils/catchAsync');

router.get(
  '/',
  catchAsync(async (req, res) => {
    const allProducts = await Products.find({}).populate('owner');
    // console.log(allProducts);

    // const owners = allProducts.owner;
    // console.log('owners--> ', owners);
    res.render('buy/home', { allProducts });
  })
);

//-----------------------------------

router.post(
  '/',
  catchAsync(async (req, res) => {
    const { username, password, email } = req.body;
    const user_ = new User({
      username,
      email,
    });
    const registeredUser = await User.register(user_, password);
    // console.log(req.body);
    // console.log(registeredUser);
    try {
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        res.redirect('/');
      });
    } catch (e) {
      res.redirect('/');
    }
  })
);

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: false,
    failureRedirect: '/',
  }),
  catchAsync(async (req, res) => {
    // const pathh = req.originalUrl || '/';
    res.locals.buyer = 1;
    // console.log('buyer');
    res.redirect('/');
  })
);

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const product_ = await Products.findById(id).populate('owner');
    // console.log(product_);

    res.render('buy/show', { product_ });
  })
);

router.get(
  '/:id/delete',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const product_ = await Products.findById(id).populate('owner');
    // console.log(product_);

    res.render('buy/show', { product_ });
  })
);

module.exports = router;
