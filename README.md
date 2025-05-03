# 🐍 Snake Sport

Une version moderne et sportive du célèbre jeu Snake, développée avec Next.js, React et MongoDB.

## 🌟 Fonctionnalités

- **Gameplay moderne** du jeu Snake avec des graphiques canvas
- **Éléments sportifs** : barre d'endurance et chaussures de sport pour booster la vitesse
- **Mode Sprint** : appuyez sur la barre d'espace pour accélérer (attention à l'endurance!)
- **Classement des scores** stocké dans MongoDB
- **Interface utilisateur réactive** construite avec TailwindCSS et DaisyUI
- **Application entièrement responsive** pour mobile et desktop

## 🚀 Technologies utilisées

- **Frontend** : React 19, Next.js 15 (App Router)
- **Styling** : TailwindCSS v4, DaisyUI v5
- **Backend** : API Routes Next.js
- **Base de données** : MongoDB avec Mongoose
- **Déploiement** : Optimisé pour Vercel

## 🛠️ Installation locale

1. Clonez ce dépôt
```bash
git clone https://github.com/votre-username/snake-sport.git
cd snake-sport
```

2. Installez les dépendances
```bash
npm install
```

3. Créez un fichier `.env.local` avec votre URI MongoDB
```
MONGODB_URI=votre_uri_mongodb
```

4. Lancez le serveur de développement
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 🌐 Déploiement sur Vercel

Cette application est optimisée pour un déploiement sur Vercel :

1. Créez un compte sur [Vercel](https://vercel.com) si ce n'est pas déjà fait
2. Connectez votre dépôt GitHub à Vercel
3. Configurez la variable d'environnement `MONGODB_URI` dans les paramètres du projet
4. Déployez !

## 🎮 Comment jouer

- Utilisez les **flèches directionnelles** pour guider le serpent
- Appuyez sur **espace** pour sprinter (consomme de l'endurance)
- Ramassez des **bananes** 🍌 pour marquer des points
- Collectez des **chaussures de sport** 👟 pour un bonus temporaire de vitesse
- Votre **endurance** se régénère lorsque vous ne sprintez pas

## 📄 License

MIT
