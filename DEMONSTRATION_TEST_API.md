# Comment faire une démonstration de test API

## 1. Préparer l’environnement
- Vérifie que ton serveur backend (Node.js/Express) est bien lancé (via Docker ou npm/yarn).
- Ouvre Postman (ou Insomnia, Thunder Client, etc.).
- Assure-toi d’avoir l’URL de base de ton API (ex : http://localhost:3000/ ou http://127.0.0.1:3000/).

## 2. Choisir une route à tester
Exemples classiques :
- Authentification : POST /api/auth/login
- Récupération des sujets du forum : GET /api/forum
- Création d’un sujet : POST /api/forum
- Récupération de la FAQ : GET /api/faqs

## 3. Configurer la requête dans Postman
- Sélectionne la méthode HTTP (GET, POST, PUT, DELETE…)
- Entre l’URL complète de la route (ex : http://localhost:3000/api/forum)
- Si besoin, ajoute un body (JSON) pour les requêtes POST/PUT (ex : { "titre": "Nouveau sujet", "contenu": "Message..." })
- Ajoute les headers nécessaires (Content-Type: application/json, Authorization si besoin)

## 4. Envoyer la requête et analyser la réponse
- Clique sur "Send"
- Observe le code de réponse HTTP (200, 201, 400, 401, 404, 500…)
- Lis le body de la réponse (succès, message d’erreur, données retournées)

## 5. Expliquer au jury
- Décris ce que tu testes (ex : "Je teste la création d’un sujet dans le forum")
- Montre la requête et la réponse
- Explique le résultat attendu (ex : "Je dois recevoir un objet avec l’ID du nouveau sujet et un code 201")
- Si tu obtiens une erreur, explique pourquoi (ex : "Erreur 401 car je ne suis pas authentifié")

## 6. Bonnes pratiques
- Prépare quelques requêtes types à l’avance dans Postman
- Montre que tu sais modifier les paramètres, le body, les headers
- Explique la logique de sécurité (authentification, droits d’accès)

---

**Exemple de test :**

1. Je lance le serveur avec `docker compose up -d` ou `npm start`.
2. Dans Postman, je fais un GET sur http://localhost:3000/api/faqs
3. Je reçois la liste des FAQs en JSON (code 200)
4. Je montre au jury la structure de la réponse et j’explique à quoi elle sert dans le site (ex : alimenter le chatbot)

---

**Astuce :**
Tu peux aussi importer le fichier `postman_collection.json` fourni dans le projet pour avoir tous les tests prêts à l’emploi.
