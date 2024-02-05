const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const authRoutes = require("./routes/auth");
const verifyToken = require("./middlewares/auth");
const app = express();
const cors = require("cors");
app.use(express.json());
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connexion à MongoDB Atlas réussie.");
  })
  .catch((error) => {
    console.error("Erreur lors de la connexion à MongoDB Atlas :", error);
});

const options={
    definition: {
      openapi  : '3.0.0',
      info : {
        title : 'NodeJs Api projet The BlogAuthentification',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:3000/'
        }
      ]
  
    },
    apis: [ './routes/auth.js' ]
}
const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

app.use("/api/auth", authRoutes);

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "Ressource protégée." });
});

// app.use(cors());
// // Intégration de Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}.`);
});
