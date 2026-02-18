const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  cachedDb = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
  return cachedDb;
}

app.post('/api/submit', async (req, res) => {
  await connectToDatabase();
  require('./routes/submit')(req, res);
});

app.post('/api/admin/login', async (req, res) => {
  await connectToDatabase();
  require('./routes/login')(req, res);
});

app.get('/api/admin/submissions', async (req, res) => {
  await connectToDatabase();
  require('./routes/submissions')(req, res);
});

app.post('/api/admin/logout', (req, res) => {
  require('./routes/logout')(req, res);
});

module.exports = app;