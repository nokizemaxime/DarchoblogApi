const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const authRoutes = require("./routes/auth");
const verifyToken = require("./middlewares/auth");
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
app.use(express.json());
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const server = http.createServer(app);
const io = socketIo(server);
const redis = require("redis");
const client = redis.createClient();

// Exemple de fonction pour récupérer des données à partir de Redis
function getDataFromRedis(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
// Exemple de fonction pour sauvegarder des données dans Redis avec expiration
function saveDataToRedis(key, data, expiration) {
  client.setex(key, expiration, data);
}

// Exemple d'utilisation des fonctions
async function main() {
  const key = "myKey";
  const data = await getDataFromRedis(key);
  if (data) {
    console.log("Données trouvées dans Redis:", data);
  } else {
    console.log("Données non trouvées dans Redis. Récupération depuis la source...");
    // Récupérer les données depuis la source (par exemple une base de données)
    const newData = "Données de test";
    saveDataToRedis(key, newData, 60); // Sauvegarder les données dans Redis avec une expiration de 60 secondes
    console.log("Données sauvegardées dans Redis");
  }
}

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
