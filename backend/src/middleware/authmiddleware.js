import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    // Bypass auth if flag is set
    if (process.env.DISABLE_AUTH === "true") {
        req.user = {
          _id: "000000000000000000000001",
          id: "000000000000000000000001",
          name: "Dev Admin",
          email: "dev@junubhire.local",
          role: "admin",
        };
    
        return next();
      }


    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){

        return res.status(401).json({success: false, message: 'Unauthorized'});

    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            ...decoded,
            _id: decoded._id || decoded.id || decoded.userId,
      id: decoded.id || decoded._id || decoded.userId,
        }
        
        next();

    } catch (error) {
        return res.status(401).json({success: false, message: 'Unauthorized'});
        
    }
}