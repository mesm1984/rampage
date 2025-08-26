# Dossier technique complet du projet Red Bull Rampage

## 1. Présentation générale
Ce projet est une application web complète pour la compétition Red Bull Rampage, réalisée en Node.js, Express, MySQL, Docker, et front-end HTML/CSS/JS. Il répond aux exigences RNCP Développeur Web & Web Mobile.

## 2. Architecture du projet
- **backend/** : Serveur Node.js (Express), API, gestion des utilisateurs, forum, sécurité JWT, ORM Sequelize.
- **public/** : Front-end statique (HTML, CSS, JS), pages du site, assets, PWA, chatbot.
- **data/** : Données statiques (faqs.json pour le chatbot).
- **templates/** : Templates HTML injectés dynamiquement (chatbot).
- **Dockerfile / docker-compose.yml** : Conteneurisation et orchestration multi-services.

## 3. Fonctionnalités principales
### a) Authentification & Sécurité
- Inscription, connexion, JWT, gestion des rôles (admin/user), hashage des mots de passe (bcrypt).
- Sécurisation des routes API, gestion des tokens, cookies sécurisés.

### b) Forum
- Création de sujets, réponses, gestion des utilisateurs connectés.
- API REST sécurisée, validation des entrées, gestion des erreurs.

### c) Chatbot
- Chatbot contextuel (FAQ, IA HuggingFace), interface dynamique injectée sur toutes les pages.
- Chargement dynamique du template, des styles et du script métier.
- Utilisation d’un fichier faqs.json pour les réponses rapides, fallback IA si besoin.

### d) Classements & Podiums
- Pages statiques pour les classements masculin/féminin, podiums, galerie photos.
- Accessibilité renforcée (balises ARIA, contrastes, navigation clavier).

### e) Performance & SEO
- Service Worker (PWA), cache, manifest, images WebP, lazy loading.
- Optimisation Lighthouse (score > 90), balises meta, sitemap, robots.txt.

### f) Infrastructure & DevOps
- Docker multi-environnement (dev/prod), CI/CD GitHub Actions, gestion des secrets par variables d’environnement.
- Séparation des fichiers sensibles (non versionnés).

## 4. Rôle de chaque dossier/fichier
- **backend/server.js** : Point d’entrée du serveur, routes API, configuration Express, sécurité, exposition des fichiers statiques et templates.
- **backend/models/** : Modèles Sequelize (User, Forum, etc.), mapping BDD.
- **backend/routes/** : Définition des routes API (auth, forum).
- **backend/controllers/** : Logique métier des routes.
- **backend/middleware/** : Middlewares de sécurité, gestion des erreurs.
- **public/** : Pages HTML, CSS, JS, images, scripts frontaux, PWA.
- **public/js/include-chatbot.js** : Injection dynamique du chatbot sur toutes les pages.
- **public/js/chatbot-optimized.js** : Logique métier du chatbot (UI, requêtes, IA).
- **public/css/chatbot-optimized.css** : Styles avancés du chatbot.
- **public/sw.js, sw-performance.js** : Service Workers pour PWA et optimisation.
- **data/faqs.json** : Base de connaissances FAQ pour le chatbot.
- **templates/chatbot.html** : Template HTML du chatbot injecté dynamiquement.
- **Dockerfile, docker-compose.yml** : Conteneurisation, orchestration multi-services.

## 5. Résultat attendu
- **Site web complet, responsive, accessible, sécurisé**
- **Chatbot fonctionnel sur toutes les pages**
- **Forum opérationnel avec authentification**
- **Classements et galeries accessibles**
- **Performance et SEO optimisés (PWA, Lighthouse > 90)**
- **Déploiement possible en production via Docker**
- **Aucune donnée sensible dans le dépôt Git (secrets sur clé USB)**

## 6. Conseils d’utilisation et d’oral
- Démarrer le projet avec Docker ou npm (`npm start` dans backend/).
- Pour la sécurité, ne jamais versionner les fichiers `.env` ou secrets.
- Pour l’oral, présenter chaque page, montrer le chatbot, la PWA, le forum, et la sécurité (JWT, bcrypt).
- Expliquer la structure du code et la séparation des responsabilités.

---

Ce document peut être converti en PDF pour l’oral ou l’archivage. Pour plus de détails sur chaque fichier, se référer aux commentaires dans le code source.
