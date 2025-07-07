function generateAuthenticateToken(mobile) {
  return mobile?.length
    ? Math.random().toString(36).substring(2, 15) + mobile
    : "";
}

function verifyAuthenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  } else {
    next();
  }
}

module.exports = {
  generateAuthenticateToken,
  verifyAuthenticateToken,
};
