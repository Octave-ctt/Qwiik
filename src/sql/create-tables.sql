
-- Création de la table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  addresses JSONB DEFAULT '[]'::JSONB,
  favorites JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des produits
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  category_id UUID,
  rating DECIMAL(3, 1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  delivery_time TEXT DEFAULT '30 min',
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  delivery_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des articles de commande
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table du panier
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Insertion des catégories
INSERT INTO categories (name, slug, image)
VALUES 
  ('Tech', 'tech', 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1000'),
  ('Beauté', 'beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000'),
  ('Maison & Déco', 'home', 'https://images.unsplash.com/photo-1591130901921-3f0652bb3915?q=80&w=1000')
ON CONFLICT (slug) DO NOTHING;

-- Nettoyage des anciens produits
TRUNCATE products CASCADE;

-- Insertion des produits d'exemple (seulement 2 par catégorie)
INSERT INTO products (name, description, price, image, category, rating, review_count, delivery_time)
VALUES
  ('Écouteurs sans fil', 'Écouteurs Bluetooth de haute qualité avec une excellente autonomie et une qualité sonore exceptionnelle. Parfaits pour le sport et les déplacements quotidiens.', 49.99, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=1000', 'tech', 4.8, 342, '30 min'),
  ('Bracelet connecté fitness', 'Suivi de votre activité physique et santé avec mesure du rythme cardiaque, comptage des pas et suivi du sommeil. Résistant à l''eau et avec une batterie longue durée.', 39.99, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000', 'tech', 4.6, 187, '30 min'),
  ('Crème hydratante visage', 'Formule enrichie en vitamines et acide hyaluronique pour une hydratation intense. Convient à tous les types de peau et s''utilise matin et soir pour un teint éclatant.', 34.99, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1000', 'beauty', 4.9, 276, '30 min'),
  ('Parfum de luxe unisexe', 'Fragrance élégante et raffinée aux notes boisées et florales. Tenue longue durée pour vous accompagner toute la journée avec un parfum subtil et envoûtant.', 89.99, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000', 'beauty', 4.9, 289, '30 min'),
  ('Lampe de table design', 'Éclairage moderne pour votre intérieur avec intensité réglable. Son design épuré s''intègre parfaitement dans tous les styles de décoration pour créer une ambiance chaleureuse.', 49.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000', 'home', 4.7, 112, '30 min'),
  ('Vase décoratif en céramique', 'Pièce artisanale élégante pour sublimer vos fleurs et plantes. Disponible en plusieurs tailles et couleurs pour s''adapter à votre décoration intérieure.', 29.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000', 'home', 4.8, 95, '30 min');

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Politique pour les profils (accessibles uniquement par le propriétaire)
CREATE POLICY "Profils accessibles par le propriétaire" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Politique pour les produits (accessibles par tous)
CREATE POLICY "Produits visibles par tous" ON products
  FOR SELECT USING (true);

-- Politique pour les catégories (accessibles par tous)
CREATE POLICY "Catégories visibles par tous" ON categories
  FOR SELECT USING (true);

-- Politique pour les commandes (visibles uniquement par le propriétaire)
CREATE POLICY "Commandes visibles par le propriétaire" ON orders
  FOR ALL USING (auth.uid() = user_id);

-- Politique pour les articles de commande (visibles uniquement par le propriétaire de la commande)
CREATE POLICY "Articles de commande visibles par le propriétaire" ON order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Politique pour le panier (visible uniquement par le propriétaire)
CREATE POLICY "Panier visible par le propriétaire" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Panier modifiable par le propriétaire" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Panier supprimable par le propriétaire" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Panier updatable par le propriétaire" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

-- Trigger pour mettre à jour la date de modification des profils
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at_trigger
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- Trigger pour mettre à jour la date de modification des produits
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at_trigger
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_products_updated_at();
