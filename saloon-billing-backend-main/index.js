const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const authenticateToken = require('./middleware/authenticate');
const authorizeRoles = require('./middleware/authorize');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  next();
});

app.use(express.static(path.join(__dirname, 'admin-dashboard/build')));

// Hello world at root
app.get('/', async (req, res) => {
  return res.status(200).send('Hello from billing app');
});

// Dashboard route
app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard/build', 'index.html'));
});

// No auth route
app.use('/api/adminLogin', require('./routes/login'));
app.use('/api/shopLogin', require('./routes/shopLogin'));
app.use('/api/register', require('./routes/register'));

// CRUD routes
app.use('/api/shopGroup', authenticateToken, authorizeRoles(['SHOP_GROUP_MANAGER']), require('./routes/shopGroup'));
app.use('/api/shop', authenticateToken, authorizeRoles(['SHOP_MANAGER']), require('./routes/shop'));

// For any other requests, serve a 404 error
app.get('*', (_, res) => {
  res.status(404).send('<p>404 error</p>');
});

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({ message: message });
});

// Sync database
sequelize
  .sync()
  .then(result => {
    console.log('Database connected');
    app.listen(3000);
    console.log("App is running on port 3000");
  })
  .catch(err => {
    console.log(err);
  });
