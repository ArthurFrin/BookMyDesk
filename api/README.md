# API Book My Desk

## Description
API backend pour l'application "Book My Desk", permettant la gestion des réservations de bureaux, des utilisateurs et des disponibilités.

## Technologies utilisées
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/) - Framework web rapide et léger
- [Prisma](https://www.prisma.io/) - ORM moderne pour l'accès à la base de données
- [JWT](https://jwt.io/) - JSON Web Tokens pour l'authentification
- [Jest](https://jestjs.io/) - Framework de test

## Configuration initiale

### Installation des dépendances
```bash
npm install
```

### Configuration de l'environnement
Copiez le fichier d'exemple d'environnement et configurez vos variables :
```bash
cp .env.example .env
```

Modifiez le fichier `.env` en ajustant les variables selon votre environnement.

### Initialisation de la base de données
Générez les fichiers client Prisma basés sur le schéma :
```bash
npm run prisma:generate
```

Créez la base de données et appliquez les migrations :
```bash
npm run prisma:push
```

Remplissez la base de données avec des données initiales :
```bash
npm run prisma:seed
```

## Développement

### Lancement des services Docker (Base de données, Adminer, MailHog)
Pour faciliter le développement, vous pouvez lancer la base de données PostgreSQL, Adminer (visualiseur de base de données) et MailHog (serveur SMTP factice) avec Docker Compose :

```bash
docker compose up
```

Les services seront accessibles aux adresses suivantes :
- **Base de données PostgreSQL** : accessible via le port défini dans votre fichier `.env`
- **Adminer** : http://localhost:8080 (permet de visualiser et gérer votre base de données)
- **MailHog** : http://localhost:8025 (interface web pour voir les emails envoyés pendant le développement)

### Lancement du serveur en mode développement
```bash
npm run dev
```

### Exécution des tests
```bash
npm test
```

## Production

### Construction de l'application
```bash
npm run build
```

### Lancement du serveur en mode production
```bash
npm start
```

## Documentation de l'API

Toutes les routes de l'API sont documentées et peuvent être testées à l'aide de [Bruno](https://www.usebruno.com/), un client API moderne et open-source.

### Installation de Bruno
Téléchargez Bruno depuis [le site officiel](https://www.usebruno.com/downloads)

### Utilisation des collections Bruno
1. Ouvrez Bruno
2. Importez la collection située dans le dossier [api-client](/api-client) du projet
3. N'oubliez pas de sélectionner l'environnement approprié dans le menu déroulant en haut de l'interface
4. Vous pouvez maintenant explorer et tester toutes les routes disponibles :
   - admin : gestion des utilisateurs
   - auth : authentification et gestion des profils
   - availability : vérification des disponibilités
   - desks : réservation et annulation de bureaux

### Structure des dossiers d'API client
```
api-client/
├── admin/              # Routes administration
├── auth/               # Routes authentification
├── availability/       # Routes disponibilités
├── desks/              # Routes bureaux
└── environments/       # Environnements pour Bruno
```

## Remarques
- Veillez à ce que votre base de données soit accessible selon les paramètres définis dans votre fichier `.env`
- Pour les développeurs, il est recommandé de générer le client Prisma après chaque modification du schéma

## login par defaut:

{
  "email": "alice.dupond@domain.fr",
  "password": "password"
}