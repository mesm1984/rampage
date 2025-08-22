# Guide de Déploiement - Red Bull Rampage 2024

## 📋 Prérequis

### Système
- **Docker**: Version 20.10+ 
- **Docker Compose**: Version 2.0+
- **Node.js**: Version 18+ (pour le développement local)
- **Git**: Pour le versioning du code

### Environnements
- **Développement**: Local avec SQLite
- **Staging/Test**: Docker avec MySQL
- **Production**: Docker avec MySQL + Nginx + SSL

## 🚀 Déploiement Local (Développement)

```bash
# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env
# Modifier les variables selon vos besoins

# Démarrage en mode développement
npm run dev

# Ou avec Docker
docker-compose up -d
```

## 🧪 Déploiement Staging

```bash
# Configuration
cp .env.staging .env.staging
# Modifier les variables de production

# Déploiement avec script bash (Linux/macOS)
./deploy.sh staging

# Ou avec PowerShell (Windows)
.\deploy.ps1 -Environment staging

# Ou manuellement
docker-compose -f docker-compose.staging.yml --env-file .env.staging up -d
```

## 🔥 Déploiement Production

### Méthode Automatisée (Recommandée)

```bash
# Linux/macOS
./deploy.sh production

# Windows
.\deploy.ps1 -Environment production
```

### Méthode Manuelle

```bash
# 1. Sauvegarde des données
mkdir -p backups/$(date +%Y%m%d_%H%M%S)
docker exec redbull-mysql mysqldump -u root -p${DB_ROOT_PASSWORD} --all-databases > ./backups/backup.sql

# 2. Arrêt des services existants
docker-compose -f docker-compose.prod.yml down --remove-orphans

# 3. Mise à jour des images
docker-compose -f docker-compose.prod.yml pull

# 4. Démarrage des nouveaux services
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# 5. Vérification
docker-compose -f docker-compose.prod.yml ps
curl -f http://localhost/health
```

## 🔧 Configuration des Variables d'Environnement

### Variables Obligatoires (Production)
```bash
NODE_ENV=production
JWT_SECRET=your_very_long_and_secure_jwt_secret_key
DB_PASSWORD=your_secure_database_password
DB_ROOT_PASSWORD=your_secure_root_password
ADMIN_EMAIL=admin@redbull-rampage.com
ADMIN_PASSWORD=your_secure_admin_password
```

### Variables Optionnelles
```bash
# Monitoring
LOG_LEVEL=info
METRICS_ENABLED=true
HEALTH_CHECK_INTERVAL=30000

# Sécurité
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://redbull-rampage.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
```

## 🌐 Configuration DNS et SSL

### Certificats SSL
```bash
# Générer les certificats (Let's Encrypt recommandé)
mkdir -p ssl
# Placer certificate.crt et private.key dans le dossier ssl/
```

### Configuration Nginx
Le fichier `nginx.conf` est configuré pour:
- Redirection HTTP vers HTTPS
- Compression Gzip
- Headers de sécurité
- Rate limiting
- Proxy vers l'application Node.js

## 📊 CI/CD avec GitHub Actions

### Configuration
1. **Secrets GitHub**: Ajouter dans Settings > Secrets
   ```
   DB_PASSWORD
   JWT_SECRET
   ADMIN_PASSWORD
   CODECOV_TOKEN (optionnel)
   SLACK_WEBHOOK (optionnel)
   ```

2. **Variables d'environnement**: Configurées dans `.github/workflows/ci-cd.yml`

### Pipeline Automatique
- **Push sur `develop`**: Tests → Build → Déploiement Staging
- **Push sur `main`**: Tests → Build → Déploiement Production
- **Pull Request**: Tests uniquement

## 🔍 Monitoring et Logs

### Health Check
```bash
# Vérification rapide
curl http://localhost/health

# Logs de l'application
docker-compose logs -f redbull-app

# Logs de la base de données
docker-compose logs -f db

# Logs Nginx
docker-compose logs -f nginx
```

### Métriques
- **Promtail**: Collecte des logs
- **Watchtower**: Mise à jour automatique des conteneurs
- **Health checks**: Surveillance automatique des services

## 🚨 Procédures d'Urgence

### Rollback Rapide
```bash
# Revenir à la version précédente
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --force-recreate

# Restaurer une sauvegarde
docker exec -i redbull-mysql mysql -u root -p${DB_ROOT_PASSWORD} < backups/backup.sql
```

### Debug des Services
```bash
# Vérifier l'état des conteneurs
docker ps -a

# Examiner les logs d'un service spécifique
docker logs redbull-app --tail=100

# Accéder à un conteneur
docker exec -it redbull-app bash

# Vérifier les ressources
docker stats
```

## ✅ Checklist de Déploiement

### Avant le Déploiement
- [ ] Tests unitaires et d'intégration passent
- [ ] Variables d'environnement configurées
- [ ] Certificats SSL en place
- [ ] Sauvegarde de la base de données créée
- [ ] DNS pointant vers le serveur

### Après le Déploiement
- [ ] API accessible (`/health` répond 200)
- [ ] Connexion à la base de données fonctionnelle
- [ ] Tests de smoke des fonctionnalités critiques
- [ ] Logs sans erreurs critiques
- [ ] Monitoring opérationnel

### Tests Post-Déploiement
```bash
# Test de l'API
curl -X GET http://localhost/api/auth/status

# Test de connexion
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@redbull-rampage.com","password":"your_password"}'

# Test du forum
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost/api/forum/topics
```

## 📞 Support et Maintenance

### Contacts
- **Développeur**: Marco (marco@projet-diplome.com)
- **Ops**: À définir selon l'équipe

### Maintenance Préventive
- **Sauvegardes**: Automatiques via script cron
- **Mises à jour de sécurité**: Watchtower automatique
- **Monitoring**: Logs centralisés avec Promtail

### Documentation
- Logs de déploiement: `./backups/`
- Configuration: Variables d'environnement
- Architecture: `docker-compose.*.yml`
