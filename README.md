# ArticGuessr

Un jeu de géolocalisation inspiré de GeoGuessr, développé avec Next.js 15 et React 19.

## 🌟 Fonctionnalités

- Interface moderne avec support du mode sombre/clair
- Navigation intuitive entre les différentes sections
- Design responsive optimisé pour tous les appareils
- Architecture basée sur Next.js App Router

## 🚀 Pages disponibles

- **Accueil** - Page d'accueil principale
- **Guessr** - Jeu de géolocalisation principal
- **Explorer** - Exploration des différentes cartes et lieux
- **À propos** - Informations sur le projet

## 🛠️ Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS 4** - Framework CSS utilitaire
- **Radix UI** - Composants UI accessibles
- **Lucide React** - Icônes modernes
- **next-themes** - Gestion des thèmes sombre/clair

## 📦 Installation

```bash
# Cloner le projet
git clone https://github.com/Cece94/articguessr.git
cd articguessr

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## 🔧 Scripts disponibles

```bash
npm run dev        # Lancer le serveur de développement avec Turbopack
npm run build      # Construire l'application pour la production
npm run start      # Lancer l'application en mode production
npm run lint       # Vérifier le code avec ESLint
```

## 📱 Structure du projet

```
articguessr/
├── app/                 # Pages et layouts (App Router)
│   ├── about/          # Page À propos
│   ├── explore/        # Page Explorer
│   ├── guessr/         # Page de jeu principale
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Page d'accueil
├── components/         # Composants réutilisables
│   ├── ui/            # Composants UI de base
│   ├── header.tsx     # En-tête de navigation
│   ├── footer.tsx     # Pied de page
│   └── theme-provider.tsx # Fournisseur de thème
├── lib/               # Utilitaires et helpers
└── public/            # Assets statiques
```

## 🌙 Thèmes

L'application supporte les modes sombre et clair avec une transition fluide. Le thème est persisté automatiquement entre les sessions.

## 🚀 Déploiement

Le moyen le plus simple de déployer votre application Next.js est d'utiliser la [plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consultez la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.

## 📄 Licence

Ce projet est sous licence MIT.
