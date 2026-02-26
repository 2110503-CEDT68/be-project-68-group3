const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser=require('cookie-parser');
const mongoSanitize = require('@exortek/express-mongo-sanitize');
const {xss} = require('express-xss-sanitizer');
const hpp = require('hpp');

// Load env vars FIRST
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const companies = require('./routes/companies');
const auth = require('./routes/auth');
const interviews = require('./routes/interviews');

//Rate limiting
const limiter = rateLimit({
  windowMs:10*60*1000, // 10 mins
  max:100
});

const app = express();

// 1. Security Headers (Fastest)
app.use(helmet());
app.use(cors());

// 2. Rate Limiting (Reject over-limit users early)
app.use(limiter);

// 3. Body Parsers (Only parse if the request isn't rate-limited)
// Body parser (Necessary for POST/PUT requests)
app.use(express.json());
//Cookie parser
app.use(cookieParser());

// 4. Data Sanitization (Only sanitize if the body exists and is valid)
app.use(mongoSanitize());
app.use(xss());
app.use(hpp()); // Note: hpp() usually goes after body parsers

//Query Parser
//app.set('query parser','extended');

// Mount routers
app.use('/api/v1/companies', companies);
app.use('/api/v1/auth',auth);
app.use('/api/v1/interviews',interviews);

const PORT = process.env.PORT || 5000;

// Assign the listener to a variable
const server = app.listen(
  PORT, 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Use the 'server' variable defined above
  server.close(() => process.exit(1));
});