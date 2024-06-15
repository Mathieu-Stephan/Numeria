const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');


const app = express();
const port = 3001;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200

}

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
      console.error('Erreur de connexion' + err.stack);
      return;
    }
    console.log('Connecté à la base de données MySQL');

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

app.get('/api/classement/:id', (req, res) => {
    const {id} = req.params;
    if(id == "General") {
      connection.query('SELECT Stat.unUser, Stat.nbEtoiles, Stat.nufs, SUM(TIMESTAMPDIFF(MINUTE, DU.dateDebut, DU.dateFin)) AS temps FROM Stat INNER JOIN DefiUser DU ON DU.unUser = Stat.unUser GROUP BY Stat.unUser ORDER BY Stat.nufs DESC, temps ASC;', (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: 'Erreur lors de la récupération des données depuis la base de données' });
          console.error('Erreur lors de la récupération des données depuis la base de données', error);
          return;
        }
        if (results.length <= 0) {
          res.status(404).json({ error: 'Ranking non trouvé' });
          return;
        }
        res.json(results);
      });
    } else {
      connection.query('SELECT DU.unUser, DU.nbEtoiles, calcul_nufs(DU.unDefi) AS nufs, TIMESTAMPDIFF(MINUTE, DU.dateDebut, DU.dateFin) AS temps FROM Defiuser AS DU INNER JOIN Defi AS D ON D.idDefi = DU.unDefi WHERE D.titre = ? GROUP BY DU.unUser, DU.nbEtoiles, nufs, DU.dateDebut, DU.dateFin ORDER BY nufs DESC, temps ASC;', [id], (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: 'Erreur lors de la récupération des données depuis la base de données' });
          console.error('Erreur lors de la récupération des données depuis la base de données', error);
          return;
        }
        if (results.length <= 0) {
          res.status(404).json({ error: 'Ranking non trouvé' });
          return;
        }
        res.json(results);
      });
    }
    
  });

app.get('/api/defis/:id', (req, res) => {
  connection.query('SELECT * FROM defi WHERE idDefi = ?', [req.params.id], (error, results, fields) => {
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
  const query = 'INSERT INTO Defi (titre, description, nbEtoiles, difficulté) VALUES (?, ?, ?, ?, ?)';
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

// Route pour mettre à jour les informations de l'utilisateur
app.put('/api/users', (req, res) => {
  const { pseudo, nom, prenom, dateNaissance, photo } = req.body;

  connection.query(
    'UPDATE user SET nom = ?, prenom = ?, dateNaissance = ?, photo = ? WHERE pseudo = ?',
    [nom, prenom, dateNaissance, photo, pseudo],
    (error, results) => {
      if (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
      } else {
        res.json({ pseudo, nom, prenom, dateNaissance, photo });
      }
    }
  );
});

// Route pour changer le mot de passe de l'utilisateur
app.post('/api/users/change-password', (req, res) => {
  const { pseudo, oldPassword, newPassword } = req.body;
  const checkPasswordQuery = 'SELECT motDePasse FROM User WHERE pseudo = ?';
  connection.query(checkPasswordQuery, [pseudo], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération du mot de passe de l\'utilisateur' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }
    
    const user = results[0];
    bcrypt.compare(oldPassword, user.motDePasse, (err, isMatch) => {
      if (err) {
        res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe' });
        return;
      }
      if (oldPassword !== user.motDePasse) {
        res.status(400).json({ error: 'Ancien mot de passe incorrect' });
        return;
      }
      
      // Hasher le nouveau mot de passe
      //bcrypt.hash(newPassword, 10, (err, hash) => {
        //if (err) {
          //res.status(500).json({ error: 'Erreur lors du hachage du nouveau mot de passe' });
          //return;
        //}
        
        // Mettre à jour le mot de passe dans la base de données
        const updateQuery = 'UPDATE User SET motDePasse = ? WHERE pseudo = ?';
        connection.query(updateQuery, [newPassword, pseudo], (error, results) => {
          if (error) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe dans la base de données' });
            return;
          }
          res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
        //});
      });
    });
  });
});


app.get('/api/users/get-email/:email', (req, res) => {
  const { email } = req.params;
  console.log(email);
  connection.query('SELECT * FROM User WHERE email = ?', [email], (error, results) => {
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

app.get('/api/users/get-pseudo/:pseudo', (req, res) => {
  const { pseudo } = req.params;
  const query = `
    SELECT User.*, Stat.nbDefis, Stat.nbEtoiles 
    FROM User 
    LEFT JOIN Stat ON User.pseudo = Stat.unUser 
    WHERE User.pseudo = ?
  `;
  connection.query(query, [pseudo], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur et des statistiques depuis la base de données' });
      console.error('Erreur lors de la récupération de l\'utilisateur et des statistiques depuis la base de données', error);
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }
    res.json(results[0]);
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

app.get('/api/stats/totalNufs', (req, res) => {
  connection.query('SELECT SUM(nufs) as nufs FROM Stat', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques depuis la base de données' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/stats', (req, res) => {
  const { unUser, nbDefis, nbEtoiles, nufs } = req.body;
  const query = 'INSERT INTO Stat (unUser, nbDefis, nbEtoiles, nufs) VALUES (?, ?, ?, ?)';
  connection.query(query, [unUser, nbDefis, nbEtoiles, nufs], (error, results) => {
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

app.get('/api/stats/user/:unUser', (req, res) => {
  const { unUser } = req.params;
  connection.query('SELECT * FROM Stat WHERE unUser = ?', [unUser], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques depuis la base de données' });
      return;
    }
    res.json(results[0]);
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

app.get('/api/defiUsers/count', (req, res) => {
  connection.query('SELECT COUNT(*) as defis FROM DefiUser WHERE dateFin IS NOT NULL', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des relations utilisateur-défi depuis la base de données' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/defiUsers', (req, res) => {
  const { unUser, unDefi, dateDebut, dateFin, nbEtoiles } = req.body;
  const query = 'INSERT INTO DefiUser (unUser, unDefi, dateDebut, dateFin, nbEtoiles) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [unUser, unDefi, dateDebut, dateFin, nbEtoiles], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout de la relation utilisateur-défi à la base de données' });
      console.error('Erreur lors de l\'ajout de la relation utilisateur-défi à la base de données', error);
      return;
    }
    // Update stats
    connection.query(
      'UPDATE Stat SET nbDefis = nbDefis + 1, nbEtoiles = nbEtoiles + ? WHERE unUser = ?',
      [nbEtoilesObtenu, unUser],
      (updateError) => {
        if (updateError) {
          res.status(500).json({ error: 'Erreur lors de la mise à jour des statistiques dans la base de données' });
          console.error('Erreur lors de la mise à jour des statistiques dans la base de données', updateError);
          return;
        }
        res.status(201).json({ message: 'Relation utilisateur-défi ajoutée avec succès et statistiques mises à jour' });
      }
    );
  });
});

app.delete('/api/defiUsers/:unUser/:unDefi', (req, res) => {
  const { unUser, unDefi } = req.params;
  connection.query('DELETE FROM DefiUser WHERE unUser = ? AND unDefi = ?', [unUser, unDefi], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de la relation utilisateur-défi de la base de données' });
      return;
    }
    // Update stats
    connection.query(
      'UPDATE Stat SET nbDefis = nbDefis - 1, nbEtoiles = nbEtoiles - (SELECT nbEtoilesObtenu FROM DefiUser WHERE unUser = ? AND unDefi = ?) WHERE unUser = ?',
      [unUser, unDefi, unUser],
      (updateError) => {
        if (updateError) {
          res.status(500).json({ error: 'Erreur lors de la mise à jour des statistiques dans la base de données' });
          console.error('Erreur lors de la mise à jour des statistiques dans la base de données', updateError);
          return;
        }
        res.status(200).json({ message: 'Relation utilisateur-défi supprimée avec succès et statistiques mises à jour' });
      }
    );
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

app.get('/api/defiUsers/stars/:unUser/:unDefi', (req, res) => {
  const { unUser, unDefi } = req.params;
  connection.query('SELECT nbEtoiles FROM DefiUser WHERE unUser = ? AND unDefi = ?', [unUser, unDefi], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération du nombre d\'étoiles depuis la base de données' });
      return;
    }
    if (results.length === 0) {
      res.json({ nbEtoiles: 0 }); // Aucune étoile si aucun enregistrement trouvé
      return;
    }
    res.json({ nbEtoiles: results[0].nbEtoiles });
  });
});