const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB = require('./config/db');

// 1. Load env vars FIRST
dotenv.config({ path: './config/config.env' });

// 2. Connect to database
connectDB();

// Route files
const companies = require('./routes/companies');
const auth = require('./routes/auth');
const interviews = require('./routes/interviews');

const app = express();

// 3. Body parser (Necessary for POST/PUT requests)
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Query Parser
app.set('query parser','extended');

// Mount routers
app.use('/api/v1/companies', companies);
app.use('/api/v1/auth',auth);
app.use('/api/v1/interviews',interviews);

const PORT = process.env.PORT || 5000;

// 4. Assign the listener to a variable
const server = app.listen(
  PORT, 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // 5. Use the 'server' variable defined above
  server.close(() => process.exit(1));
});