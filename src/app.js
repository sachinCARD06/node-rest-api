const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express(); // ✅ Define app first

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1', routes);

// Error handler (should come last)
app.use(errorHandler); // ✅ Now it's safe to use app here

module.exports = app;
