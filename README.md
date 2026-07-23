# Gëstu Job AI

Plateforme d'automatisation et d'optimisation de la recherche d'emploi et de stage.

> **Gëstu** (*chercher / explorer* en wolof) + **Job**

---

## Présentation du Projet

**Gëstu Job AI** est une solution conçue pour accompagner les étudiants, jeunes diplômés et professionnels dans la gestion et l'optimisation de leur recherche d'opportunités de carrière.

La plateforme exploite l'intelligence artificielle pour automatiser l'ensemble des tâches répétitives du processus de candidature :
* **Collecte et agrégation** d'offres d'emploi et de stage depuis diverses sources.
* **Analyse sémantique et extraction automatique** des données contenues dans les CV (formats PDF et DOCX).
* **Recommandation personnalisée** d'opportunités d'emploi adaptées au profil de l'utilisateur.
* **Génération assistée de documents** (CV personnalisés et lettres de motivation).
* **Suivi centralisé et dynamique** des candidatures.

---

## Vision du Projet

Face à la multiplicité des canaux de recrutement et à la répétitivité des candidatures, **Gëstu Job AI** vise à centraliser et automatiser les démarches grâce à un assistant virtuel dédié :

> *"Identifier les opportunités adéquates au moment opportun et préparer les candidatures adaptées."*

---

## Fonctionnalités Principales

### 1. Gestion des Utilisateurs et des Profils
* Authentification sécurisée (JSON Web Tokens).
* Gestion du profil professionnel (expériences, formations, compétences).
* Définition des critères et préférences de recherche (secteurs, types de contrat, localisation, télétravail).

### 2. Analyse Intelligente des CV
* Importation des CV aux formats PDF et DOCX.
* Parsing et extraction automatique des informations (compétences, parcours, mots-clés).
* Traitement du Langage Naturel (NLP) pour évaluer la pertinence et catégoriser les compétences.
* Vectorisation du profil professionnel pour la recherche sémantique.

### 3. Recherche et Agrégation d'Offres
* Collecte d'offres depuis plusieurs plateformes et sources externes.
* Filtrage avancé multi-critères :
  * Domaine d'activité et poste.
  * Localisation et mode de travail (présentiel, hybride, distanciel).
  * Type de contrat (CDI, CDD, Alternance, Stage).
  * Niveau d'expérience exigé.

### 4. Algorithme de Matching et Évaluation
* Calcul d'un score de compatibilité entre le profil du candidat et la fiche de poste.
* Bilan détaillé des compétences :
  * Compétences correspondantes.
  * Écarts identifiés (compétences manquantes).
  * Recommandations d'amélioration du profil ou de la candidature.

### 5. Assistant de Candidature Génératif
* Génération automatique de lettres de motivation ciblées et personnalisées.
* Adaptation du CV en fonction des exigences spécifiques de chaque offre.
* Suggestions de réponses pour la préparation aux entretiens de recrutement.

### 6. Pipeline de Suivi des Candidatures
Suivi du statut de chaque candidature au sein d'un workflow structuré :

```mermaid
graph LR
    A[À préparer] --> B[Préparée]
    B --> C[Envoyée]
    C --> D[Entretien]
    D --> E{Décision}
    E -->|Acceptée| F[Acceptée / Recruté]
    E -->|Refusée| G[Refusée / Clôturée]
```

### 7. Notifications et Alertes
* Notifications sur la parution de nouvelles offres à fort taux de compatibilité.
* Rappels programmés pour le suivi des candidatures et les dates d'entretien.

---

## Architecture Technique

Le système repose sur une architecture moderne découplée. Le backend est structuré selon les principes de la **Clean Architecture** et du **Domain-Driven Design (DDD)** pour assurer l'indépendance de la logique métier, la testabilité et la scalabilité.

### Architecture Globale

```mermaid
graph TD
    User[Utilisateur / Client Web] --> FE[Frontend: React / TypeScript]
    FE -->|REST API| Delivery[Couche Présentation: FastAPI Routes / Schemas]
    
    subgraph Backend_DDD [Backend - Clean Architecture & DDD]
        Delivery --> UseCases[Couche Application: Cas d'Utilisation / DTOs / Ports]
        UseCases --> Domain[Couche Domaine: Entités / Value Objects / Aggregates]
        Infra[Couche Infrastructure: Persistence DB / AI Clients / Redis] -.->|Implémente Repositories & Services| UseCases
        Infra -.->|Implémente Interfaces| Domain
    end

    Infra --> DB[(PostgreSQL)]
    Infra --> Cache[(Redis)]
    Infra --> VectorDB[(Qdrant Vector DB)]
    Infra --> ObjectStorage[(MinIO Object Storage)]
    Infra --> LLM[Moteur LLM / Ollama]
```

### Couches de la Clean Architecture (Backend)

1. **Couche Domaine (`domain/`)** : Contient le cœur de la logique métier pure, indépendante de tout framework. Organisée par *Bounded Contexts* (Candidat, Offres/Matching, Candidatures).
   * **Entités & Value Objects** : Modèles métiers riches et objets de valeur immutables.
   * **Agrégats & Services Domaine** : Règles métier complexes inter-entités.
   * **Interfaces Repositories** : Contrats d'accès aux données.
2. **Couche Application (`application/`)** : Orchestre les cas d'utilisation de l'application.
   * **Use Cases** : Réalisation des scénarios métiers (ex: `AnalyzeCVUseCase`, `MatchJobUseCase`).
   * **DTOs & Ports** : Transfert de données et interfaces de services externes.
3. **Couche Infrastructure (`infrastructure/`)** : Détails techniques et implémentations d'interfaces.
   * **Persistence** : Modèles SQLAlchemy et implémentations concrètes des Repositories.
   * **Services Externes** : Connecteurs pour Ollama/OpenAI, Qdrant, MinIO et Redis.
4. **Couche Présentation (`presentation/`)** : Interface de communication externe.
   * **Contrôleurs FastAPI** : Exposition des endpoints REST.
   * **Schémas Pydantic** : Validation des requêtes et réponses HTTP.

---

## Stack Technologique

### Frontend
| Composant | Technologie | Description |
| :--- | :--- | :--- |
| **Framework UI** | React 18 | Bibliothèque d'interface utilisateur |
| **Langage** | TypeScript | Typage statique et sécurité du code |
| **Tooling** | Vite | Outil d'assemblage et serveur de développement |
| **Style** | Tailwind CSS | Framework CSS utilitaire |
| **Composants UI** | shadcn/ui | Composants réutilisables et accessibles |
| **Routage** | React Router | Gestion de la navigation |
| **État Global** | Zustand | Gestion de l'état applicatif |
| **Requêtes API** | TanStack Query | Mises en cache et synchronisation des données |

### Backend (Clean Architecture & DDD)
| Composant | Technologie | Description |
| :--- | :--- | :--- |
| **Framework Web** | FastAPI | Framework API Python asynchrone pour la couche Présentation |
| **Langage** | Python 3.11+ | Langage principal de développement |
| **ORM & Persistence** | SQLAlchemy 2.0 | Mapping objet-relationnel (Couche Infrastructure) |
| **Migrations** | Alembic | Gestion des évolutions du schéma de base de données |
| **Validation API** | Pydantic v2 | Validation et sérialisation des schémas DTO |
| **Sécurité** | PyJWT / Passlib | Authentification par jetons JWT et hachage |

### Intelligence Artificielle et NLP
| Composant | Technologie | Description |
| :--- | :--- | :--- |
| **Moteur LLM** | Ollama / OpenAI API | Modèles de langage pour la génération et l'analyse |
| **NLP** | Pipelines Spacy / NLTK | Extraction d'entités et analyse syntaxique |
| **Embeddings** | Sentence Transformers | Vectorisation du texte pour le matching sémantique |
| **Base Vectorielle** | Qdrant | Recherche de similitude vectorielle |
| **Orchestration** | LangChain | Framework de gestion des chaînes et agents IA |

### Données et Infrastructure
| Composant | Technologie | Description |
| :--- | :--- | :--- |
| **Base Relationnelle** | PostgreSQL | Stockage des données métiers |
| **Cache & Queue** | Redis | Gestion du cache et des files de traitements asynchrones |
| **Stockage Fichiers** | MinIO | Stockage des documents et fichiers CV |
| **Conteneurisation** | Docker / Docker Compose | Déploiement et orchestration |
| **Serveur Web** | Nginx | Reverse proxy |
| **CI/CD** | GitHub Actions | Automatisation de l'intégration continue |

---

## Structure du Projet

```
geestu-job/
├── frontend/                     # Application React
│   ├── public/                   # Fichiers statiques
│   └── src/
│       ├── components/           # Composants d'interface
│       ├── pages/                # Vues principales
│       ├── services/             # Intégration et requêtes API
│       └── store/                # Gestion de l'état global
├── backend/                      # Architecture Clean Architecture & DDD
│   ├── app/
│   │   ├── domain/               # 1. Couche Domaine (DDD)
│   │   │   ├── candidate/        # Bounded Context : Candidat & Profil
│   │   │   │   ├── entities/     # Entités Métier et Value Objects
│   │   │   │   └── repositories/ # Interfaces Repositories
│   │   │   ├── job/              # Bounded Context : Offres & Matching
│   │   │   │   ├── entities/
│   │   │   │   └── repositories/
│   │   │   └── application/      # Bounded Context : Suivi Candidatures
│   │   │       └── entities/
│   │   ├── application/          # 2. Couche Application (Clean Arch)
│   │   │   ├── use_cases/        # Cas d'utilisation métiers
│   │   │   ├── dtos/             # Data Transfer Objects
│   │   │   └── interfaces/       # Ports & interfaces de services
│   │   ├── infrastructure/       # 3. Couche Infrastructure
│   │   │   ├── persistence/      # SQLAlchemy Modèles & Repositories concrets
│   │   │   ├── external_services/# Connecteurs IA (Ollama, Qdrant, MinIO)
│   │   │   └── config/           # Paramètres de configuration
│   │   └── presentation/         # 4. Couche Présentation (Interfaces)
│   │       ├── api/              # Endpoints FastAPI (Contrôleurs)
│   │       ├── schemas/          # Schémas Pydantic d'entrée/sortie
│   │       └── dependencies/     # Injection de dépendances FastAPI
│   └── tests/                    # Suite de tests automatisés (Unitaires, Domaine, Integration)
├── infrastructure/               # Configurations Docker et Nginx
│   ├── docker/                   # Dockerfiles
│   └── nginx/                    # Fichiers de configuration proxy
├── docs/                         # Documentation technique
├── docker-compose.yml            # Configuration Docker Compose
├── .env.example                  # Exemple de variables d'environnement
├── CONTRIBUTING.md               # Directives de contribution
└── README.md                     # Fichier principal d'information
```

---

## Installation et Déploiement Local

### Pré-requis
* Git
* Docker et Docker Compose
* Node.js (v20 ou supérieur)
* Python (v3.11 ou supérieur)

### 1. Clonage du dépôt
```bash
git clone https://github.com/username/geestu-job.git
cd geestu-job
```

### 2. Variables d'environnement
Créer le fichier de configuration `.env` à partir du modèle :
```bash
cp .env.example .env
```

Exemple de variables d'environnement requises :
```env
DATABASE_URL=postgresql://user:password@postgres:5432/geestu_job
JWT_SECRET=votre_cle_secrete_jwt
REDIS_URL=redis://redis:6379
AI_PROVIDER=ollama
```

### 3. Exécution avec Docker Compose
Lancer les conteneurs de l'application en mode détaché :
```bash
docker compose build
docker compose up -d
```

Accès aux services :
* **Frontend** : `http://localhost:5173`
* **API Backend** : `http://localhost:8000`
* **Documentation OpenAPI** : `http://localhost:8000/docs`

---

## Tests

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

---

## Conventions et Workflow Git

Le projet applique le modèle de gestion de branches **Git Flow** et la norme **Conventional Commits**.

### Nommage des branches
* `main` : Branche de production.
* `develop` : Branche de développement principal.
* `feature/<nom>` : Développement d'une nouvelle fonctionnalité.
* `bugfix/<nom>` : Correction d'anomalie.

### Format des commits
* `feat:` Nouvelle fonctionnalité.
* `fix:` Correction d'un dysfonctionnement.
* `docs:` Modification de la documentation.
* `refactor:` Modification du code sans changement fonctionnel.
* `test:` Ajout ou mise à jour de tests.
* `chore:` Maintenance de configuration ou de dépendances.

---

## Roadmap

### Phase 1 - Initialisation
* [x] Spécifications fonctionnelles et techniques.
* [x] Définition de l'architecture globale.
* [x] Structure initiale du projet et CI/CD.

### Phase 2 - MVP
* [ ] Authentification et gestion de profil.
* [ ] Import et analyse basique de CV.
* [ ] Moteur de recherche d'offres.
* [ ] Calcul du score de matching sémantique.
* [ ] Tableau de suivi des candidatures.

### Phase 3 - Fonctionnalités IA Avancées
* [ ] Agent autonome de recherche d'offres.
* [ ] Assistant de préparation aux entretiens.
* [ ] Analyse des tendances du marché du travail.
* [ ] Extension Web pour l'import d'offres.

### Phase 4 - Applications Mobiles
* [ ] Client mobile Android.
* [ ] Client mobile iOS.

---

## Sécurité et Performance

### Exigences de Sécurité
* Authentification basée sur les jetons JWT.
* Chiffrement des mots de passe (bcrypt).
* Contrôle d'accès et validation systématique des entrées utilisateur.
* Isolation des conteneurs applicatifs et règles CORS strictes.

### Objectifs de Performance (KPI)
* **Temps de réponse API** : inférieur à 2 secondes.
* **Taux de disponibilité** : supérieur ou égal à 99,9%.
* **Précision du matching** : pertinence des résultats supérieure à 80%.

---

## Contribution

Les contributions au projet sont encadrées par la procédure suivante :
1. Effectuer un Fork du dépôt principal.
2. Créer une branche dédiée (`git checkout -b feature/nouvelle-fonctionnalite`).
3. Appliquer les modifications et commiter selon la norme.
4. Soumettre la branche via une Pull Request vers la branche `develop`.

