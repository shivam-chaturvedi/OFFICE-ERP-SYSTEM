const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.verifyToken = (excludedPaths = []) => {
  return async (req, res, next) => {
    if (excludedPaths.includes(req.path)) {
      return next();
    }

    if (excludedPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.user?.roles.includes("admin")) {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};
