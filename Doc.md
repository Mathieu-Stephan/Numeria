# Numeria 🎇
> Documentation, installation, fonctionnalitées et utilisation de Numeria.

## Introduction ❓
Numeria est une application React pour les défis de programmation informatique. Elle permet de résoudre des problèmes algorithmiques et de tester des solutions en temps réel. Les utilisateurs peuvent créer des comptes, enregistrer leurs solutions et partager leurs scores avec d'autres utilisateurs.

## Installation 🚀
### Prérequis 📋
Pour installer Numeria, vous devez simplement avoir Docker installé sur votre machine. Si il s'agit d'une machine Windows, vous devez aussi avoir WSL installé.
Vous devez avoir minimum 200Mo d'espace disque disponible pour la base de données et 2Go de RAM pour les conteneurs Docker.
Il faut aussi clonez le dépôt Git de Numeria ou téléchargez le code source.

### Installation 🔧

Pour installer Numeria, suivez ces étapes :
1. Clonez le dépôt.
2. Naviguez jusqu'au répertoire du projet.
3. Exécutez `docker-compose build` pour construire les images Docker.
4. Exécutez `docker-compose up` pour lancer les conteneurs Docker.
5. Ouvrez votre navigateur et allez à `http://localhost:3000`.

Assurez-vous que les ports 3000 et supérieurs sont ouverts sur votre machine. Vous devez bien attendre que les conteneurs soient prêts avant d'ouvrir votre navigateur.

<h4 style="color:red;">En cas d'erreur, annulé le processus avec `Ctrl+C` et relancez `docker-compose up`. Si l'erreur persiste, vérifiez que les ports 3000 et supérieurs sont ouverts sur votre machine.</h4>

Après avoir suivi ces étapes, vous devriez voir l'application Numeria dans votre navigateur !

## Fonctionnalités 📦

En arrivant sur la page d'accueil, vous verrez des statistiques sur les défis résolus, les utilisateurs enregistrés et les scores les plus élevés. De plus, vous pourrez voir les défis disponibles. Pour résoudre un défi, vous devez vous connecter ou créer un compte. Une fois connecté, vous pourrez soumettre une solution pour un défi et voir si elle est correcte.

### Sans compte utilisateur ❌
- Voir les statistiques utilisateur par défis et par scores.
- Voir les défis disponibles ainsi que leur description.
- Accéder à la page de connexion ou d'inscription (evidemment).
- Consulter les conditions d'utilisation et la politique de confidentialité.

### Avec un compte utilisateur ✅
- Toutes les fonctionnalités sans compte.
- Accès à la page de résolution de défis avec un éditeur de code.  
- Soumettre une solution pour un défi.
- Voir ses étoiles et son score.
- (Admin) Gérer les défis et les utilisateurs.


## Caractéristiques Techniques 🛠️

Pour ce projet, nous avons utilisé des technologies imposées par le cahier des charges fourni par notre client (les 3eme année). Nous avons donc utilisé les technologies suivantes :
- React pour le front-end.
- Node.js pour le back-end.
- express.js pour le serveur.
- MySQL pour la base de données.
- Docker pour l'environnement de développement.

### Vue d'ensemble des fichiers 📁
- 'public' : Contient les fichiers statiques de l'application. On peut y trouver les images, le manifeste, le favicon, etc.
- 'src' : Contient les fichiers sources de l'application.
  - 'components' : Contient les composants de l'application. On y trouve les composants NavBar.js et Footer.js.
  - 'styles' : Contient les fichiers de style de l'application. On y trouve les fichiers CSS.
  - 'pages' : Contient les pages de l'application. On y trouve les pages React.
  - 'App.js' : Fichier principal de l'application. C'est le composant principal de l'application.
  - 'App.css' : Fichier de style principal de l'application.
  - 'index.js' : Fichier d'entrée de l'application. C'est le fichier qui est exécuté en premier.
  - 'index.css' : Fichier de style principal de l'application (utilisé par index.js).
  - 'setupProxy.js' : Fichier de configuration du proxy de l'application.
  - 'reportWebVitals.js' : Fichier de rapport de performances de l'application.
  - 'setupTests.js' : Fichier de configuration des tests de l'application.
- 'fonts' : Contient les polices de caractères de l'application.
- 'Dockerfile' : Fichier de configuration de Docker pour le front-end.
- 'docker-compose.yml' : Fichier de configuration de Docker pour l'application.
- 'entrypoint.sh' : Fichier d'entrée de l'application pour Docker.
- 'package.json' : Fichier de configuration de Node.js pour l'application.
- 'package-lock.json' : Fichier de verrouillage des dépendances de Node.js pour l'application.
- 'server.js' : Fichier principal du serveur Node.js.

### Explication précise des pages 📄
- 'HomePage.js' : 
Page d'accueil de l'application. Elle affiche les statistiques et les défis disponibles. Elle contient les logos de l'application et les liens vers les autres pages. Cette page est accessible par tous les utilisateurs et contient les composants NavBar.js et Footer.js comme tous les autres pages.
- 'NavBar.js' :
Barre de navigation de l'application. Elle contient les liens vers les défis, le classement, les CGU et les infosrmations relative au compte (connection, création, modification et déconnection). Elle est présente sur toutes les pages de l'application.
- 'Footer.js' :
Pied de page de l'application. Il contient les liens vers le github et gitlab du projet. Il est présent sur toutes les pages de l'application.
- 'Defis.js' : Page qui liste les défis disponibles. Elle contient une liste de défis avec leur titre, difficulté et nombre d'étoiles. Elle est accessible par tous les utilisateurs. Cliquer sur un défi redirige vers la page spécifique du défi.
- 'DefiPage.js' : Page spécifique à un défi. Elle contient la description complète du défi ainsi que le temps passé, les objectifs techniques et les critères de validation. En bas de la page, un bouton redirige vers la page de résolution du défi. Si l'utilisateur est connecté, il peut démarer le défi (ce qui empêche de commencer un autre défi tant que celui-ci n'est pas terminé ou annulé).
- 'Classment.js' : Page qui liste les utilisateurs par score. Elle contient une liste d'utilisateurs avec leur pseudo et leur score. Elle est accessible par tous les utilisateurs.
- 'SignIn.js' : Page de connexion de l'application. Elle contient un formulaire de connexion avec un champ pour le mail et un pour le mot de passe. Elle est accessible par tous les utilisateurs.
- 'SignUp.js' : Page de création de compte de l'application. Elle contient un formulaire de création de compte avec un champ pour le pseudo, un pour le mail, un pour le mot de passe, deux pour le nom et le prénom et un pour la date de naissance. Elle est accessible par tous les utilisateurs. Après la création du compte, l'utilisateur est redirigé vers la page de connexion. Il a ensuite accès à toutes les fonctionnalités de l'application. Dont la page de gestion de compte.
- 'MyAccount.js' : Page de gestion de compte de l'application. Elle contient les informations de l'utilisateur connecté (pseudo, mail, nom, prénom, date de naissance) et un bouton pour se déconnecter. Elle est accessible par tous les utilisateurs connectés. Dans cette page, les utilisateurs peuvent modifier leur mot de passe, leur nom, prénom et date de naissance. Ils peuvent aussi changer leur avatar. Les utilisateurs notés comme administrateurs ont accès à une page de gestion des utilisateurs et des défis.
- 'AdminPage.js' : Page de gestion des utilisateurs et des défis. Elle contient plusieurs composants permettant aux administrateurs de gérer les utilisateurs et les défis. Les administrateurs peuvent voir la liste des utilisateurs, les modifier, les supprimer et les ajouter. Ils peuvent aussi voir la liste des défis, les modifier, les supprimer et les ajouter. Cette page est accessible uniquement par les utilisateurs notés comme administrateurs.