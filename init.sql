CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'defiut23';
ALTER USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'defiut23';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;

USE defiut;

CREATE TABLE User (
    pseudo VARCHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL,
    motDePasse VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    dateInscription DATE NOT NULL,
    dateNaissance DATE NOT NULL,
    photo VARCHAR(50),
    estAdmin BOOLEAN NOT NULL,
    PRIMARY KEY (pseudo)
);

CREATE TABLE Stat (
    unUser VARCHAR(15) NOT NULL,
    nbDefis INT NOT NULL,
    nbEtoiles INT NOT NULL,
    score INT NOT NULL,
    nufs INT NOT NULL,
    PRIMARY KEY (unUser),
    FOREIGN KEY (unUser) REFERENCES User(pseudo)
);

CREATE TABLE Defi (
    idDefi INT NOT NULL AUTO_INCREMENT,
    titre VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    nbEtoiles INT NOT NULL,
    categorie VARCHAR(50) NOT NULL,
    indice VARCHAR(255),
    PRIMARY KEY (idDefi)
);

CREATE TABLE DefiUser (
    unUser VARCHAR(15) NOT NULL,
    unDefi INT NOT NULL,
    dateDebut DATE NOT NULL,
    dateFin DATE NOT NULL,
    nbEtoilesObtenu INT NOT NULL,
    PRIMARY KEY (unUser, unDefi),
    FOREIGN KEY (unUser) REFERENCES User(pseudo),
    FOREIGN KEY (unDefi) REFERENCES Defi(idDefi)
);

-- Ins�rer les utilisateurs
INSERT INTO User (pseudo, email, motDePasse, nom, prenom, dateInscription, dateNaissance, photo, estAdmin)
VALUES 
('nathan', 'nathan@email.com', 'mdp_nathan', 'Basol', 'Nathan', '2024-01-09', '2004-04-22', 'url_photo1', 1),
('mathis', 'mathis@email.com', 'mdp_mathis', 'Gueguen', 'Mathis', '2024-01-09', '2004-05-15', 'photo_url2', 1),
('mathieu', 'mathieu@email.com', 'msp_mathieu', 'Stephan', 'Mathieu', '2024-01-09', '2004-12-20', 'photo_url3', 0);

-- Ins�rer les statistiques
INSERT INTO Stat (unUser, nbDefis, nbEtoiles, score, nufs)
VALUES 
('nathan', 0, 0, 0, 0),
('mathis', 0, 0, 0, 0),
('mathieu', 0, 0, 0, 0);

-- Ins�rer les d�fis
INSERT INTO Defi (idDefi, titre, description, nbEtoiles, categorie, indice)
VALUES 
(1, 'D�fi 1', 'Description du d�fi 1', 3, 'Cat�gorie 1', 'Indice 1'),
(2, 'D�fi 2', 'Description du d�fi 2', 2, 'Cat�gorie 2', 'Indice 2'),
(3, 'D�fi 3', 'Description du d�fi 3', 1, 'Cat�gorie 1', 'Indice 3');

-- Ins�rer les relations entre utilisateurs et d�fis
INSERT INTO DefiUser (unUser, unDefi, dateDebut, dateFin, nbEtoilesObtenu)
VALUES 
('nathan', 1, '2024-01-09', '2024-01-15', 2),
('mathis', 2, '2024-01-10', '2024-01-16', 1),
('mathieu', 3, '2024-01-11', '2024-01-17', 1);