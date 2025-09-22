# Red Bull Rampage 2024 - Site Web Complet

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-%3E%3D20.10-blue)](https://www.docker.com/)

Site web complet pour la compétition Red Bull Rampage 2024, la compétition de VTT freeride la plus extrême au monde.

## 🚀 Fonctionnalités

- **Site vitrine** avec galerie photos et classements
- **Forum interactif** avec système d'authentification
- **Chatbot intelligent** pour les FAQ
- **API RESTful** avec Node.js/Express
- **Base de données MySQL** avec Sequelize ORM
- **Responsive design** adaptatif mobile/desktop
- **Conteneurisation** avec Docker

## 📋 Prérequis

- Node.js 18.x ou supérieur
- Docker 20.10+ et Docker Compose
- MySQL 8.0+ (ou utiliser le conteneur Docker fourni)
- Postman (pour tester l'API)

## 🛠 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/mesm1984/rampage.git
   cd rampage
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. **Configuration de la base de données**
   ```bash
   # Démarrer les services avec Docker
   docker-compose up -d
   
   # Ou configurer manuellement MySQL et mettre à jour backend/config/database.js
   ```

## 🐳 Docker (Recommandé)

### Démarrer tous les services
```bash
docker-compose up -d
```

### Arrêter les services
```bash
docker-compose down
```

### Voir les logs
```bash
docker-compose logs -f
```

## 🚦 Démarrage

### Mode développement
```bash
# Backend API (port 3000)
cd backend
npm run dev

# Frontend (ouvrir public/index.html dans le navigateur)
# Ou utiliser un serveur local comme Live Server
```

### Mode production
```bash
cd backend
npm start
```

## 📁 Structure du projet

```
projet-diplome/
├── backend/                # API Node.js/Express
│   ├── controllers/        # Contrôleurs API
│   ├── models/             # Modèles Sequelize
│   ├── routes/             # Routes API
│   ├── middleware/         # Middlewares
│   ├── config/             # Configuration DB
│   └── tests/              # Tests unitaires
├── public/                 # Frontend HTML/CSS/JS
│   ├── css/                # Styles CSS
│   ├── js/                 # Scripts JavaScript
│   ├── images/             # Images du site
│   └── *.html              # Pages web
├── database/               # Scripts SQL
├── data/                   # Données JSON (FAQ)
└── docker-compose.yml      # Configuration Docker
```

## 🌐 Accès à l'application

- **Site web** : http://localhost:8080 (ou ouvrir public/index.html)
- **API Backend** : http://localhost:3000
- **Base de données** : http://localhost:8081 (phpMyAdmin)

## 📚 Documentation API

La documentation complète de l'API est disponible dans la collection Postman fournie (`postman_collection.json`).

### Principales routes :
- `GET /api/forum` - Liste des sujets du forum
- `POST /api/forum` - Créer un nouveau sujet
- `POST /api/auth/login` - Authentification utilisateur
- `GET /api/faqs` - Récupérer les FAQ pour le chatbot

## 🧪 Tests

```bash
cd backend
npm test
```

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🏆 Remerciements

- [Red Bull](https://www.redbull.com/) pour l'organisation de l'événement
- Tous les riders participants à Red Bull Rampage 2024
- La communauté du VTT freeride
