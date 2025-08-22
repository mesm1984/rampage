# ⚠️ SÉCURITÉ - Fichiers Sensibles

## 🔒 Fichiers à NE JAMAIS commiter sur Git

Les fichiers suivants contiennent des informations sensibles et sont automatiquement exclus par `.gitignore` :

### Fichiers d'Environnement
- `.env.production` - Variables production avec mots de passe
- `.env.staging` - Variables staging avec mots de passe  
- `.env.local` - Variables locales développement
- `PASSWORDS_BACKUP.txt` - Sauvegarde de tous les mots de passe

### Certificats et Clés
- `ssl/` - Certificats SSL/TLS
- `*.pem` - Clés privées
- `*.key` - Clés de chiffrement
- `*.crt` - Certificats

## 🎯 Comment déployer en sécurité

1. **Localement** : Gardez vos fichiers `.env.*` 
2. **Sur le serveur** : Créez les fichiers `.env.*` manuellement
3. **CI/CD** : Utilisez les GitHub Secrets (voir `.github/workflows/ci-cd.yml`)

## 🔐 GitHub Secrets à configurer

Dans votre repository GitHub → Settings → Secrets and variables → Actions :

```
DB_PASSWORD=votre_mot_de_passe_db
JWT_SECRET=votre_clé_jwt_sécurisée
ADMIN_PASSWORD=votre_mot_de_passe_admin
DB_ROOT_PASSWORD=votre_mot_de_passe_root
REDIS_PASSWORD=votre_mot_de_passe_redis
```

## 🚨 En cas de fuite de sécurité

Si un fichier sensible a été committé par erreur :

```bash
# Supprimer du cache Git
git rm --cached fichier_sensible.env

# Ajouter au .gitignore si pas déjà fait
echo "fichier_sensible.env" >> .gitignore

# Commit et push
git commit -m "🔒 Suppression fichier sensible"
git push

# ⚠️ IMPORTANT: Changer TOUS les mots de passe exposés !
```

## 📋 Checklist Sécurité

- [x] `.gitignore` configuré pour exclure les fichiers sensibles
- [x] Variables d'environnement séparées par environnement
- [x] Mots de passe générés cryptographiquement 
- [x] GitHub Secrets configurés pour CI/CD
- [ ] Serveur production configuré avec les bonnes variables
- [ ] Certificats SSL en place
- [ ] Monitoring de sécurité activé

## 👥 Pour l'équipe

- **Développeurs** : Utilisez `.env.example` comme base, créez votre `.env` local
- **DevOps** : Gérez les secrets via GitHub Secrets et variables serveur
- **Admin** : Les mots de passe admin sont dans `PASSWORDS_BACKUP.txt` (local uniquement)

---
**🔥 RÈGLE D'OR** : Si c'est secret, ça ne va JAMAIS sur Git !
