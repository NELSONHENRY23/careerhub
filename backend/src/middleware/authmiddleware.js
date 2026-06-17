import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.DISABLE_AUTH === "true"
  ) {
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

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded._id || decoded.userId || decoded.Id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    req.user = {
      ...decoded,
      id: userId,
      _id: userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};