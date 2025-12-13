-- Migración: Renombrar tabla profiles a users
-- Fecha: 2025-12-16
-- Descripción: Renombra la tabla profiles a users y actualiza todas las referencias
--              (foreign keys, triggers, funciones, políticas RLS se actualizan automáticamente)

-- Renombrar la tabla profiles a users
-- Esto actualizará automáticamente todas las foreign keys debido a CASCADE
ALTER TABLE profiles RENAME TO users;

-- Renombrar el trigger
ALTER TRIGGER update_profiles_updated_at ON users RENAME TO update_users_updated_at;

-- Actualizar la función handle_new_user para usar users en lugar de profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );

  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

