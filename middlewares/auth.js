const jwt = require("jsonwebtoken");
const config = require("../config");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token non fourni." });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Échec de l'authentification du token." });

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
