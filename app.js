const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const userRouter = require('./routes/userRoutes');
const portfolioRouter = require('./routes/PortfolioRoutes');
app.use(userRouter);
app.use(portfolioRouter);

module.exports = app;
