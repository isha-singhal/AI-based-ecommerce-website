const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../../models/user');
const Product = require('../../models/products');
const passport = require('passport');
const catchAsync = require('../../utils/catchAsync');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

router.get('/', (req, res) => {
  res.redirect('/');
});

router.post(
  '/',
  catchAsync(async (req, res) => {
    const { username, password, email } = req.body;
    const user_ = new User({
      username,
      email,
      buyer: false,
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
    res.redirect('/');
  })
);

router.get(
  '/create',
  catchAsync(async (req, res) => {
    // const pathh = req.originalUrl || '/';
    // console.log(req.user);
    res.render('sell/create');
  })
);

router.post(
  '/create',
  catchAsync(async (req, res) => {
    // const pathh = req.originalUrl || '/';
    const { product } = req.body;
    const product_ = new Product(product);
    const sellerId = req.user._id;
    const seller = await User.findById(sellerId);
    product_.owner = sellerId;
    await product_.save();
    seller.products.push(product_);
    await seller.save();
    // console.log('seller -->', seller);
    // console.log('Product IS : ', product_);

    res.redirect('/buy');
  })
);

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    // this is user id
    const { id } = req.params;
    // console.log('id -- >', id);
    const user_ = await User.findById(id).populate('products');
    const userProducts = user_.products;
    res.render('sell/allproducts', { userProducts });
  })
);

router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    // this is product id !
    const { id } = req.params;
    const product_ = await Product.findById(id).populate('owner');
    const ownerId = product_.owner._id;
    const owner__ = await User.findByIdAndUpdate(ownerId, {
      $pull: { products: id },
    }).populate('products');

    const product__ = await Product.findByIdAndDelete(id);

    const allProducts = await Product.find({}).populate('owner');
    res.render('buy/home', { allProducts });
  })
);

module.exports = router;
