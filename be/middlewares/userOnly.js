module.exports=(req,res,next)=>{
    if(req.role!=='user')
    {
        return res.status(403).json({ error: 'Forbidden: Session expired! Login again' });
}
next()
};