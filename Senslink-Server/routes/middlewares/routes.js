const express = require('express');

const routes = express.Router();

const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const RateLimit = require('express-rate-limit');
 
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes 
  max: 100, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying — full speed until the max limit is reached
});
 
// apply to all requests 
routes.use(limiter);
routes.use(helmet());
routes.use(cors({origin: '*'}));
routes.use(express.json({ limit: '10kb' }));
// Data Sanitization against NoSQL Injection Attacks
routes.use(mongoSanitize());
// Data Sanitization against XSS attacks
routes.use(xss());

routes.use(morgan('combined'));
routes.use(compression());
routes.use(multer().none());

module.exports = routes;