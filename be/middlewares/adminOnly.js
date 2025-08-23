module.exports=(req,res,next)=>{
    if(req.role!=='admin')
    {
        return res.status(403).json({ error: 'Forbidden: Session expired! Login again' });
}
next()
};