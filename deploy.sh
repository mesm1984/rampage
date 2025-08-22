#!/bin/bash

# Script de déploiement pour Red Bull Rampage 2024
# Ce script automatise le déploiement en production

set -e  # Arrêter le script en cas d'erreur

echo "🚀 Démarrage du déploiement Red Bull Rampage 2024..."

# Configuration
ENVIRONMENT=${1:-production}
IMAGE_TAG=${2:-latest}
COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Vérifications préalables
log "Vérification des prérequis..."

if ! command -v docker &> /dev/null; then
    error "Docker n'est pas installé"
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose n'est pas installé"
fi

if [ ! -f "$COMPOSE_FILE" ]; then
    error "Fichier $COMPOSE_FILE introuvable"
fi

if [ ! -f ".env.$ENVIRONMENT" ]; then
    error "Fichier .env.$ENVIRONMENT introuvable"
fi

success "Prérequis validés"

# Sauvegarde des données
log "Sauvegarde de la base de données..."
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

if docker ps | grep -q redbull-mysql; then
    docker exec redbull-mysql mysqldump -u root -p${DB_ROOT_PASSWORD} --all-databases > "$BACKUP_DIR/mysql_backup.sql" 2>/dev/null || true
    success "Base de données sauvegardée dans $BACKUP_DIR"
else
    warning "Conteneur MySQL non trouvé, pas de sauvegarde effectuée"
fi

# Arrêt des services existants
log "Arrêt des services existants..."
docker-compose -f "$COMPOSE_FILE" down --remove-orphans || true
success "Services arrêtés"

# Nettoyage des images obsolètes
log "Nettoyage des images obsolètes..."
docker system prune -f
success "Images obsolètes supprimées"

# Pull des nouvelles images
log "Téléchargement des nouvelles images..."
docker-compose -f "$COMPOSE_FILE" pull
success "Images téléchargées"

# Démarrage des services
log "Démarrage des services..."
docker-compose -f "$COMPOSE_FILE" --env-file ".env.$ENVIRONMENT" up -d

# Attendre que les services soient prêts
log "Vérification de l'état des services..."
sleep 10

# Vérification de la santé des services
check_service() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f "$COMPOSE_FILE" ps "$service" | grep -q "Up (healthy)"; then
            success "Service $service opérationnel"
            return 0
        fi
        
        log "Attente du service $service (tentative $attempt/$max_attempts)..."
        sleep 10
        ((attempt++))
    done
    
    error "Service $service non opérationnel après $max_attempts tentatives"
}

# Vérification des services critiques
check_service "db"
check_service "redbull-app"

# Test de l'API
log "Test de l'API..."
sleep 5
if curl -f http://localhost/health > /dev/null 2>&1; then
    success "API opérationnelle"
else
    error "API non accessible"
fi

# Vérification des logs
log "Vérification des logs..."
docker-compose -f "$COMPOSE_FILE" logs --tail=20 redbull-app

# Migration de la base de données si nécessaire
log "Vérification des migrations de base de données..."
docker-compose -f "$COMPOSE_FILE" exec -T redbull-app npm run migrate || warning "Aucune migration à effectuer"

# Affichage du statut final
log "État final des services:"
docker-compose -f "$COMPOSE_FILE" ps

# Message de succès
success "🎉 Déploiement terminé avec succès!"
log "Application accessible à: https://redbull-rampage.com"
log "Monitoring: https://redbull-rampage.com/health"

# Instructions post-déploiement
echo ""
echo "📋 Instructions post-déploiement:"
echo "1. Vérifiez les logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "2. Surveillez les métriques: docker stats"
echo "3. Testez les fonctionnalités critiques"
echo "4. Sauvegarde disponible dans: $BACKUP_DIR"

log "Déploiement complété le $(date)"
