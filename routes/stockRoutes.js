const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocksController');
router.param('stockname', (req, res, next, val) => {
  next();
});
router.route('/:stockname').post(stocksController.getstocks);
module.exports = router;
