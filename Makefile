# ============================================================
# GeestuJob — Makefile
# ============================================================
# Usage : make <commande>
# ============================================================

.PHONY: help up down restart logs build \
        db db-stop db-logs db-shell \
        api api-logs api-shell \
        front front-logs \
        migrate migrate-head migrate-revision migrate-downgrade \
        install install-back install-front \
        dev dev-back dev-front \
        clean

# ---- Couleurs ----
GREEN  := \033[0;32m
YELLOW := \033[0;33m
CYAN   := \033[0;36m
RESET  := \033[0m

# ---- Variables ----
DC := docker compose
BACKEND_VENV := backend/venv/bin
PYTHON := $(BACKEND_VENV)/python
PIP := $(BACKEND_VENV)/pip
ALEMBIC := $(BACKEND_VENV)/alembic
UVICORN := $(BACKEND_VENV)/uvicorn

# ============================================================
# Aide
# ============================================================

help: ## Afficher l'aide
	@echo ""
	@echo "$(CYAN)GeestuJob — Commandes disponibles$(RESET)"
	@echo "$(CYAN)══════════════════════════════════$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-22s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# ============================================================
# Docker Compose — Tous les services
# ============================================================

up: ## Démarrer tous les services Docker
	$(DC) up -d
	@echo "$(GREEN)Tous les services sont demarres$(RESET)"

down: ## Arrêter tous les services Docker
	$(DC) down
	@echo "$(YELLOW)Tous les services sont arretes$(RESET)"

restart: ## Redémarrer tous les services
	$(DC) restart

logs: ## Voir les logs de tous les services
	$(DC) logs -f

build: ## Rebuild les images Docker
	$(DC) build --no-cache

# ============================================================
# Base de données (PostgreSQL)
# ============================================================

db: ## Démarrer PostgreSQL seul
	$(DC) up -d db
	@echo "$(GREEN)PostgreSQL demarre sur le port 5432$(RESET)"

db-stop: ## Arrêter PostgreSQL
	$(DC) stop db

db-logs: ## Voir les logs PostgreSQL
	$(DC) logs -f db

db-shell: ## Ouvrir un shell psql
	$(DC) exec db psql -U postgres -d geestu_job

# ============================================================
# Backend (FastAPI)
# ============================================================

api: ## Démarrer le service API (Docker)
	$(DC) up -d api
	@echo "$(GREEN)API demarree sur http://localhost:8000$(RESET)"
	@echo "$(CYAN)Docs : http://localhost:8000/docs$(RESET)"

api-logs: ## Voir les logs de l'API
	$(DC) logs -f api

api-shell: ## Ouvrir un shell dans le container API
	$(DC) exec api bash

# ============================================================
# Frontend (Vite)
# ============================================================

front: ## Démarrer le frontend (Docker)
	$(DC) up -d frontend
	@echo "$(GREEN)Frontend demarre sur http://localhost:5173$(RESET)"

front-logs: ## Voir les logs du frontend
	$(DC) logs -f frontend

# ============================================================
# Migrations Alembic (local avec venv)
# ============================================================

migrate: ## Appliquer toutes les migrations
	cd backend && ../$(ALEMBIC) upgrade head
	@echo "$(GREEN)Migrations appliquees$(RESET)"

migrate-head: migrate ## Alias de migrate

migrate-revision: ## Créer une nouvelle migration (usage: make migrate-revision m="description")
	cd backend && ../$(ALEMBIC) revision --autogenerate -m "$(m)"
	@echo "$(GREEN)Migration creee$(RESET)"

migrate-downgrade: ## Annuler la dernière migration
	cd backend && ../$(ALEMBIC) downgrade -1
	@echo "$(YELLOW)Migration annulee$(RESET)"

# ============================================================
# Installation locale (sans Docker)
# ============================================================

install: install-back install-front ## Installer toutes les dépendances

install-back: ## Installer les dépendances backend (venv)
	cd backend && python3 -m venv venv
	$(PIP) install -r backend/requirements.txt
	@echo "$(GREEN)Dependances backend installees$(RESET)"

install-front: ## Installer les dépendances frontend
	cd frontend && npm install
	@echo "$(GREEN)Dependances frontend installees$(RESET)"

# ============================================================
# Développement local (sans Docker)
# ============================================================

dev: ## Démarrer backend + frontend en local (nécessite 2 terminaux)
	@echo "$(CYAN)Utilisez deux terminaux :$(RESET)"
	@echo "  Terminal 1 : $(GREEN)make dev-back$(RESET)"
	@echo "  Terminal 2 : $(GREEN)make dev-front$(RESET)"

dev-back: ## Lancer le backend en local (uvicorn + reload)
	cd backend && ../$(UVICORN) app.main:app --reload --port 8000
	
dev-front: ## Lancer le frontend en local (vite)
	cd frontend && npm run dev

# ============================================================
# Nettoyage
# ============================================================

clean: ## Nettoyer les fichiers temporaires
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	@echo "$(GREEN)Nettoyage termine$(RESET)"
