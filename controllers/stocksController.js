const Stock = require('../models/StockModel');
exports.getstocks = async (req, res) => {
  try {
    const stockName = req.params.stockname;
    const stocks = await Stock.find({
      COMPANY_NAME: { $regex: stockName + '.*', $options: 'i' },
    });
    return res.status(200).json({
      status: 'Success',
      message: stocks,
    });
  } catch (e) {
    return res.status(400).json({
      status: 'An Error Occured',
      message: e,
    });
  }
};
