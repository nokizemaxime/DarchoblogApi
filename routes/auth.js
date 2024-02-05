const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");

const router = express.Router();
/**
 * @swagger
 * /api/auth/register:
 *            post:
 *              description: Register
 *              parameters:
 *                   -  name: Username
 *                      description: Username of the user
 *                      in: formData
 *                      required: true
 *                      type: string
 *                   -  name: Password
 *                      description: password of the new user
 *                      in: formData
 *                      required: true
 *                      type: string  
 *              responses:
 *                  201:
 *                    description: User Created 
 */


router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Nom d'utilisateur déjà pris." });

    const user = new User({ username, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement de l'utilisateur." });
  }
});

/**
 * @swagger
 * /login:
 *            post:
 *              description: Login
 *              parameters:
 *                   -  name: Username
 *                      description: Username of the user
 *                      in: formData
 *                      required: true
 *                      typa: string
 *                   -  name: Password
 *                      description: Password of the user
 *                      in: formData
 *                      required: true
 *                      typa: string
 *              responses:
 *                  201:
 *                    description: Login 
 */


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) return res.status(401).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion de l'utilisateur." });
  }
});

module.exports = router;
