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
    photo LONGTEXT,
    estAdmin BOOLEAN NOT NULL,
    PRIMARY KEY (pseudo)
);

CREATE TABLE Stat (
    unUser VARCHAR(15) NOT NULL,
    nbDefis INT NOT NULL,
    nbEtoiles INT NOT NULL,
    nufs INT NOT NULL,
    PRIMARY KEY (unUser),
    FOREIGN KEY (unUser) REFERENCES User(pseudo)
);

CREATE TABLE Defi (
    idDefi INT NOT NULL AUTO_INCREMENT,
    titre VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    nbEtoiles INT NOT NULL DEFAULT 3,
    difficulte VARCHAR(50) NOT NULL,
    PRIMARY KEY (idDefi),
    CONSTRAINT chk_difficulte CHECK (difficulte IN ('Facile', 'Intermédiaire', 'Difficile'))
);

CREATE TABLE DefiUser (
    unUser VARCHAR(15) NOT NULL,
    unDefi INT NOT NULL,
    dateDebut TIMESTAMP NOT NULL,
    dateFin TIMESTAMP,
    nbEtoiles INT NOT NULL,
    PRIMARY KEY (unUser, unDefi),
    FOREIGN KEY (unUser) REFERENCES User(pseudo),
    FOREIGN KEY (unDefi) REFERENCES Defi(idDefi)
);

-- Trigger to add Stat for the User who has been created
DELIMITER $$
CREATE TRIGGER after_user_insert
AFTER INSERT ON User
FOR EACH ROW
BEGIN
  INSERT INTO Stat (unUser, nbDefis, nbEtoiles, nufs)
  VALUES(NEW.pseudo, 0, 0, 0);
END$$
DELIMITER ;

-- Trigger to delete Stat for the User who has been deleted
DELIMITER $$
CREATE TRIGGER before_user_deleted
BEFORE DELETE ON User
FOR EACH ROW
BEGIN
  DELETE FROM DefiUser WHERE unUser = OLD.pseudo;
  DELETE FROM Stat WHERE unUser = OLD.pseudo;
END$$
DELIMITER ;

-- Trigger to delete DefiUser for the Defi which has been deleted
DELIMITER $$
CREATE TRIGGER before_defi_deleted
BEFORE DELETE ON Defi
FOR EACH ROW
BEGIN
  DELETE FROM DefiUser WHERE unDefi = OLD.idDefi;
END$$
DELIMITER ;

-- Trigger to update the stats when a DefiUser is added with dateFin not null
DELIMITER $$
CREATE TRIGGER after_defiuser_insert
AFTER INSERT ON DefiUser
FOR EACH ROW
BEGIN
    IF NEW.dateFin IS NOT NULL THEN
        UPDATE Stat
        SET nbDefis = nbDefis + 1,
            nbEtoiles = nbEtoiles + NEW.nbEtoiles,
            nufs = nufs + calcul_nufs(NEW.unDefi)
        WHERE unUser = NEW.unUser;
    END IF;
END$$
DELIMITER ;

-- Trigger to update the stats when a DefiUser is update with dateFin not null
DELIMITER $$
CREATE TRIGGER after_defiuser_update
AFTER UPDATE ON DefiUser
FOR EACH ROW
BEGIN
    IF NEW.dateFin IS NOT NULL THEN
        UPDATE Stat
        SET nbDefis = nbDefis + 1,
            nbEtoiles = nbEtoiles + NEW.nbEtoiles,
            nufs = nufs + calcul_nufs(NEW.unDefi)
        WHERE unUser = NEW.unUser;
    END IF;
END$$
DELIMITER ;

-- Trigger to update the stats when a DefiUser is delete with dateFin not null
DELIMITER $$
CREATE TRIGGER after_defiuser_delete
AFTER DELETE ON DefiUser
FOR EACH ROW
BEGIN
  IF OLD.dateFin IS NOT NULL THEN
        UPDATE Stat
        SET nbDefis = nbDefis - 1,
            nbEtoiles = nbEtoiles - OLD.nbEtoiles,
            nufs = nufs - calcul_nufs(OLD.unDefi)
        WHERE unUser = OLD.unUser;
    END IF;
END$$
DELIMITER ;

-- Function to calculate nufs
DELIMITER $$
CREATE FUNCTION calcul_nufs(leDefi INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE nufs INT;
    DECLARE diff_coeff INT;

    SELECT
        CASE difficulte
            WHEN 'Facile' THEN 4
            WHEN 'Intermédiaire' THEN 6
            WHEN 'Difficile' THEN 9
        END INTO diff_coeff
    FROM Defi
    WHERE idDefi = leDefi;

    SELECT DU.nbEtoiles * diff_coeff INTO nufs
    FROM DefiUser DU
    WHERE DU.unDefi = leDefi;

    RETURN nufs;
END$$
DELIMITER ;


-- Ins�rer les utilisateurs
INSERT INTO User (pseudo, email, motDePasse, nom, prenom, dateInscription, dateNaissance, photo, estAdmin)
VALUES 
('nathan', 'nathan@email.com', 'mdp_nathan', 'Basol', 'Nathan', '2024-01-09', '2004-04-22', 'https://via.placeholder.com/150', 1),
('mathis', 'mathis@email.com', 'mdp_mathis', 'Gueguen', 'Mathis', '2024-01-09', '2004-05-15', 'https://via.placeholder.com/150', 1),
('mathieu', 'mathieu@email.com', 'mdp_mathieu', 'Stephan', 'Mathieu', '2024-01-09', '2004-12-20', 'https://via.placeholder.com/150', 1);

-- Ins�rer les d�fis
INSERT INTO Defi (idDefi, titre, description, nbEtoiles, difficulte)
VALUES 
(1, 'Defi 1', 'Description du defi 1', 3, 'Facile'),
(2, 'Defi 2', 'Description du defi 2', 3, 'Intermédiaire'),
(3, 'Defi 3', 'Description du defi 3', 3, 'Difficile');

-- Ins�rer les relations entre utilisateurs et d�fis
INSERT INTO DefiUser (unUser, unDefi, dateDebut, dateFin, nbEtoiles)
VALUES 
('nathan', 1, TIMESTAMP('2024-01-09', '13:01:02'), TIMESTAMP('2024-01-10', '14:41:23'), 3),
('mathis', 2, TIMESTAMP('2024-01-10', '09:36:56'), TIMESTAMP('2024-01-10', '17:06:33'), 2),
('mathieu', 3, TIMESTAMP('2024-01-11', '18:18:18'), TIMESTAMP('2024-01-11', '22:14:55'), 1);