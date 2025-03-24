
# Intégration de Supabase avec Lovable

Ce projet est configuré pour fonctionner avec l'intégration native de Supabase dans Lovable.

## Comment activer l'intégration Supabase

1. Assurez-vous que vous êtes dans l'éditeur Lovable
2. Cliquez sur le menu Supabase dans la barre supérieure
3. Suivez les instructions pour connecter votre projet Supabase existant ou créez-en un nouveau
4. Une fois connecté, Lovable pourra accéder à vos tables, règles RLS, secrets, fonctions, etc.

## Structure de la base de données

Ce projet utilise les tables suivantes:

- `products`: Stocke les informations sur les produits
- `categories`: Catégories de produits
- `orders`: Commandes des utilisateurs
- `order_items`: Articles dans chaque commande
- `cart_items`: Articles dans le panier des utilisateurs
- `profiles`: Informations sur les utilisateurs (créée automatiquement par Supabase Auth)

## Fonctionnalités utilisant Supabase

- Authentification des utilisateurs (inscription, connexion)
- Stockage de données (produits, commandes, etc.)
- Panier d'achats synchronisé avec le compte utilisateur
- Favoris utilisateur
- Adresses de livraison

Pour plus d'informations sur l'intégration Supabase avec Lovable, consultez la [documentation officielle](https://docs.lovable.dev/integrations/supabase/).
