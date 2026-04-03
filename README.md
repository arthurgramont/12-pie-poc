# Voyag'R - Proof of Concept (POC)

Bienvenue sur le dépôt officiel du **Proof of Concept (POC) de Voyag'R**, l'application innovante de planification de voyages intelligente. 

L'objectif principal de ce repository (réalisé dans le cadre de notre projet) est de **démontrer la faisabilité technique** et la **pertinence des fonctionnalités clées** de l'application avant son développement final.

---

## Le Concept
Ce POC met en avant un flow applicatif complet qui réinvente la planification de voyages en la rendant ludique, intelligente et hautement personnalisée :
1. **Sélection de destination** : Renseignez vos envies de bases.
2. **Importation Vidéos (TikTok / Instagram)** : Collez des URL de vidéos qui vous ont inspirés, l'outil extrait le contexte (notamment via les hashtags et titres) pour calibrer vos préférences.
3. **Exploration ludique (Swipe)** : Une interface type "Vue par Swipe" pour "Liker" ou "Passer" des Hôtels, Restaurants et Activités. Tout est généré et mélangé sous forme d'algorithme *Round-Robin randomisé*.
4. **Génération d'Itinéraire** : En fonction des suggestions que vous avez aimées, l'application établit vos résultats et un itinéraire final idéal.

---

## Déploiements & Environnements (Vercel)

Afin de pouvoir tester ce POC le plus facilement possible sur n'importe quel support, l'infrastructure complète est déployée sur **Vercel**.

### 1. Environnement Standard (Branche `main`)
Cet environnement reflète la version principale du POC. Le frontend et le backend sont séparés en deux micro-services afin de valider les communications d'API sécurisées (CORS).

* **Frontend (Vue Utilisateur)** : [https://12-pie-poc-front.vercel.app](https://12-pie-poc-front.vercel.app)
* **Backend (API / Scraping réseaux)** : [https://12-pie-poc-back.vercel.app](https://12-pie-poc-back.vercel.app)

### 2. Environnement Mobile & Présentation (Branche `Presentation`)
Certaines démonstrations (évaluations, pitch) requièrent un affichage optimalisé sur écran de présentation et format smartphone. Nous avons adapté un déploiement spécifique synchronisé avec cette branche.

* **Version "Pitch / Slideshow"** : [https://12-pie-poc.vercel.app](https://12-pie-poc.vercel.app)

---

## Stack Technique

**Frontend (`/client`)**
* **ReactJS / Vite** : Pour l'interface rapide et réactive.
* **Vanilla CSS** : Design optimisé, animations fluides (glassmorphism, micro-interactions).
* **react-tinder-card** : Utilisé pour les mécaniques complexes de swipe tactile (fluidité et feeling d'immersion).
* **Lucide React** : Librairie d'icônes.

**Backend (`/server`)**
* **Node.js & Express.js** : Pour notre API de récupération des données.
* **Mécanique d'oEmbed / Web Scraping fallback** : Intégrations logiques pour bypasser efficacement les APIs externes des réseaux sociaux et extraire l'essence (titres, hashtags) des vidéos voyages sans clé API formelle.
* **Architecture Serverless Ready** : Backend converti avec le système de routing natif Vercel via un fichier `vercel.json` (`@vercel/node`).

---

## Installation & Démarrage en local

Si vous souhaitez faire tourner le POC sur votre propre machine. Assurez vous d'avoir [Node.js](https://nodejs.org/) installé.

### Démarrage de l'API (Backend)
1. Ouvrez un terminal.
2. Allez dans le dossier backend : `cd server`
3. Installez les packages : `npm install`
4. Ajoutez votre environnement : Mettez en place votre fichier `.env` *(Voir `.env.example`, `CLIENT_URL=http://localhost:5173` et port par défaut `3001`)*.
5. Démarrez l'API : `node server.js`

### Démarrage de l'Interface (Frontend)
1. Ouvrez un second terminal.
2. Allez dans le dossier du client : `cd client`
3. Installez les packages : `npm install --legacy-peer-deps` *(nouveau requis dû à la version de React 19 et react-tinder-card)*
4. Configurez-le pointeur : Ajoutez un fichier `.env` *(Voir `.env.example`, `VITE_API_URL=http://localhost:3001`)*
5. Démarrez Vite : `npm run dev`

L'application sera accessible de base sur [http://localhost:5173](http://localhost:5173).

---
*Ce POC a été développé dans un cadre académique / de Proof of Concept.*
