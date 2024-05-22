const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200

}

// Ajoutez ceci pour autoriser toutes les origines (à adapter en fonction de vos besoins de sécurité)
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: 'admin',
  password: 'defiut23',
  port: 3306,
  database: 'defiut',
  insecureAuth: true
});


setTimeout(() => {
  connection.connect(function(err) {
    if (err) {
      console.log("Info de la connection : ", connection.config)
      console.error('Erreur de connexion (Je pete mon crane 😢): ' + err.stack);
      return;
    }
    console.log('Connecté à la base de données MySQL (yippie 😁)');

    app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`);
    });
  });
}, 10000); // Attendre 10 secondes


//Points d'entrée de l'API
app.get('/api/defis', (req, res) => {
  connection.query('SELECT * FROM defi', (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des données depuis la base de données' });
      console.error('Erreur lors de la récupération des données depuis la base de données', error);
      return;
    }
    res.json(results);
  });
});

app.get('/api/defis/:id', (req, res) => {
  connection.query('SELECT * FROM defi WHERE id = ?', [req.params.id], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des données depuis la base de données' });
      console.error('Erreur lors de la récupération des données depuis la base de données', error);
      return;
    }
    if (results.length <= 0) {
      res.status(404).json({ error: 'Défi non trouvé' });
      return;
    }
    res.json(results[0]);
  });
});

app.post('/api/defis', (req, res) => {
  const { titre, description, nbEtoiles, categorie, indice } = req.body;
  const query = 'INSERT INTO Defi (titre, description, nbEtoiles, categorie, indice) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [titre, description, nbEtoiles, categorie, indice], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout du défi à la base de données' });
      console.error('Erreur lors de l\'ajout du défi à la base de données', error);
      return;
    }
    res.status(201).json({ message: 'Défi ajouté avec succès' });
  });
});

app.delete('/api/defis/:idDefi', (req, res) => {
  const { idDefi } = req.params;
  connection.query('DELETE FROM Defi WHERE idDefi = ?', [idDefi], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression du défi de la base de données' });
      return;
    }
    res.status(200).json({ message: 'Défi supprimé avec succès' });
  });
});

//Points d'entrée de l'API pour User
app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM User', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs depuis la base de données' });
      return;
    }
    res.json(results);
  });
});
	
app.post('/api/users', (req, res) => {
  const { pseudo, email, motDePasse, nom, prenom, dateInscription, dateNaissance, photo, estAdmin } = req.body;
  const query = 'INSERT INTO User (pseudo, email, motDePasse, nom, prenom, dateInscription, dateNaissance, photo, estAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [pseudo, email, motDePasse, nom, prenom, dateInscription, dateNaissance, photo, estAdmin], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur à la base de données' });
      console.error('Erreur lors de l\'ajout de l\'utilisateur à la base de données', error);
      return;
    }
    res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
  });
});

app.delete('/api/users/:pseudo', (req, res) => {
  const { pseudo } = req.params;
  connection.query('DELETE FROM User WHERE pseudo = ?', [pseudo], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur de la base de données' });
      return;
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  });
});

app.get('/api/users/:pseudo', (req, res) => {
  const { pseudo } = req.params;
  connection.query('SELECT * FROM User WHERE pseudo = ?', [pseudo], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur depuis la base de données' });
      return;
    }
    res.json(results);
  });
});

//Points d'entrée de l'API pour Stat
app.get('/api/stats', (req, res) => {
  connection.query('SELECT * FROM Stat', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques depuis la base de données' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/stats', (req, res) => {
  const { unUser, nbDefis, nbEtoiles, score, nufs } = req.body;
  const query = 'INSERT INTO Stat (unUser, nbDefis, nbEtoiles, score, nufs) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [unUser, nbDefis, nbEtoiles, score, nufs], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout de la statistique à la base de données' });
      console.error('Erreur lors de l\'ajout de la statistique à la base de données', error);
      return;
    }
    res.status(201).json({ message: 'Statistique ajoutée avec succès' });
  });
});

app.delete('/api/stats/:unUser', (req, res) => {
  const { unUser } = req.params;
  connection.query('DELETE FROM Stat WHERE unUser = ?', [unUser], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de la statistique de la base de données' });
      return;
    }
    res.status(200).json({ message: 'Statistique supprimée avec succès' });
  });
});

app.get('/api/stats/:unUser', (req, res) => {
  const { unUser } = req.params;
  connection.query('SELECT * FROM Stat WHERE unUser = ?', [unUser], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques depuis la base de données' });
      return;
    }
    res.json(results);
  });
});

// Points d'entrée de l'API pour DefiUser
app.get('/api/defiUsers', (req, res) => {
  connection.query('SELECT * FROM DefiUser', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des relations utilisateur-défi depuis la base de données' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/defiUsers', (req, res) => {
  const { unUser, unDefi, dateDebut, dateFin, nbEtoilesObtenu } = req.body;
  const query = 'INSERT INTO DefiUser (unUser, unDefi, dateDebut, dateFin, nbEtoilesObtenu) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [unUser, unDefi, dateDebut, dateFin, nbEtoilesObtenu], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout de la relation utilisateur-défi à la base de données' });
      console.error('Erreur lors de l\'ajout de la relation utilisateur-défi à la base de données', error);
      return;
    }
    res.status(201).json({ message: 'Relation utilisateur-défi ajoutée avec succès' });
  });
});

app.delete('/api/defiUsers/:unUser/:unDefi', (req, res) => {
  const { unUser, unDefi } = req.params;
  connection.query('DELETE FROM DefiUser WHERE unUser = ? AND unDefi = ?', [unUser, unDefi], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de la relation utilisateur-défi de la base de données' });
      return;
    }
    res.status(200).json({ message: 'Relation utilisateur-défi supprimée avec succès' });
  });
});

app.get('/api/defiUsers/:unUser', (req, res) => {
  const { unUser } = req.params;
  connection.query('SELECT * FROM DefiUser WHERE unUser = ?', [unUser], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des relations utilisateur-défi depuis la base de données' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/defiUsers/:unUser/:unDefi', (req, res) => {
  const { unUser, unDefi } = req.params;
  connection.query('SELECT * FROM DefiUser WHERE unUser = ? AND unDefi = ?', [unUser, unDefi], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de la relation utilisateur-défi depuis la base de données' });
      return;
    }
    if (results.length <= 0) {
      res.status(404).json({ error: 'Relation utilisateur-défi non trouvée' });
      return;
    }
    res.json(results[0]);
  });
});




