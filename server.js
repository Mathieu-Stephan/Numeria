const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

// Ajoutez ceci pour autoriser toutes les origines (à adapter en fonction de vos besoins de sécurité)
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  database: 'numeriabdd'
});

connection.connect(function(err) {
    if (err) console.error('Erreur de connexion: ' + err.stack); return; }
);


// Exemple de point de terminaison pour obtenir des données depuis la base de données
app.get('/api/data', (req, res) => {
  connection.query('SELECT * FROM defi', (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});


app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
