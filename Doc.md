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


### Description des fichiers 📁
- 'public' : Contient les fichiers statiques de l'application. On peut y trouver les images, le manifeste, le favicon, etc.

