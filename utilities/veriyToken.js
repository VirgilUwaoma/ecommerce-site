require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ msg: "Access Denied" });

  try {
    const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("checking verification");
    req.user = verifiedUser;
    console.log("token verified");
    next();
  } catch (error) {
    console.log("token not verified");
    res.status(403).json({ msg: "Invalid Token" });
  }
}

function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      console.log("Auth verified");
      return next();
    }
    console.log("Auth not verified");
    res.status(403).json({ msg: "You're not authorized" });
  });
}

function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      console.log("admin verified");
      return next();
    }
    console.log("admin not verified");
    res.status(403).json({ msg: "You're not authorized" });
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
