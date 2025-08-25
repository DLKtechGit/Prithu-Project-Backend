const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const root =require ('./roots/root');
require('dotenv').config();
const http=require('http');
const server = http.createServer(app);


// Middleware
app.use(cors());
app.use(express.json());
app.use('/api',root)

// Mongodb Server and Port ServerConnectiion
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
  app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


