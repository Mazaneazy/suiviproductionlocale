
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  phone TEXT,
  modules TEXT[] DEFAULT ARRAY[]::TEXT[],
  actions JSONB DEFAULT '[]'::JSONB,
  producteur_dossier_id UUID
);

-- Add RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for admin and directeur_general to see all users
CREATE POLICY users_admin_access ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users au 
      JOIN users u ON au.id = u.id
      WHERE au.id = auth.uid() AND (u.role = 'admin' OR u.role = 'directeur_general')
    )
  );

-- Policy for users to see their own data
CREATE POLICY users_self_access ON users
  FOR ALL
  TO authenticated
  USING (id = auth.uid());

-- Create user_actions table
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  details TEXT,
  module TEXT
);

-- Add RLS policies for user_actions table
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- Policy for admin and directeur_general to see all actions
CREATE POLICY user_actions_admin_access ON user_actions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users au 
      JOIN users u ON au.id = u.id
      WHERE au.id = auth.uid() AND (u.role = 'admin' OR u.role = 'directeur_general')
    )
  );

-- Policy for users to see their own actions
CREATE POLICY user_actions_self_access ON user_actions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create dossiers table
CREATE TABLE IF NOT EXISTS dossiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,
  operateur_nom TEXT NOT NULL,
  operateur_email TEXT,
  operateur_telephone TEXT,
  produit TEXT NOT NULL,
  date_reception TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'en_attente',
  responsable UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  description TEXT,
  historique JSONB DEFAULT '[]'::JSONB,
  pilote_technique UUID REFERENCES users(id),
  produit_code TEXT,
  date_certification TIMESTAMP WITH TIME ZONE,
  duree_certification INTEGER,
  niveau_conformite TEXT,
  probleme_recurrent TEXT
);

-- Add RLS policies for dossiers table
ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to see dossiers
CREATE POLICY dossiers_all_access ON dossiers
  FOR ALL
  TO authenticated
  USING (true);

-- Create notes_frais table
CREATE TABLE IF NOT EXISTS notes_frais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dossier_id UUID REFERENCES dossiers(id),
  inspecteur_id UUID REFERENCES users(id),
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  montant NUMERIC NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'en_attente',
  acquitte BOOLEAN DEFAULT false,
  frais_gestion NUMERIC DEFAULT 0,
  frais_inspection NUMERIC DEFAULT 0,
  frais_analyses NUMERIC DEFAULT 0,
  frais_surveillance NUMERIC DEFAULT 0,
  commentaire TEXT,
  fichier_url TEXT,
  notification_envoyee BOOLEAN DEFAULT false,
  operateur_notifie BOOLEAN DEFAULT false,
  parametres_analyse TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Add RLS policies for notes_frais table
ALTER TABLE notes_frais ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to see notes_frais
CREATE POLICY notes_frais_all_access ON notes_frais
  FOR ALL
  TO authenticated
  USING (true);

-- Create inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dossier_id UUID REFERENCES dossiers(id),
  date_inspection TIMESTAMP WITH TIME ZONE NOT NULL,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'planifiee',
  resultat TEXT,
  responsable UUID REFERENCES users(id),
  inspecteurs UUID[] DEFAULT ARRAY[]::UUID[],
  commentaires TEXT,
  rapport_url TEXT,
  objectifs TEXT,
  points_controle TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Add RLS policies for inspections table
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to see inspections
CREATE POLICY inspections_all_access ON inspections
  FOR ALL
  TO authenticated
  USING (true);

-- Create certificats table
CREATE TABLE IF NOT EXISTS certificats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dossier_id UUID REFERENCES dossiers(id),
  numero TEXT UNIQUE NOT NULL,
  date_emission TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  date_expiration TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'valide',
  emis_par UUID REFERENCES users(id),
  entreprise TEXT NOT NULL,
  produit TEXT NOT NULL,
  fichier_url TEXT,
  norme TEXT,
  signature_url TEXT
);

-- Add RLS policies for certificats table
ALTER TABLE certificats ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to see certificats
CREATE POLICY certificats_all_access ON certificats
  FOR ALL
  TO authenticated
  USING (true);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dossier_id UUID REFERENCES dossiers(id),
  nom TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  date_upload TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  uploaded_by UUID REFERENCES users(id),
  taille NUMERIC,
  statut TEXT DEFAULT 'en_revue',
  commentaires JSONB DEFAULT '[]'::JSONB,
  statut_validation TEXT,
  validateur UUID REFERENCES users(id),
  date_validation TIMESTAMP WITH TIME ZONE,
  est_conforme BOOLEAN,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Add RLS policies for documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to see documents
CREATE POLICY documents_all_access ON documents
  FOR ALL
  TO authenticated
  USING (true);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  titre TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  lue BOOLEAN DEFAULT false,
  type TEXT,
  lien TEXT
);

-- Add RLS policies for notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own notifications
CREATE POLICY notifications_self_access ON notifications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create demo_accounts table for login examples
CREATE TABLE IF NOT EXISTS demo_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL,
  email TEXT NOT NULL
);

-- Add RLS policies for demo_accounts table
ALTER TABLE demo_accounts ENABLE ROW LEVEL SECURITY;

-- Policy for anyone to read demo_accounts
CREATE POLICY demo_accounts_read_access ON demo_accounts
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert demo accounts
INSERT INTO demo_accounts (role, email)
VALUES 
  ('Administrateur', 'admin@example.com'),
  ('Chargé de la clientèle', 'accueil@example.com'),
  ('Responsable des missions', 'inspecteur@example.com'),
  ('Gestionnaire de Certificats', 'certificats@example.com'),
  ('Analyste', 'analyste@example.com'),
  ('Chargé des notes de frais', 'comptable@example.com'),
  ('Responsable Technique', 'rt@example.com'),
  ('Chef de Mission', 'chef.mission@example.com'),
  ('Surveillant', 'surveillant@example.com'),
  ('Directeur', 'directeur@example.com'),
  ('Directeur General', 'dg@example.com'),
  ('Gestionnaire Dossiers', 'gestionnaire@example.com')
ON CONFLICT DO NOTHING;
