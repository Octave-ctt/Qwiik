
-- Ce script configure la relation entre auth.users et la table profiles
-- Il est conçu pour fonctionner avec l'authentification native de Supabase

-- Création de la table des profils utilisateurs (liée aux utilisateurs Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  addresses JSONB[],
  favorites TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Politique pour les profils (visible uniquement par le propriétaire)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger pour créer automatiquement un profil après l'inscription d'un utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, addresses, favorites)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', '{}', '{}');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Associer le trigger à la table auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Mettre à jour la colonne updated_at lorsqu'un profil est modifié
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_modified_column();

-- Créer des profils pour les utilisateurs existants s'ils n'en ont pas déjà
INSERT INTO public.profiles (id, email, name, addresses, favorites)
SELECT id, email, raw_user_meta_data->>'name', '{}', '{}'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

