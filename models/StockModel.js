const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema({
  SYMBOL: {
    type: String,
    required: true,
    trim: true,
  },
  COMPANY_NAME: {
    type: String,
    required: true,
    trim: true,
  },
  SERIES: {
    type: String,
    required: true,
    trim: true,
  },
  DATE_OF_LISTING: {
    type: String,
    required: true,
    trim: true,
  },
  PAID_UP_VALUE: {
    type: String,
    required: true,
    trim: true,
  },
  MARKET_LOT: {
    type: String,
    required: true,
    trim: true,
  },
  ISIN_NUMBER: {
    type: String,
    required: true,
    trim: true,
  },
  FACE_VALUE: {
    type: String,
    required: true,
    trim: true,
  },
});

const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;
