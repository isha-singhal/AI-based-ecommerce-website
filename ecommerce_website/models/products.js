const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  category: {
    type: String,
  },
  //   user: {
  //     type: Schema.types.ObjectId,
  //   },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
  },
  name: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Product', ProductSchema);
