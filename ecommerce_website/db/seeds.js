const mongoose = require('mongoose');

const mongoPath =
  'mongodb+srv://useradmin:2UZuojG0StZ0Gjm0@cluster0.2vjog.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose
  .connect(mongoPath, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('success');
  })
  .catch((err) => {
    console.log(err);
  });

const owners = [
  //s -> s1
  '610216650b3c6f2fa870d425',
  '610216a20b3c6f2fa870d433',
];

const {
  prices,
  rating,
  prefix,
  quantities,
  phoneNames,
} = require('./seedHelpers');
const Products = require('../models/products');

const seedDB = async () => {
  await Products.deleteMany({});
  for (let i = 0; i < 15; i++) {
    const random11 = Math.floor(Math.random() * 12);
    const product = new Products({
      price: prices[random11],
      description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam at consequuntur blanditiis accusamus ex repudiandae est obcaecati reprehenderit nesciunt ratione!`,
      category: 'Phone',
      rating: rating[random11],
      name: `${phoneNames[random11]} ${prefix[random11]}`,
      quantity: quantities[random11],
      owner: i <= 4 ? '610216650b3c6f2fa870d425' : '610216a20b3c6f2fa870d433',
    });
    await product.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
