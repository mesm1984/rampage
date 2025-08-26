# Documentation technique et fonctionnelle du projet Red Bull Rampage

## Sommaire
1. Présentation générale
2. Explication des pages HTML principales
   - index.html
   - Classement_Feminin.html
   - Classement_Masculin.html
   - Forum.html
   - galerie.html
   - Podiums.html
   - Connexion.html
3. Explication des scripts JS principaux
   - js/include-chatbot.js
   - js/chatbot-optimized.js
4. Explication des fichiers CSS principaux
   - css/chatbot-optimized.css
5. Explication du template chatbot
   - templates/chatbot.html
6. Résultat global attendu
7. Détail des fonctions JavaScript principales
8. Explication des autres fichiers et dossiers du projet

---

## 1. Présentation générale
Ce projet est un site événementiel pour la compétition Red Bull Rampage. Il propose : accueil, classements, galerie, forum, connexion, et un chatbot moderne accessible sur toutes les pages.

---

## 2. Explication des pages HTML principales

### index.html
- **Rôle** : Page d’accueil, point d’entrée du site.
- **Structure** : Header (logo, navigation), contenu principal (présentation), footer, inclusion dynamique du chatbot.
- **Résultat attendu** : L’utilisateur découvre l’événement et accède à toutes les rubriques.

### Classement_Feminin.html & Classement_Masculin.html
- **Rôle** : Afficher les classements des compétitions féminines/masculines.
- **Structure** : Tableaux de résultats, navigation, inclusion du chatbot.
- **Résultat attendu** : Visualisation claire des classements.

### Forum.html
- **Rôle** : Espace d’échange communautaire.
- **Structure** : Header, navigation, liste des sujets, formulaire de message, gestion utilisateur, inclusion du chatbot.
- **Résultat attendu** : Les utilisateurs peuvent lire, poster, répondre à des sujets, et interagir avec le chatbot.

### galerie.html
- **Rôle** : Galerie photos de l’événement.
- **Structure** : Grille d’images, navigation, inclusion du chatbot.
- **Résultat attendu** : Navigation visuelle agréable.

### Podiums.html
- **Rôle** : Présenter les podiums des épreuves.
- **Structure** : Affichage des vainqueurs, navigation, inclusion du chatbot.
- **Résultat attendu** : Visualisation des podiums.

### Connexion.html
- **Rôle** : Page de connexion utilisateur.
- **Structure** : Formulaire de connexion, gestion de l’état connecté, inclusion du chatbot.
- **Résultat attendu** : Accès sécurisé aux fonctionnalités avancées.

---

## 3. Explication des scripts JS principaux

### js/include-chatbot.js
- **Rôle** : Injecter dynamiquement le chatbot moderne sur toutes les pages.
- **Fonctions principales** :
  - `getBasePath()` : Calcule le chemin de base pour charger les ressources.
  - `loadResource(url, type)` : Charge dynamiquement un fichier CSS ou JS.
  - `loadChatbotTemplate()` : Récupère le template HTML du chatbot.
  - `includeChatbot()` : Fonction principale : injecte le template, charge le CSS moderne, le JS du chatbot, puis initialise le composant.
- **Résultat attendu** : Le chatbot s’affiche et fonctionne partout, sans doublon ni conflit de style.

### js/chatbot-optimized.js
- **Rôle** : Logique métier du chatbot (affichage, gestion des messages, communication API/FAQ).
- **Fonctions principales** :
  - `Chatbot` (classe principale) : Gère l’UI, les messages, les catégories, l’appel API.
    - `constructor()` : Initialise l’UI et l’état du chatbot.
    - `initialize()` : Prépare le chatbot (catégories, messages, etc.).
    - `createChatbotUI()` : Génère dynamiquement l’interface du chatbot.
    - `handleSendMessage()` : Gère l’envoi d’un message utilisateur.
    - `displayMessage()` : Affiche un message dans l’UI.
    - `loadCategories()` : Charge les catégories depuis la FAQ.
    - `callApi()` : (si utilisé) Appelle l’API pour obtenir une réponse.
- **Résultat attendu** : Le chatbot répond, affiche les messages, propose des FAQ, et guide l’utilisateur.

---

## 4. Explication des fichiers CSS principaux

### css/chatbot-optimized.css
- **Rôle** : Styles modernes du chatbot (apparence, responsive, animations).
- **Principaux styles** :
  - `.chatbot-toggle` : Bouton flottant d’ouverture du chatbot.
  - `#chatbot-container` : Fenêtre du chatbot (position, taille, animation).
  - `.chatbot-header`, `.chatbot-messages`, `.chatbot-input-container` : Styles des différentes parties du chatbot.
- **Résultat attendu** : Apparence professionnelle, moderne, cohérente sur tout le site.

---

## 5. Explication du template chatbot

### templates/chatbot.html
- **Rôle** : Structure HTML du chatbot injectée dynamiquement.
- **Contenu** :
  - Bouton d’ouverture, conteneur principal, header, zone de messages, input, boutons, catégories.
- **Résultat attendu** : Permet l’injection rapide et cohérente du composant chatbot sur toutes les pages.

---

## 6. Résultat global attendu
- Navigation fluide entre toutes les pages.
- Chatbot moderne, accessible partout, avec une apparence homogène.
- Forum fonctionnel, gestion des utilisateurs, affichage dynamique des classements et podiums.
- Code organisé, maintenable, facilement explicable lors d’une soutenance.

---

## 7. Détail des fonctions JavaScript principales

### Fichier : js/include-chatbot.js

#### getBasePath()
- **Rôle** : Retourne le chemin de base du site pour charger correctement les ressources selon la page courante.
- **Paramètres** : Aucun
- **Résultat attendu** : Une chaîne représentant le chemin de base (ex : "/" ou "/public/").
- **Exemple** : Utilisé pour construire le chemin du template ou des fichiers CSS/JS.

#### loadResource(url, type = 'css')
- **Rôle** : Charge dynamiquement un fichier CSS ou JS dans la page.
- **Paramètres** :
  - `url` : chemin du fichier à charger
  - `type` : 'css' (par défaut) ou 'script'
- **Résultat attendu** : Ajoute la ressource au DOM et résout une promesse quand elle est chargée.
- **Exemple** : `await loadResource('css/chatbot-optimized.css')`

#### loadChatbotTemplate()
- **Rôle** : Récupère le template HTML du chatbot via fetch.
- **Paramètres** : Aucun
- **Résultat attendu** : Retourne le HTML du template sous forme de chaîne.
- **Exemple** : `const template = await loadChatbotTemplate();`

#### includeChatbot()
- **Rôle** : Fonction principale qui injecte le chatbot sur la page (template, CSS, JS, initialisation).
- **Paramètres** : Aucun
- **Résultat attendu** : Le chatbot est visible et fonctionnel sur la page.
- **Exemple** : Appelée automatiquement au chargement du DOM.

---

### Fichier : js/chatbot-optimized.js

#### Classe Chatbot
- **Rôle** : Gère toute la logique du chatbot (UI, messages, FAQ, API, interactions).
- **Exemple d’utilisation** : `window.chatbot = new Chatbot();`

##### Méthodes principales :

- **constructor()**
  - Initialise l’UI et l’état du chatbot.
  - Pas de paramètres.
  - Résultat : Le chatbot est prêt à l’emploi.

- **initialize()**
  - Prépare l’UI, charge les catégories, configure les événements.
  - Résultat : Le chatbot affiche les catégories et le message d’accueil.

- **createChatbotUI()**
  - Génère dynamiquement l’interface HTML du chatbot si elle n’existe pas.
  - Résultat : Le DOM contient le conteneur du chatbot et le bouton flottant.

- **setupUI()**
  - Récupère les références aux éléments du DOM nécessaires au fonctionnement du chatbot.

- **loadCategories()**
  - Charge les catégories de FAQ depuis l’API backend.
  - Résultat : Met à jour la liste des catégories du chatbot.

- **addWelcomeMessage()**
  - Affiche un message d’accueil automatique du bot.

- **displayCategories()**
  - Affiche dynamiquement les boutons de catégories dans l’UI.

- **showQuestionsByCategory(category)**
  - Affiche les questions/réponses d’une catégorie sélectionnée.
  - Paramètre : `category` (objet catégorie)

- **setupEventListeners()**
  - Ajoute tous les écouteurs d’événements nécessaires (clics, envoi, fermeture, etc.).

- **findMatchingQuestion(userInput)**
  - Cherche une question similaire dans la FAQ à partir de la saisie utilisateur.
  - Paramètre : `userInput` (texte)
  - Résultat : Retourne l’objet question/réponse correspondant ou null.

- **showErrorMessage(message)**
  - Affiche un message d’erreur dans le chat.

- **getConversationContext()**
  - Retourne le contexte des derniers messages pour l’API.

- **checkFAQs(question)**
  - Cherche une réponse exacte ou partielle dans la FAQ.

- **getAIResponse(question)**
  - Appelle l’API backend pour obtenir une réponse IA si la FAQ ne suffit pas.
  - Paramètre : `question` (texte)
  - Résultat : Réponse générée par l’IA ou message d’erreur.

- **handleSendMessage()**
  - Gère l’envoi d’un message utilisateur (FAQ ou API).

- **addMessage(text, sender)**
  - Ajoute un message à l’UI et à l’historique.
  - Paramètres : `text` (texte du message), `sender` ('user' ou 'bot')

- **searchFAQ(query)**
  - Recherche une question dans la FAQ par mots-clés.

- **handleCategorySelect(categoryId)**
  - Gère la sélection d’une catégorie et affiche ses questions.
  - Paramètre : `categoryId` (identifiant)

- **handleQuestionClick(questionData)**
  - Affiche la question et la réponse sélectionnées dans le chat.

- **resetConversation()**
  - Réinitialise l’historique et affiche le message d’accueil.

- **toggleChatbot(event)**
  - Ouvre ou ferme le chatbot avec animation.
  - Paramètre : `event` (optionnel)

---

**Pour chaque méthode, le résultat attendu est une interaction fluide et intuitive avec le chatbot, que ce soit pour la FAQ ou l’IA.**

N’hésite pas à demander le détail d’une fonction précise si tu veux un exemple de code ou un schéma d’appel !

---

## 8. Explication des autres fichiers et dossiers du projet

### assets/
- **css/** : Contient d’anciens fichiers de styles ou des variantes CSS. Ils ne sont plus utilisés directement dans la version finale, mais peuvent servir de référence ou d’archives de styles précédents.
- **js/** : Contient d’anciens scripts du chatbot ou des utilitaires. Par exemple, `chatbot.js` était une version antérieure du chatbot, remplacée par la version optimisée dans `public/js/`.

### backend/
- **config/** : Fichiers de configuration pour la base de données (ex : `database.js`).
- **controllers/** : Gère la logique métier côté serveur (ex : `authController.js` pour l’authentification).
- **middleware/** : Fonctions intermédiaires pour la sécurité, la gestion des erreurs, etc.
- **models/** : Définit les modèles de données (ex : `User.js`).
- **routes/** : Définit les routes de l’API (authentification, forum, etc.).
- **server.js** : Point d’entrée du serveur Node.js/Express.

### data/
- **faqs.json** : Contient les questions/réponses utilisées par le chatbot pour la FAQ.

### database/
- **schema.sql** : Script SQL pour créer la structure de la base de données.
- **seed.sql** : Script SQL pour insérer des données de test ou initiales.

### public/
- **css/** : Contient tous les styles utilisés par le site (voir section CSS principale pour les fichiers critiques).
- **images/** : Toutes les images utilisées sur le site (logos, photos, illustrations, etc.).
- **js/** : Scripts JavaScript utilisés par le site (voir section JS principale pour les fichiers critiques).
- **templates/** : Peut contenir des fragments HTML réutilisables (ex : `chatbot.html`).

### postman_collection.json
- Fichier d’export Postman pour tester les routes de l’API (utile pour la démonstration ou les tests automatisés).

### docker-compose.yml & Dockerfile
- Fichiers de configuration pour le déploiement du projet avec Docker. Permettent de lancer facilement l’application et ses dépendances (base de données, serveur, etc.).

### README.md
- Présentation générale du projet, instructions d’installation et d’utilisation.

### LICENSE
- Indique la licence d’utilisation du projet.

---

**Remarque :** Tous les fichiers présents dans le projet ont un rôle précis (utilisé ou archive). Si le jury te demande l’utilité d’un fichier, explique simplement s’il est utilisé dans la version finale, s’il sert d’archive, ou s’il est là pour la configuration, la documentation ou les tests.
