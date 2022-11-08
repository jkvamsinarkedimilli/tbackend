const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const userRouter = require('./routes/userRoutes');
app.use(userRouter);

//Invalid Route
app.all('*', (req, res, next) => {
	return res.status(404).json({
		status: 'Fail',
		message: `Can't find ${req.originalUrl}`,
	});
});

module.exports = app;
