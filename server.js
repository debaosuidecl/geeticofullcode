const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const app = express();
const path = require('path');

// console.log(process.env);
// connect database

connectDB();
// init middleware
app.use('/public', express.static(__dirname + '/public'));
// app.use(express.static('./public'));
app.use(express.json({ extended: false }));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Request-Headers', 'GET, PUT, POST, DELETE');

  next();
});
// define routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/upload', require('./routes/api/uploadProduct'));
app.use('/api/userproducts', require('./routes/api/userProductRoutes'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/userauth', require('./routes/api/frontendUserAuth'));
app.use('/api/userorders', require('./routes/api/frontEndOrders'));

if (process.env.NODE_ENV === 'production') {
  app.use('/sellerpage', express.static('clientseller/build'));
  app.get('/sellerpage/*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, 'clientseller', 'build', 'index.html')
    );
  });
  // app.get("/seller/*")

  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
//set port
const PORT = process.env.PORT || 5000;
// var server_host = process.env.YOUR_HOST || '142.93.39.91';


app.listen(PORT, () =>
  console.log(`Server Started on port ${PORT}`)
);

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));

