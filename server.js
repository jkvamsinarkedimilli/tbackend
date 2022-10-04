const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB).then((con) => {
  console.log('DB connection successfull');
});
app.listen(3030, () => {
  console.log('Started');
});
