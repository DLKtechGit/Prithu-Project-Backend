
module.exports=(req,res,next)=>{
     if (req.role !== 'creator') {
return res.status(403).json({ error: 'Forbidden: Creator only' });    
  }
  next()
}
