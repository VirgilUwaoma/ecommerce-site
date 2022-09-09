require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ msg: "Access Denied" });

  try {
    const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(verifiedUser);
    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(403).json({ msg: "Invalid Token" });
  }
}

function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      return next();
    }
    res.status(403).json({ msg: "You're not authorized" });
  });
}

function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      return next();
    }
    res.status(403).json({ msg: "You're not authorized" });
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
