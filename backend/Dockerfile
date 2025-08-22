
# Étape 1 : Utiliser une image Node.js officielle comme base
FROM node:20-alpine3.18


# Créer le répertoire de l'application
WORKDIR /usr/src/app






# Copier les fichiers package.json et package-lock.json du backend
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
