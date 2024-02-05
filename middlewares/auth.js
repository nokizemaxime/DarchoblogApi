const jwt = require("jsonwebtoken");
const config = require("../config");

const verifyToken = (req, res, next) => {
  const token = req.headers["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzBkM2NkNTVmODUxNGMzMmU2ZmI5ZSIsImlhdCI6MTcwNzE1MjkxNSwiZXhwIjoxNzA3MjM5MzE1fQ.PkEScR1XkRp8JqIr-MG5Br7vG4WyaHTcnSY0T3cwcDQ"];
  if (!token) return res.status(403).json({ message: "Token non fourni." });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Échec de l'authentification du token." });

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
