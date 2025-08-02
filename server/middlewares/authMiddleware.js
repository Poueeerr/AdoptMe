import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.json({ valid: false });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    }catch{
        return res.json({ valid: false });
    }   
}

export default authMiddleware;