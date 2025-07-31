# Red Bull Rampage - API Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-%3E%3D20.10-blue)](https://www.docker.com/)

API backend pour le site de la compétition Red Bull Rampage, la compétition de VTT freeride la plus extrême au monde.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec JWT
- **API RESTful** pour la gestion des utilisateurs
- **Base de données MySQL** avec Sequelize ORM
- **Architecture modulaire** (MVC)
- **Conteneurisation** avec Docker
- **Documentation** avec Postman

## 📋 Prérequis

- Node.js 18.x ou supérieur
- Docker 20.10+ et Docker Compose
- MySQL 8.0+ (ou utiliser le conteneur Docker fourni)
- Postman (pour tester l'API)

## 🛠 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/redbull-rampage.git
   cd redbull-rampage
   ```

2. **Copier le fichier d'environnement**
   ```bash
   cp .env.example .env
   ```
   
   Puis éditez le fichier `.env` avec vos configurations.

3. **Installer les dépendances**
   ```bash
   npm install
   ```

## 🐳 Docker

### Démarrer les services
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

### Développement
```bash
npm run dev
```

### Production
```bash
npm start
```

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` à la racine avec les variables suivantes :

```env
# Application
NODE_ENV=development
PORT=3000

# Base de données
DB_HOST=db
DB_PORT=3306
DB_NAME=redbull_db
DB_USER=redbull_user
DB_PASS=redbull_password

# JWT
JWT_SECRET=votre_secret_tres_securise
JWT_EXPIRE=30d
```

## 📚 Documentation API

La documentation complète de l'API est disponible dans la collection Postman fournie (`postman_collection.json`).

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

2. **Installer les dépendances PHP**
   ```bash
   composer install
   ```

3. **Copier le fichier d'environnement**
   ```bash
   cp .env.example .env
   ```

4. **Générer une clé d'application**
   ```bash
   php -r "echo 'APP_KEY=' . base64_encode(random_bytes(32)) . PHP_EOL;" >> .env
   ```

5. **Configurer la base de données**
   - Créer une base de données MySQL/MariaDB
   - Mettre à jour le fichier `.env` avec les informations de connexion

6. **Exécuter les migrations**
   ```bash
   php database/migrate.php
   ```

7. **Installer les dépendances frontend**
   ```bash
   npm install
   npm run dev
   ```

8. **Configurer le serveur web**
   - Configurer le serveur web pour pointer vers le dossier `public/`
   - Assurez-vous que le module `mod_rewrite` est activé pour Apache

9. **Lancer l'application**
   ```bash
   php -S localhost:8000 -t public
   ```
   Ou utilisez votre serveur web configuré.

## Structure du projet

```
redbull-rampage/
├── app/                    # Code source de l'application
│   ├── controllers/        # Contrôleurs
│   ├── models/             # Modèles
│   └── views/              # Vues
├── config/                 # Fichiers de configuration
├── database/               # Migrations et seeders
├── public/                 # Point d'entrée public
│   ├── assets/             # Fichiers statiques (CSS, JS, images)
│   └── index.php           # Point d'entrée de l'application
├── storage/                # Fichiers générés (cache, logs, etc.)
├── tests/                  # Tests automatisés
└── vendor/                 # Dépendances Composer
```

## Développement

### Lancer le serveur de développement
```bash
php -S localhost:8000 -t public
```

### Compiler les assets
```bash
npm run dev       # Compilation en mode développement
npm run watch    # Surveillance des changements
npm run prod     # Compilation pour la production
```

### Exécuter les tests
```bash
php vendor/bin/phpunit
```

## Sécurité

Si vous découvrez une vulnérabilité de sécurité, veuillez envoyer un e-mail à security@example.com. Toutes les vulnérabilités de sécurité seront traitées rapidement.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Remerciements

- [Red Bull](https://www.redbull.com/) pour l'organisation de l'événement
- Tous les riders participants
- La communauté du VTT freeride
