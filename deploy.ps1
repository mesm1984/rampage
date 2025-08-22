# Script de déploiement PowerShell pour Red Bull Rampage 2024
# Ce script automatise le déploiement en production sur Windows

param(
    [string]$Environment = "production",
    [string]$ImageTag = "latest"
)

# Configuration
$ComposeFile = "docker-compose.$Environment.yml"
$EnvFile = ".env.$Environment"

# Fonction pour afficher les messages avec couleurs
function Write-Log {
    param([string]$Message, [string]$Color = "Blue")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
    exit 1
}

# Démarrage du script
Write-Log "🚀 Démarrage du déploiement Red Bull Rampage 2024..." "Cyan"

# Vérifications préalables
Write-Log "Vérification des prérequis..."

# Vérifier Docker
try {
    docker --version | Out-Null
    Write-Success "Docker installé"
} catch {
    Write-Error "Docker n'est pas installé ou non accessible"
}

# Vérifier Docker Compose
try {
    docker-compose --version | Out-Null
    Write-Success "Docker Compose installé"
} catch {
    Write-Error "Docker Compose n'est pas installé ou non accessible"
}

# Vérifier les fichiers de configuration
if (-not (Test-Path $ComposeFile)) {
    Write-Error "Fichier $ComposeFile introuvable"
}

if (-not (Test-Path $EnvFile)) {
    Write-Error "Fichier $EnvFile introuvable"
}

Write-Success "Prérequis validés"

# Sauvegarde des données
Write-Log "Sauvegarde de la base de données..."
$BackupDir = ".\backups\$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

# Vérifier si le conteneur MySQL existe et est en cours d'exécution
$MySQLContainer = docker ps --filter "name=redbull-mysql" --format "table {{.Names}}" | Select-String "redbull-mysql"
if ($MySQLContainer) {
    try {
        $BackupFile = Join-Path $BackupDir "mysql_backup.sql"
        Write-Log "Création de la sauvegarde MySQL..."
        # Note: Vous devrez ajuster cette commande selon votre configuration
        docker exec redbull-mysql mysqldump -u root --all-databases > $BackupFile
        Write-Success "Base de données sauvegardée dans $BackupDir"
    } catch {
        Write-Warning "Erreur lors de la sauvegarde MySQL: $($_.Exception.Message)"
    }
} else {
    Write-Warning "Conteneur MySQL non trouvé, pas de sauvegarde effectuée"
}

# Arrêt des services existants
Write-Log "Arrêt des services existants..."
try {
    docker-compose -f $ComposeFile down --remove-orphans
    Write-Success "Services arrêtés"
} catch {
    Write-Warning "Erreur lors de l'arrêt des services: $($_.Exception.Message)"
}

# Nettoyage des images obsolètes
Write-Log "Nettoyage des images obsolètes..."
try {
    docker system prune -f
    Write-Success "Images obsolètes supprimées"
} catch {
    Write-Warning "Erreur lors du nettoyage: $($_.Exception.Message)"
}

# Pull des nouvelles images
Write-Log "Téléchargement des nouvelles images..."
try {
    docker-compose -f $ComposeFile pull
    Write-Success "Images téléchargées"
} catch {
    Write-Error "Erreur lors du téléchargement des images"
}

# Démarrage des services
Write-Log "Démarrage des services..."
try {
    docker-compose -f $ComposeFile --env-file $EnvFile up -d
    Write-Success "Services démarrés"
} catch {
    Write-Error "Erreur lors du démarrage des services"
}

# Attendre que les services soient prêts
Write-Log "Vérification de l'état des services..."
Start-Sleep -Seconds 10

# Fonction pour vérifier la santé d'un service
function Test-ServiceHealth {
    param([string]$ServiceName)
    
    $maxAttempts = 30
    $attempt = 1
    
    while ($attempt -le $maxAttempts) {
        $serviceStatus = docker-compose -f $ComposeFile ps $ServiceName
        if ($serviceStatus -match "Up.*healthy") {
            Write-Success "Service $ServiceName opérationnel"
            return $true
        }
        
        Write-Log "Attente du service $ServiceName (tentative $attempt/$maxAttempts)..."
        Start-Sleep -Seconds 10
        $attempt++
    }
    
    Write-Error "Service $ServiceName non opérationnel après $maxAttempts tentatives"
    return $false
}

# Vérification des services critiques
Test-ServiceHealth "db"
Test-ServiceHealth "redbull-app"

# Test de l'API
Write-Log "Test de l'API..."
Start-Sleep -Seconds 5
try {
    $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Success "API opérationnelle"
    } else {
        Write-Warning "API répond mais avec le statut: $($response.StatusCode)"
    }
} catch {
    Write-Error "API non accessible: $($_.Exception.Message)"
}

# Vérification des logs
Write-Log "Vérification des logs..."
docker-compose -f $ComposeFile logs --tail=20 redbull-app

# Migration de la base de données si nécessaire
Write-Log "Vérification des migrations de base de données..."
try {
    docker-compose -f $ComposeFile exec -T redbull-app npm run migrate
} catch {
    Write-Warning "Aucune migration à effectuer ou erreur de migration"
}

# Affichage du statut final
Write-Log "État final des services:"
docker-compose -f $ComposeFile ps

# Message de succès
Write-Success "🎉 Déploiement terminé avec succès!"
Write-Log "Application accessible à: https://redbull-rampage.com" "Cyan"
Write-Log "Monitoring: https://redbull-rampage.com/health" "Cyan"

# Instructions post-déploiement
Write-Host ""
Write-Host "📋 Instructions post-déploiement:" -ForegroundColor Cyan
Write-Host "1. Vérifiez les logs: docker-compose -f $ComposeFile logs -f"
Write-Host "2. Surveillez les métriques: docker stats"
Write-Host "3. Testez les fonctionnalités critiques"
Write-Host "4. Sauvegarde disponible dans: $BackupDir"

Write-Log "Déploiement complété le $(Get-Date)" "Green"
