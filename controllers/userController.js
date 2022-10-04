const User = require('../models/userModel');
const UserDetail = require('../models/userDetailModel');
const jwt = require('jsonwebtoken');
const util = require('util');
const axios = require('axios');
////////////////////////////////////////////////////////////////////////////////////////////////////
//Adding a new user to database
exports.adduser = async (req, res, next) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    const userdetail = await UserDetail.create({
      username: req.body.username,
      watchlist: [],
      portfolio: [],
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    return res.status(201).json({
      message: 'Account Created Successfully',
      status: 'Success',
      token,
    });
  } catch (e) {
    return res.status(400).json({
      status: 'Failed',
      data: {
        message: e,
      },
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//Verifying a user
exports.verifyuser = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const response = await User.findOne({
      username,
    }).select('+password');
    if (
      !response ||
      !(await response.checkPassword(password, response.password))
    ) {
      return res.status(401).json({
        message: 'Invalid Password or Username',
      });
    }
    const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET);
    return res.status(200).json({
      message: 'Login Success',
      token,
    });
  } catch (e) {
    res.status(400).json({
      message: e,
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//Adding stocks to Watchlist
exports.addtowatchlist = async (req, res) => {
  try {
    const userProfile = await User.findOne({ username: req.body.username });
    if (!userProfile) {
      return res.status(404).json({
        status: 'Failed',
        message: "User Doesn't exists",
      });
    }
    const resp = await UserDetail.findOneAndUpdate(
      { username: req.body.username },
      { $addToSet: { watchlist: [req.params.stockName] } },
      { new: true }
    );
    return res.status(200).json({
      status: 'Success',
      message: resp,
    });
  } catch (e) {
    res.status(404).json({
      message: e,
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//Get stocks from watchlist
exports.getwatchlist = async (req, res) => {
  try {
    const username = req.body.username;
    try {
      const resp = await UserDetail.findOne({ username: username });
      if (!resp) {
        return res.status(404).json({
          status: 'Failed',
          message: 'Invalid User',
        });
      }
      const message = resp.watchlist.length
        ? resp.watchlist
        : 'No Stocks Added to Watchlist';
      const status = resp.watchlist.length ? 'Success' : 'No Stocks';
      return res.status(200).json({
        status: status,
        message: message,
      });
    } catch (e) {
      return res.status(400).json({
        status: 'Failed',
        message: 'An Error Occured',
      });
    }
  } catch (e) {
    console.log(e);
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//Checking whether a user is authenticated or not
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({
      statsu: 'Failed',
      message: 'Unauthorized, please login to continue',
    });
  }
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const doesExist = await User.findById(decoded.id);
  if (!doesExist.id) {
    return res.status(401).json({
      status: 'Failed',
      message: 'User no longer exists',
    });
  }
  next();
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//Remove stock from watchlist
exports.removefromwatchlist = async (req, res, next) => {
  try {
    const username = req.body.username;
    const user = await UserDetail.find({ username: username });
    if (!user) {
      return res.status(404).json({
        status: 'Failed',
        message: "User doesn't exists",
      });
    }
    const resp = await UserDetail.findOneAndUpdate(
      { username: username },
      {
        $pull: {
          watchlist: req.params.stockname,
        },
      },
      { new: true }
    );
  } catch (e) {
    return res.status(400).json({
      status: 'Failed',
      message: e,
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//Buying/Selling a Stock
exports.modifyPortfolio = async (req, res, next) => {
  const type = req.params.type;
  const stockName = req.params.stockname;
  const price = req.body.price;
  const quantity = req.body.quantity;
  if (type === 'BUY') {
    try {
      const username = req.body.username;
      const user = await UserDetail.find({ username: username });
      if (!user) {
        return res.status(404).json({
          status: 'Failed',
          message: 'User not found',
        });
      }
      const resp = await UserDetail.findOneAndUpdate(
        { username: username },
        {
          $push: {
            portfolio: {
              stockName: stockName,
              price: price,
              quantity: quantity,
              mode: type,
            },
          },
        },
        { new: true }
      );
      return res.status(200).json({
        status: 'Success',
        portfolio: resp.portfolio,
      });
    } catch (e) {
      return res.status(400).json({
        status: 'Failed',
        message: e,
      });
    }
  } else if (type === 'SELL') {
    try {
      const username = req.body.username;
      const user = await UserDetail.find({ username: username });
      if (!user) {
        return res.status(404).json({
          status: 'Failed',
          message: 'User not found',
        });
      }
      const resp = await UserDetail.findOneAndUpdate(
        { username: username },
        {
          $push: {
            portfolio: {
              stockName: stockName,
              price: price,
              quantity: -1 * quantity,
              mode: type,
            },
          },
        },
        { new: true }
      );
      return res.status(200).json({
        status: 'Success Sell',
      });
    } catch (err) {
      console.log('Error', err);
      return res.status(400).json({
        status: 'Failed',
        message: err,
      });
    }
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//Get Portfolio
exports.getPortfolio = async (req, res, next) => {
  const username = req.body.username;
  try {
    const portfolio = await UserDetail.findOne({ username: username });
    const portfolioMap = await getItems(portfolio, []);
    //console.log('Portfolio Map', portfolioMap);
    return res.status(200).json({
      status: 'Success',
      portfolio: portfolioMap,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 'Failed',
      message: e,
    });
  }
};

const getItems = async (portfolio, pf) => {
  for (var j = 0; j < portfolio.portfolio.length; j++) {
    var stock = portfolio.portfolio[j];
    var flag = 0;
    for (var i = 0; i < pf.length; i++) {
      if (pf[i].stockName === stock.stockName) {
        flag = 1;
        if (stock.mode === 'BUY') {
          const oldAvg = pf[i].averagePrice * pf[i].quantity;
          const newAvg = stock.price * stock.quantity;
          pf[i].averagePrice =
            (oldAvg + newAvg) / (pf[i].quantity + stock.quantity);
          pf[i].averagePrice = Math.round(pf[i].averagePrice * 100) / 100;
          pf[i].quantity += stock.quantity;
        } else {
          pf[i].quantity += stock.quantity;
        }
      }
    }
    if (flag === 0) {
      pf.push({
        stockName: stock.stockName,
        averagePrice: stock.price,
        quantity: stock.quantity,
      });
    }
  }
  pf = getPrices(pf);
  return pf;
};
const getPrices = async (pf) => {
  for (var i = 0; i < pf.length; i++) {
    await axios
      .get(
        `http://api.marketstack.com/v1/eod?access_key=63dccf1b4d563cd1929f3e78f35a8893&symbols=${pf[i].stockName}.XNSE`
      )
      .then((res) => {
        pf[i].ltp = res.data.data[0].close;
        console.log(pf[i].ltp);
      })
      .catch((err) => {
        console.log('Err', err);
      });
  }
  return pf;
};
////////////////////////////////////////////////////////////////////////////////////////////////////
//Get Reports of a User
exports.getReports = async (req, res, next) => {
  try {
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const username = req.body.username;
    //console.log(fromDate, toDate);
    const user = await UserDetail.findOne({ username: username });
    if (!user) {
      return res.status(404).json({
        status: 'Failed',
        message: "User doesn't exists",
      });
    }
    const rec = [];
    for (var i = 0; i < user.portfolio.length; i++) {
      const transactionDate = user.portfolio[i].createdAt
        .toISOString()
        .substring(0, 10);
      D_1 = fromDate.split('-');
      D_2 = toDate.split('-');
      D_3 = transactionDate.split('-');
      var d1 = new Date(D_1[0], parseInt(D_1[1]) - 1, D_1[2]);
      var d2 = new Date(D_2[0], parseInt(D_2[1]) - 1, D_2[2]);
      var d3 = new Date(D_3[0], parseInt(D_3[1]) - 1, D_3[2]);
      if (d3 >= d1 && d3 <= d2) {
        rec.push(user.portfolio[i]);
      }
    }
    return res.status(200).json({
      status: 'Success',
      message: rec,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};
