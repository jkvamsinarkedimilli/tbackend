const mongoose = require('mongoose');
const stockHoldingSchema = new mongoose.Schema(
  {
    stockName: {
      type: String,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    mode: {
      type: String,
    },
  },
  { timestamps: true }
);
const watchlistSchema = new mongoose.Schema({
  stockName: {
    type: String,
  },
});
const UserDetailSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
  },
  watchlist: [String],
  portfolio: [stockHoldingSchema],
});

const UserDetail = mongoose.model('UserDetail', UserDetailSchema);
module.exports = UserDetail;
