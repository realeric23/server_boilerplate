const mongoose = require('mongoose');
require('dotenv').config();

const host = process.env.MONGO_HOST;
const mongoDB = process.env.MONGO_DB;
const customDB = process.env.CUSTOM_DB;
const password = process.env.MONGO_PASSWORD;

const URI = `mongodb+srv://${host}:${password}@${mongoDB}.to4yc.mongodb.net/${customDB}?retryWrites=true&w=majority`;

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((db) => console.log('DB connected'))
  .catch((err) => console.log(err));

module.exports = mongoose;
