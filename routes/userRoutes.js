const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//Register a new user
router.route('/register').post(userController.adduser);

//Checking whether a user exists or not
router.route('/login').post(userController.verifyuser);

router
  .route('/portfolio/:type/:stockname')
  .post(userController.protect, userController.modifyPortfolio);

router
  .route('/getportfolio')
  .post(userController.protect, userController.getPortfolio);

router.route('/addtowatchlist/:stockName').post(userController.addtowatchlist);

router
  .route('/removefromwatchlist/:stockname')
  .post(userController.protect, userController.removefromwatchlist);

router
  .route('/getwatchlist')
  .post(userController.protect, userController.getwatchlist);
  
router
  .route('/getreports')
  .post(userController.protect, userController.getReports);
module.exports = router;
