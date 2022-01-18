const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

const router = require('./Routes/router');

app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api', router);

app.all('/', (req, res) => {
  return res.status(200).json({
    Status: 200,
    Message: 'Welcome to this API',
  });
});

const URI = process.env.URI;
console.log(typeof URI);
app.listen(3000, async () => {
  console.log('Application is online.');
  await mongoose.connect(URI).catch((err) => console.log(err));
  mongoose.connection.on('connecting', () => {
    console.log('Connecting to MongoDB');
  });
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
});
