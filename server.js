const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE_LOCAL;

//Connecting to Database
mongoose.connect(DB).then((con) => {
  console.log('DB connection successful');
});

app.listen(process.env.PORT, () => {
  console.log(`Started on ${process.env.PORT}`);
});
