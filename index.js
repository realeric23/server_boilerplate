const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
// const routes = require('./src/routes/index.js');
require('dotenv').config();

// Mongo DB
require('./src/database/database.js');
require('http');

const PORT = process.env.PORT || 3001;

// Middelwares
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
// app.use('/', routes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
