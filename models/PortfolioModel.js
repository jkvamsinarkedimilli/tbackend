const mongoose = require('mongoose');
const portfolioSchema = mongoose.Schema({
	username: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	watchlist: [
		{
			stock: {
				type: String,
				trim: true,
			},
		},
	],
	portfolio: [
		{
			stock: {
				type: String,
				trim: true,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
			transactionType: {
				type: String,
				required: true,
			},
			transactionDate: {
				type: Date,
				required: true,
			},
		},
	],
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
module.exports = Portfolio;
