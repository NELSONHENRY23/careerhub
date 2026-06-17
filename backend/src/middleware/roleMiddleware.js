export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (process.env.DISABLE_AUTH === "true") {
      return next();
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};