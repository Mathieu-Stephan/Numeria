const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

// Ajoutez ceci pour autoriser toutes les origines (à adapter en fonction de vos besoins de sécurité)
app.use(cors());

const connection = mysql.createConnection({
  host: 'mysql',//mysql pour docker, localhost pour local
  user: 'root',
  password: 'defiut23',
  port: 3306,
  database: 'defiut'//defiut pour docker, numeriabdd (ou ce que tu as) pour local
});

connection.connect(function(err) {
    if (err) console.error('Erreur de connexion: ' + err.stack); return; }
);


// Exemple de point de terminaison pour obtenir des données depuis la base de données
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM defi', (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des données depuis la base de données' });
      return;
    }
    res.json(results);
    console.log(results);
  });
});


app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});