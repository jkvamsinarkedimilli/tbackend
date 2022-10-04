const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const stocksRouter = require('./routes/stockRoutes');
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use('/api/users', userRouter);
app.use('/api/stocks', stocksRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'Fail',
    message: `Can't find ${req.originalUrl}`,
  });
});
module.exports = app;
