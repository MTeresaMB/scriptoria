-- Crear tabla genre si no existe
CREATE TABLE IF NOT EXISTS genre (
  id_genre SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar géneros de Fiction
INSERT INTO genre (name, category) VALUES
  ('Action', 'Fiction'),
  ('Adventure', 'Fiction'),
  ('Comedy', 'Fiction'),
  ('Crime', 'Fiction'),
  ('Drama', 'Fiction'),
  ('Fantasy', 'Fiction'),
  ('Historical Fiction', 'Fiction'),
  ('Horror', 'Fiction'),
  ('Mystery', 'Fiction'),
  ('Romance', 'Fiction'),
  ('Science Fiction', 'Fiction'),
  ('Thriller', 'Fiction'),
  ('Western', 'Fiction'),
  ('Young Adult', 'Fiction'),
  ('Literary Fiction', 'Fiction'),
  ('Urban Fantasy', 'Fiction'),
  ('Paranormal Romance', 'Fiction'),
  ('Steampunk', 'Fiction'),
  ('Cyberpunk', 'Fiction'),
  ('Dystopian', 'Fiction')
ON CONFLICT (name) DO NOTHING;

-- Insertar géneros de Non-Fiction
INSERT INTO genre (name, category) VALUES
  ('Biography', 'Non-Fiction'),
  ('Autobiography', 'Non-Fiction'),
  ('Memoir', 'Non-Fiction'),
  ('History', 'Non-Fiction'),
  ('Science', 'Non-Fiction'),
  ('Philosophy', 'Non-Fiction'),
  ('Self-Help', 'Non-Fiction'),
  ('Business', 'Non-Fiction'),
  ('Health', 'Non-Fiction'),
  ('Travel', 'Non-Fiction'),
  ('Cooking', 'Non-Fiction'),
  ('Art', 'Non-Fiction'),
  ('Music', 'Non-Fiction'),
  ('Sports', 'Non-Fiction'),
  ('True Crime', 'Non-Fiction'),
  ('Journalism', 'Non-Fiction'),
  ('Essays', 'Non-Fiction'),
  ('Religion', 'Non-Fiction'),
  ('Education', 'Non-Fiction'),
  ('Politics', 'Non-Fiction')
ON CONFLICT (name) DO NOTHING;

