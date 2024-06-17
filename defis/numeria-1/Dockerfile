# Utiliser une image Node.js officielle comme base
FROM node:14

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port sur lequel l'application va écouter
EXPOSE 3011

# Démarrer l'application
CMD ["node", "server.js"]
