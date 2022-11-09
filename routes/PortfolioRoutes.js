const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/Auth');
const Portfolio = require('../models/PortfolioModel');

module.exports = router;
