const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const e = require('express');

const app = express();
const port = 3001;

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

// Ajoutez ceci pour autoriser toutes les origines (à adapter en fonction de vos besoins de sécurité)
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
})
);

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: 'admin',
  password: 'defiut23',
  port: 3306,
  database: 'defiut',
  insecureAuth : true
});




setTimeout(() => {
  // Code to be executed after 10 seconds
  // ...

  connection.connect(function(err) {
    console.log("😢 : ", connection.config);
    if (err) {
      console.error('Erreur de connexion (Je pete mon crane): ' + err.stack);
      return;
    }
    console.log('Connecté à la base de données MySQL');
  });

}, 10000); // Wait for 10 seconds

// ...


// Exemple de point de terminaison pour obtenir des données depuis la base de données
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM defi', (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des données depuis la base de données' });
      console.error('Erreur lors de la récupération des données depuis la base de données', error);
      return;
    }
    res.json(results);
    console.log("what ? " , results);
  });
});


app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});