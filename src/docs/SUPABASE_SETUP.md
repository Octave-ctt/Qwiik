
# Configuration de Supabase pour Qwiik

Suivez ces étapes pour configurer correctement Supabase avec votre projet:

## 1. Créer un compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com) et créez un compte ou connectez-vous
2. Créez un nouveau projet

## 2. Configuration de la base de données

1. Dans votre projet Supabase, allez dans l'onglet "SQL Editor"
2. Copiez et collez le contenu du fichier `src/sql/supabase-schema.sql`
3. Exécutez le script SQL pour créer les tables et les politiques de sécurité

## 3. Configuration de l'authentification

1. Dans votre projet Supabase, allez dans "Authentication" > "Providers"
2. Assurez-vous que "Email" est activé
3. Vous pouvez configurer les autres paramètres selon vos besoins (confirmation d'email, etc.)

## 4. Récupération des clés API

1. Dans votre projet Supabase, allez dans "Settings" > "API"
2. Copiez l'URL du projet et la clé anon/public
3. Créez un fichier `.env.local` à la racine de votre projet avec ces valeurs:

```
VITE_SUPABASE_URL=votre-url-projet
VITE_SUPABASE_ANON_KEY=votre-clé-anon-public
VITE_STRIPE_PUBLIC_KEY=votre-clé-publique-stripe
```

## 5. Stripe Checkout

1. Créez un compte sur [https://stripe.com](https://stripe.com) si ce n'est pas déjà fait
2. Dans les paramètres de votre compte Stripe, récupérez votre clé publique
3. Ajoutez-la dans votre fichier `.env.local`

## 6. Démarrage du projet

Une fois que vous avez configuré Supabase et Stripe, vous pouvez démarrer votre projet:

```
npm run dev
```

Pour tester Stripe en mode développement, utilisez cette carte de test:
- Numéro: 4242 4242 4242 4242
- Date d'expiration: n'importe quelle date future
- CVC: n'importe quels 3 chiffres
