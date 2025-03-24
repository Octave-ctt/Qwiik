
# Configuration de l'authentification Supabase

Ce projet utilise Supabase Auth pour gérer l'authentification des utilisateurs. Voici comment cela fonctionne:

## Structure de données

1. **auth.users**: Table intégrée de Supabase qui gère les comptes utilisateurs, mots de passe, etc.
2. **profiles**: Table personnalisée qui stocke les informations supplémentaires liées aux utilisateurs:
   - Informations personnelles (nom, etc.)
   - Adresses de livraison
   - Produits favoris
   - Autres préférences

## Intégration avec l'application

L'authentification est déjà intégrée à l'application via le contexte `AuthContext`. Lorsqu'un utilisateur s'inscrit ou se connecte:

1. Supabase Auth gère l'authentification
2. Un profil est automatiquement créé pour le nouvel utilisateur (via un trigger SQL)
3. L'application charge le profil utilisateur et le rend disponible via `useAuth()`

## Comment exécuter le script SQL

1. Dans votre projet Supabase, allez dans l'onglet "SQL Editor"
2. Copiez le contenu du fichier `src/sql/user-profiles.sql`
3. Exécutez le script SQL

## Sécurité des données

- La sécurité est assurée par les politiques RLS (Row Level Security) de Supabase
- Chaque utilisateur ne peut accéder qu'à ses propres données
- L'authentification et les jetons sont gérés par Supabase

## Interface de l'application

L'application dispose déjà de:
- Formulaires de connexion et d'inscription
- Page de profil utilisateur
- Gestion des adresses et favoris

Pour plus d'informations sur l'intégration de Supabase avec Lovable, consultez la [documentation officielle](https://docs.lovable.dev/integrations/supabase/).

