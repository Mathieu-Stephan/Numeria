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

-- Creation de la table Defi avec contrainte de type TEXT
CREATE TABLE Defi (
    idDefi INT NOT NULL AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    nbEtoiles INT NOT NULL DEFAULT 3,
    difficulte VARCHAR(255) NOT NULL,
    contrainte TEXT,
    objectifTech1 TEXT,
    objectifTech2 TEXT,
    objectifTech3 TEXT,
    objectifTech4 TEXT,
    critere1 TEXT,
    critere2 TEXT,
    critere3 TEXT,
    critere4 TEXT,
    PRIMARY KEY (idDefi),
    CONSTRAINT chk_difficulte CHECK (difficulte IN ('Facile', 'Intermediaire', 'Difficile'))
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
            WHEN 'Intermediaire' THEN 6
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
-- Inserer les defis
INSERT INTO Defi (idDefi, titre, description, nbEtoiles, difficulte, contrainte, objectifTech1, objectifTech2, objectifTech3, objectifTech4, critere1, critere2, critere3, critere4)
VALUES 
(1, "Correcteur Orthographique", "Vous travaillez pour une entreprise de developpement de logiciels qui souhaite ameliorer la qualite de son application en integrant un correcteur orthographique. L'objectif est de permettre aux utilisateurs de corriger rapidement les fautes d'orthographe dans leurs textes. Votre mission est de mettre en œuvre un correcteur orthographique en utilisant l'algorithme de Levenshtein. Cet algorithme mesure la similarite entre deux chaînes de caracteres en calculant le nombre minimum d'operations necessaires pour les transformer l'une en l'autre (insertion, suppression, substitution).
", 3, "Difficile", "Python - Interdiction d'utiliser des bibliotheques externes pour l'algorithme de Levenshtein", 
 "Correction de texte : Implementer une fonction en JavaScript, nommee 'correcteurOrthographique', qui prend en entree un texte avec des fautes d'orthographe et renvoie le même texte corrige.", 
 "Gestion des suggestions : Si un mot n'est pas reconnu ou comporte des erreurs, la fonction doit proposer des suggestions de mots corrects en se basant sur l'algorithme de Levenshtein.",
 "Personnalisation : Permettre e l'utilisateur de definir le seuil de similarite pour les suggestions. Par exemple, si le seuil est fixe e 2, seules les suggestions avec une distance de Levenshtein de 2 ou moins seront proposees.",
 NULL,
 "signature correcteurOrthographique(mot, dictionnaire, seuil)",
 "Mot : Chaine de caractere representant le mot e corriger",
 "Dictionnaire : Liste de chaine de caracteres representant une liste de mots valides",
 "Seuil : Entier non obligatoire representant la distance de Levenshtein maximum autorisee"),

(2, "Recherche de mots", "Imaginez que vous travaillez au sein d'une entreprise de gestion de documents qui stocke un grand nombre de fichiers texte lies e differents projets. Les collaborateurs ont souvent du mal e retrouver rapidement des informations specifiques au sein de ces fichiers. Pour resoudre ce probleme, votre equipe a decide de creer un outil de recherche personnalise permettant aux utilisateurs de localiser rapidement une expression dans un ensemble de fichiers ou de pages web de taille importante.", 3, "Intermediaire", "Utilisation de Node.js : Le developpement doit se faire en JavaScript avec l'utilisation de Node.js pour lancer le programme. / Exclusion de fichiers systeme : Les fichiers systeme ne doivent pas être pris en compte dans la recherche. / Systeme d’exploitation : Le programme doit être en mesure de detecter le systeme d’exploitation (OS) sur lequel il est execute, et de fonctionner en consequence. Les deux systemes d’exploitation qu’il est demande d’implementer dans le programme sont Linux (Ubuntu) et Windows. Vous pouvez bien sûr en implementer d’autres, mais ça ne sera pas comptabilise dans la note finale.",
 "Recherche de mot : L'outil doit permettre e l'utilisateur de specifier le mot e rechercher",
 "Identification de fichiers : Le programme doit parcourir tous les fichiers texte d'un repertoire specifie et il doit avoir une option pour visiter les sous-repertoires de ce repertoire.",
 "Gestion asynchrone : Les operations de lecture de fichiers doivent être gerees de maniere asynchrone pour eviter tout blocage.",
 NULL,
 "Presence du mot : Les fichiers identifies doivent effectivement contenir le mot specifie, et tous les fichiers contenant le mot doivent être retournes",
 "Performance : Le programme doit être capable de gerer de grands ensembles de fichiers (de taille differente) de maniere efficace.",
 "Prise en charge des fichiers texte : Le programme doit être capable de traiter differents formats de fichiers texte : .txt, .pdf, .html, etc. Une plus grande variete de fichiers textes pris en charge permettra d’evaluer la qualite du programme",
 "Signature de la fonction : Les utilisateurs devront creer une fonction signee de la maniere suivante : detectWord(word, path, subdir, print). • word : Chaîne de caracteres representant l’expression (le mot) e rechercher. • path : Chaîne de caracteres representant le chemin (relatif au dossier où se trouve le programme, ou absolu) e partir duquel rechercher le mot. • subdir : Booleen indiquant s’il faut rechercher dans les sous-dossiers egalement ou non (true = oui, false = non). • print : Booleen indiquant s’il faut afficher le resultat e l’ecran (true) ou bien juste retourner la liste des fichiers (false). • Retour : La liste des fichiers (relatif au dossier renseigne path) contenant le mot word, ainsi qu’une liste contenant des eventuels avertissements (problemes de permission, de format de fichier, etc.)."),

(3, "Generateur de mots de passes securises", "Vous êtes un developpeur travaillant pour une entreprise specialisee dans la securite informatique. La societe cherche e renforcer la securite des comptes de ses utilisateurs en mettant en place un generateur de mots de passe securises. Votre mission est de creer un outil permettant aux utilisateurs de generer des mots de passe robustes, tout en respectant leurs preferences en termes de longueur (de minimum 8 caracteres).
", 3, "Facile", "JavaScript / Interdiction d’utiliser des bibliotheques", 
 "Longueur personnalisable : permettre e l’utilisateur de definir la longueur du mot de passe (minimum 8 caracteres). La longueur sera demandee e l’utilisateur sous la forme d’un prompt où il pourra ecrire le nombre de caracteres qu’il souhaite. Si la longueur est insuffisante, alors l’algorithme devra renvoyer un message d’erreur approprie : « La longueur du mot de passe doit être superieur e 8 caracteres ! »", 
 "Types de caracteres : Le mot de passe doit contenir tous types de caracteres : lettres majuscules, lettres minuscules, chiffres, symboles afin qu’il soit le plus securise possible.",
 "Generation aleatoire : L’algorithme doit fournir un mot de passe totalement aleatoire.",
 "Exclusion de caracteres : Certains systemes ne tolerent pas des caracteres speciaux. Nous souhaitons que la fonction e developper permette cette exclusion. Si un utilisateur saisie tous les caracteres speciaux dans la liste d’exclusion, l’algorithme ne doit pas pouvoir generer de mot de passe.",
 "Les participants devront creer une fonction en JavaScript, signee generatePassword(int length, array excludedWords), capable de generer un mot de passe securise selon la longueur definie et d’exclure un ou plusieurs caracteres.",
 "L'algorithme doit respecter la personnalisation de la longueur du mot de passe et inclure tous les types de caracteres (lettres majuscules, minuscules, chiffres, symboles).",
 "L’algorithme ne genere que des mots de passes au-dessus de 8 caracteres.",
 "La generation du mot de passe doit être aleatoire, garantissant ainsi une robustesse supplementaire, un pattern entre les generations ne doit pas se produire.");


-- Ins�rer les relations entre utilisateurs et d�fis
INSERT INTO DefiUser (unUser, unDefi, dateDebut, dateFin, nbEtoiles)
VALUES 
('nathan', 1, TIMESTAMP('2024-01-09', '13:01:02'), TIMESTAMP('2024-01-10', '14:41:23'), 3),
('mathis', 2, TIMESTAMP('2024-01-10', '09:36:56'), TIMESTAMP('2024-01-10', '17:06:33'), 2),
('mathieu', 3, TIMESTAMP('2024-01-11', '18:18:18'), TIMESTAMP('2024-01-11', '22:14:55'), 1);