const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

/**
 * Express middleware — verifies JWT from Authorization header.
 * Attaches decoded user to req.user = { id, username, role, department }
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, role, department }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

/**
 * Role guard — returns middleware that checks the user's role.
 * Usage: requireRole("admin") or requireRole("department") or requireRole("student")
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient role." });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
