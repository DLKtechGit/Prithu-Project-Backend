const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const root =require ('./roots/root');
require('dotenv').config();
const http=require('http');
const Server = http.createServer(app);
const {initSocket}=require('./middlewares/webSocket');
const cookieParser=require('cookie-parser');


// Middleware
app.use(express.json());
app.use('/api',root);
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow requests with no origin (Postman, curl)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false); // block disallowed origins
      }
      return callback(null, true); // allow origin
    },
    credentials: true, // allow cookies or Authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],    // allowed headers
  })
);


console.log(process.env.CLIENT_URL?.split(",") || ["http://localhost:3000"])

// initSocket(Server);

// Mongodb Server and Port ServerConnectiion
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
  app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


