const jwt = require('jsonwebtoken');
const Creator=require('../models/creatorModel')
require('dotenv').config();



module.exports =async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid Token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    const creator = await Creator.findById(req.userId);
    if (!creator) return res.status(401).json({ error: 'Unauthorized' });
    req.role = creator.role;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Your Session Expried Login again' });
  }
};