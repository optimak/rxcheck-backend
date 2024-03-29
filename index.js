const express = require('express');
const app = express();
require("dotenv").config();
const PORT = 8080;
// const cors = require("cors");
// app.use(cors());
app.use(express.json());

// const PORT = process.env.PORT || 5050;
app.get('/', (req, res) => {
    res.send('Welcome to my API');
  });
const medRoutes = require('./routes/medication-routes');
const userRoutes = require('./routes/user-routes');

// all users routes
app.use('/medications', medRoutes);
app.use('/users', userRoutes);
app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});