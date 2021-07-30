const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pasportLM = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  buyer: {
    type: Boolean,
    default: true,
  },
});

UserSchema.plugin(pasportLM);

module.exports = mongoose.model('User', UserSchema);
