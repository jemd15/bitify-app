-- ============================================================================
-- BITIFY - ESQUEMA COMPLETO DE BASE DE DATOS
-- ============================================================================
-- Este archivo contiene la configuración completa de la base de datos Bitify
-- Incluye: enums, tablas, funciones, triggers, índices, políticas RLS y cron job
-- Fecha: 2025-12-16
-- Proyecto: bitify-dev
-- ============================================================================

-- ============================================================================
-- 1. CREAR ENUMS
-- ============================================================================

CREATE TYPE user_type AS ENUM ('free', 'pro');
CREATE TYPE occupant_role AS ENUM ('owner', 'occupant_with_permissions', 'occupant');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'rejected', 'canceled');
CREATE TYPE task_status AS ENUM ('pending', 'completed', 'validated', 'expired');
CREATE TYPE recurrence_type AS ENUM ('none', 'weekly', 'monthly', 'yearly');
CREATE TYPE points_expiration_type AS ENUM ('none', 'weekly', 'monthly', 'yearly', 'custom_date');
CREATE TYPE points_type AS ENUM ('on_time', 'extended', 'not_completed', 'reward_redemption');
CREATE TYPE notification_type AS ENUM ('task_reminder', 'task_validation', 'member_joined', 'member_left');

-- ============================================================================
-- 2. CREAR FUNCIONES BASE
-- ============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. CREAR TABLAS
-- ============================================================================

-- Tabla: users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  user_type user_type NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: user_preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'en')),
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  notifications_task_reminder_enabled BOOLEAN NOT NULL DEFAULT true,
  notifications_task_validation_enabled BOOLEAN NOT NULL DEFAULT true,
  notifications_member_joined_enabled BOOLEAN NOT NULL DEFAULT true,
  notifications_member_left_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: user_limits
CREATE TABLE user_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type user_type NOT NULL UNIQUE,
  max_houses INTEGER NOT NULL DEFAULT 1,
  max_occupants_with_permissions INTEGER NOT NULL DEFAULT 0,
  max_tasks_per_house INTEGER NOT NULL DEFAULT 20,
  max_rooms_per_house INTEGER NOT NULL DEFAULT 5,
  max_rewards_per_house INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: houses
CREATE TABLE houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points_expiration_type points_expiration_type NOT NULL DEFAULT 'none',
  points_expiration_custom_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: house_occupants
CREATE TABLE house_occupants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role occupant_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(house_id, user_id)
);

-- Tabla: rooms
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  validator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  requires_validation BOOLEAN NOT NULL DEFAULT false,
  points_on_time INTEGER NOT NULL DEFAULT 10,
  points_extended INTEGER NOT NULL DEFAULT 5,
  points_not_completed INTEGER NOT NULL DEFAULT -5,
  due_date DATE NOT NULL,
  extended_due_date DATE,
  extended_days INTEGER NOT NULL DEFAULT 0,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_type recurrence_type NOT NULL DEFAULT 'none',
  recurrence_date DATE,
  status task_status NOT NULL DEFAULT 'pending',
  parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  validation_description TEXT,
  notification_enabled BOOLEAN NOT NULL DEFAULT false,
  notification_minutes_before INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT tasks_notification_minutes_before_check CHECK (notification_minutes_before IS NULL OR notification_minutes_before > 0)
);

-- Tabla: task_validations
CREATE TABLE task_validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL UNIQUE REFERENCES tasks(id) ON DELETE CASCADE,
  validated_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  validation_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: user_house_points
CREATE TABLE user_house_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  available_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, house_id)
);

-- Tabla: point_history
CREATE TABLE point_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,
  points_type points_type NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  description TEXT
);

-- Tabla: house_rewards
CREATE TABLE house_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL CHECK (points_cost > 0),
  stock_limit INTEGER,
  current_stock INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: reward_redemptions
CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reward_id UUID NOT NULL REFERENCES house_rewards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL CHECK (points_spent > 0),
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: house_invitations
CREATE TABLE house_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role occupant_role NOT NULL CHECK (role <> 'owner'),
  status invitation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  canceled_at TIMESTAMPTZ
);

-- Tabla: notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  notification_type notification_type NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT notifications_task_or_house_check CHECK (
    (notification_type IN ('task_reminder', 'task_validation') AND task_id IS NOT NULL) OR
    (notification_type IN ('member_joined', 'member_left') AND house_id IS NOT NULL)
  )
);

-- ============================================================================
-- 4. CREAR ÍNDICES
-- ============================================================================

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_houses_owner_id ON houses(owner_id);
CREATE INDEX idx_house_occupants_house_id ON house_occupants(house_id);
CREATE INDEX idx_house_occupants_user_id ON house_occupants(user_id);
CREATE INDEX idx_rooms_house_id ON rooms(house_id);
CREATE INDEX idx_tasks_house_id ON tasks(house_id);
CREATE INDEX idx_tasks_room_id ON tasks(room_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_task_validations_task_id ON task_validations(task_id);
CREATE INDEX idx_user_house_points_user_id ON user_house_points(user_id);
CREATE INDEX idx_user_house_points_house_id ON user_house_points(house_id);
CREATE INDEX idx_point_history_user_id ON point_history(user_id);
CREATE INDEX idx_point_history_house_id ON point_history(house_id);
CREATE INDEX idx_point_history_task_id ON point_history(task_id);
CREATE INDEX idx_house_rewards_house_id ON house_rewards(house_id);
CREATE INDEX idx_reward_redemptions_user_id ON reward_redemptions(user_id);
CREATE INDEX idx_reward_redemptions_house_id ON reward_redemptions(house_id);
CREATE INDEX idx_house_invitations_house_id ON house_invitations(house_id);
CREATE INDEX idx_house_invitations_invited_user_id ON house_invitations(invited_user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_task_id ON notifications(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX idx_notifications_house_id ON notifications(house_id) WHERE house_id IS NOT NULL;
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for) WHERE sent_at IS NULL;
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- ============================================================================
-- 5. CREAR FUNCIONES ESPECIALIZADAS
-- ============================================================================

-- Función: calcular extended_due_date
CREATE OR REPLACE FUNCTION calculate_extended_due_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.extended_days > 0 AND NEW.due_date IS NOT NULL THEN
    NEW.extended_due_date := NEW.due_date + (NEW.extended_days || ' days')::interval;
  ELSE
    NEW.extended_due_date := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: crear usuario y preferencias al registrarse
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

-- Función: crear ocupante dueño al crear casa
CREATE OR REPLACE FUNCTION create_house_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO house_occupants (house_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: actualizar puntos al completar tarea
CREATE OR REPLACE FUNCTION update_points_on_task_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_points INTEGER;
  v_points_type points_type;
  v_expires_at TIMESTAMPTZ;
  v_house_expiration_type points_expiration_type;
  v_house_custom_date DATE;
BEGIN
  -- Solo procesar si la tarea cambió a 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Determinar puntos según fecha de completado
    IF NEW.completed_at::date <= NEW.due_date THEN
      v_points := NEW.points_on_time;
      v_points_type := 'on_time';
    ELSIF NEW.extended_due_date IS NOT NULL AND NEW.completed_at::date <= NEW.extended_due_date THEN
      v_points := NEW.points_extended;
      v_points_type := 'extended';
    ELSE
      v_points := NEW.points_not_completed;
      v_points_type := 'not_completed';
    END IF;

    -- Obtener configuración de expiración de la casa
    SELECT points_expiration_type, points_expiration_custom_date
    INTO v_house_expiration_type, v_house_custom_date
    FROM houses
    WHERE id = NEW.house_id;

    -- Calcular fecha de expiración
    IF v_house_expiration_type = 'none' THEN
      v_expires_at := NULL;
    ELSIF v_house_expiration_type = 'weekly' THEN
      v_expires_at := (DATE_TRUNC('week', NEW.completed_at::date) + INTERVAL '6 days')::timestamptz;
    ELSIF v_house_expiration_type = 'monthly' THEN
      v_expires_at := (DATE_TRUNC('month', NEW.completed_at::date) + INTERVAL '1 month - 1 day')::timestamptz;
    ELSIF v_house_expiration_type = 'yearly' THEN
      v_expires_at := (DATE_TRUNC('year', NEW.completed_at::date) + INTERVAL '1 year - 1 day')::timestamptz;
    ELSIF v_house_expiration_type = 'custom_date' AND v_house_custom_date IS NOT NULL THEN
      v_expires_at := v_house_custom_date::timestamptz;
    ELSE
      v_expires_at := NULL;
    END IF;

    -- Insertar en historial
    INSERT INTO point_history (user_id, house_id, task_id, points, points_type, earned_at, expires_at, description)
    VALUES (
      NEW.assigned_to,
      NEW.house_id,
      NEW.id,
      v_points,
      v_points_type,
      NEW.completed_at,
      v_expires_at,
      'Tarea: ' || NEW.title
    );

    -- Actualizar o crear registro en user_house_points
    INSERT INTO user_house_points (user_id, house_id, total_points, available_points)
    VALUES (NEW.assigned_to, NEW.house_id, v_points, v_points)
    ON CONFLICT (user_id, house_id)
    DO UPDATE SET
      total_points = user_house_points.total_points + v_points,
      available_points = user_house_points.available_points + v_points,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: manejar validación de tarea
CREATE OR REPLACE FUNCTION handle_task_validation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tasks
  SET
    status = 'validated',
    validated_at = NEW.created_at,
    validated_by = NEW.validated_by,
    validation_description = NEW.validation_description
  WHERE id = NEW.task_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: actualizar stock al canjear premio
CREATE OR REPLACE FUNCTION update_reward_stock_on_redemption()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE house_rewards
  SET
    current_stock = current_stock - 1,
    updated_at = NOW()
  WHERE id = NEW.reward_id
    AND current_stock IS NOT NULL
    AND current_stock > 0;

  -- Actualizar puntos del usuario
  UPDATE user_house_points
  SET
    available_points = available_points - NEW.points_spent,
    updated_at = NOW()
  WHERE user_id = NEW.user_id
    AND house_id = NEW.house_id;

  -- Registrar en historial
  INSERT INTO point_history (user_id, house_id, points, points_type, description)
  SELECT
    NEW.user_id,
    NEW.house_id,
    -NEW.points_spent,
    'reward_redemption',
    'Canje: ' || hr.name
  FROM house_rewards hr
  WHERE hr.id = NEW.reward_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: crear ocupante al aceptar invitación
CREATE OR REPLACE FUNCTION handle_invitation_accepted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
    INSERT INTO house_occupants (house_id, user_id, role)
    VALUES (NEW.house_id, NEW.invited_user_id, NEW.role)
    ON CONFLICT (house_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: expirar puntos
CREATE OR REPLACE FUNCTION expire_points()
RETURNS INTEGER AS $$
DECLARE
  v_updated_count INTEGER;
BEGIN
  WITH expired_points AS (
    SELECT
      uhp.user_id,
      uhp.house_id,
      SUM(ph.points) as expired_amount
    FROM user_house_points uhp
    JOIN point_history ph ON ph.user_id = uhp.user_id AND ph.house_id = uhp.house_id
    WHERE ph.expires_at IS NOT NULL
      AND ph.expires_at < NOW()
      AND ph.expires_at >= uhp.updated_at
    GROUP BY uhp.user_id, uhp.house_id
  )
  UPDATE user_house_points uhp
  SET
    available_points = GREATEST(0, available_points - COALESCE(ep.expired_amount, 0)),
    updated_at = NOW()
  FROM expired_points ep
  WHERE uhp.user_id = ep.user_id
    AND uhp.house_id = ep.house_id;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  RETURN v_updated_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. CREAR TRIGGERS
-- ============================================================================

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_limits_updated_at BEFORE UPDATE ON user_limits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON houses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_house_occupants_updated_at BEFORE UPDATE ON house_occupants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_house_rewards_updated_at BEFORE UPDATE ON house_rewards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_house_invitations_updated_at BEFORE UPDATE ON house_invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para calcular extended_due_date
CREATE TRIGGER calculate_extended_due_date_trigger
BEFORE INSERT OR UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION calculate_extended_due_date();

-- Trigger para crear usuario y preferencias
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Trigger para crear ocupante dueño
CREATE TRIGGER create_house_owner_trigger
AFTER INSERT ON houses
FOR EACH ROW
EXECUTE FUNCTION create_house_owner();

-- Trigger para actualizar puntos
CREATE TRIGGER update_points_on_task_completion_trigger
AFTER INSERT OR UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_points_on_task_completion();

-- Trigger para manejar validación
CREATE TRIGGER handle_task_validation_trigger
AFTER INSERT ON task_validations
FOR EACH ROW
EXECUTE FUNCTION handle_task_validation();

-- Trigger para actualizar stock
CREATE TRIGGER update_reward_stock_on_redemption_trigger
AFTER INSERT ON reward_redemptions
FOR EACH ROW
EXECUTE FUNCTION update_reward_stock_on_redemption();

-- Trigger para aceptar invitación
CREATE TRIGGER handle_invitation_accepted_trigger
AFTER UPDATE ON house_invitations
FOR EACH ROW
EXECUTE FUNCTION handle_invitation_accepted();

-- ============================================================================
-- 7. INSERTAR DATOS INICIALES
-- ============================================================================

-- Insertar límites de usuarios
INSERT INTO user_limits (user_type, max_houses, max_occupants_with_permissions, max_tasks_per_house, max_rooms_per_house, max_rewards_per_house)
VALUES
  ('free', 1, 0, 20, 5, 5),
  ('pro', 5, 10, 100, 10, 20)
ON CONFLICT (user_type) DO NOTHING;

-- ============================================================================
-- 8. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_occupants ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_house_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. POLÍTICAS RLS PARA USERS
-- ============================================================================

CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- ============================================================================
-- 10. POLÍTICAS RLS PARA USER_PREFERENCES
-- ============================================================================

CREATE POLICY "Users can view their own preferences"
ON user_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
ON user_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON user_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================================================
-- 11. POLÍTICAS RLS PARA HOUSES
-- ============================================================================

CREATE POLICY "Users can view houses they belong to"
ON houses FOR SELECT
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM house_occupants
    WHERE house_id = houses.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create houses as owner"
ON houses FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their houses"
ON houses FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their houses"
ON houses FOR DELETE
USING (owner_id = auth.uid());

-- ============================================================================
-- 12. POLÍTICAS RLS PARA HOUSE_OCCUPANTS
-- ============================================================================

CREATE POLICY "Users can view occupants of their houses"
ON house_occupants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM houses
    WHERE id = house_occupants.house_id
      AND (owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM house_occupants ho2
        WHERE ho2.house_id = house_occupants.house_id
          AND ho2.user_id = auth.uid()
      ))
  )
);

CREATE POLICY "Owners can manage occupants"
ON house_occupants FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM houses
    WHERE id = house_occupants.house_id AND owner_id = auth.uid()
  )
);

-- ============================================================================
-- 13. POLÍTICAS RLS PARA ROOMS
-- ============================================================================

CREATE POLICY "Users can view rooms of their houses"
ON rooms FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id
    WHERE h.id = rooms.house_id
      AND (h.owner_id = auth.uid() OR ho.user_id = auth.uid())
  )
);

CREATE POLICY "Managers can manage rooms"
ON rooms FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id AND ho.user_id = auth.uid()
    WHERE h.id = rooms.house_id
      AND (h.owner_id = auth.uid() OR ho.role IN ('owner', 'occupant_with_permissions'))
  )
);

-- ============================================================================
-- 14. POLÍTICAS RLS PARA TASKS
-- ============================================================================

CREATE POLICY "Users can view tasks of their houses"
ON tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id
    WHERE h.id = tasks.house_id
      AND (h.owner_id = auth.uid() OR ho.user_id = auth.uid())
  )
);

CREATE POLICY "Managers can create tasks"
ON tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id AND ho.user_id = auth.uid()
    WHERE h.id = tasks.house_id
      AND (h.owner_id = auth.uid() OR ho.role IN ('owner', 'occupant_with_permissions'))
  )
);

CREATE POLICY "Assigned users and managers can update tasks"
ON tasks FOR UPDATE
USING (
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id AND ho.user_id = auth.uid()
    WHERE h.id = tasks.house_id
      AND (h.owner_id = auth.uid() OR ho.role IN ('owner', 'occupant_with_permissions'))
  )
);

CREATE POLICY "Managers can delete tasks"
ON tasks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id AND ho.user_id = auth.uid()
    WHERE h.id = tasks.house_id
      AND (h.owner_id = auth.uid() OR ho.role IN ('owner', 'occupant_with_permissions'))
  )
);

-- ============================================================================
-- 15. POLÍTICAS RLS PARA TASK_VALIDATIONS
-- ============================================================================

CREATE POLICY "Users can view validations of visible tasks"
ON task_validations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM tasks t
    JOIN houses h ON h.id = t.house_id
    LEFT JOIN house_occupants ho ON ho.house_id = h.id
    WHERE t.id = task_validations.task_id
      AND (h.owner_id = auth.uid() OR ho.user_id = auth.uid())
  )
);

CREATE POLICY "Authorized users can create validations"
ON task_validations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM tasks t
    JOIN houses h ON h.id = t.house_id
    LEFT JOIN house_occupants ho ON ho.house_id = h.id AND ho.user_id = auth.uid()
    WHERE t.id = task_validations.task_id
      AND (
        h.owner_id = auth.uid() OR
        ho.role IN ('owner', 'occupant_with_permissions') OR
        t.assigned_to = auth.uid() OR
        (t.validator_id IS NULL AND t.requires_validation = true) OR
        t.validator_id = auth.uid()
      )
  )
);

-- ============================================================================
-- 16. POLÍTICAS RLS PARA USER_HOUSE_POINTS
-- ============================================================================

CREATE POLICY "Users can view their own points"
ON user_house_points FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Owners can view points of their houses"
ON user_house_points FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM houses
    WHERE id = user_house_points.house_id AND owner_id = auth.uid()
  )
);

-- ============================================================================
-- 17. POLÍTICAS RLS PARA POINT_HISTORY
-- ============================================================================

CREATE POLICY "Users can view their own point history"
ON point_history FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Owners can view point history of their houses"
ON point_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM houses
    WHERE id = point_history.house_id AND owner_id = auth.uid()
  )
);

-- ============================================================================
-- 18. POLÍTICAS RLS PARA HOUSE_REWARDS
-- ============================================================================

CREATE POLICY "Users can view rewards of their houses"
ON house_rewards FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id
    WHERE h.id = house_rewards.house_id
      AND (h.owner_id = auth.uid() OR ho.user_id = auth.uid())
  )
);

CREATE POLICY "Managers can manage rewards"
ON house_rewards FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id AND ho.user_id = auth.uid()
    WHERE h.id = house_rewards.house_id
      AND (h.owner_id = auth.uid() OR ho.role IN ('owner', 'occupant_with_permissions'))
  )
);

-- ============================================================================
-- 19. POLÍTICAS RLS PARA REWARD_REDEMPTIONS
-- ============================================================================

CREATE POLICY "Users can view redemptions of their houses"
ON reward_redemptions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id
    WHERE h.id = reward_redemptions.house_id
      AND (h.owner_id = auth.uid() OR ho.user_id = auth.uid())
  )
);

CREATE POLICY "Occupants can create redemptions"
ON reward_redemptions FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id AND ho.user_id = auth.uid()
    WHERE h.id = reward_redemptions.house_id
      AND (h.owner_id = auth.uid() OR ho.user_id = auth.uid())
  )
);

-- ============================================================================
-- 20. POLÍTICAS RLS PARA HOUSE_INVITATIONS
-- ============================================================================

CREATE POLICY "Users can view invitations sent to them"
ON house_invitations FOR SELECT
USING (invited_user_id = auth.uid());

CREATE POLICY "Managers can view invitations of their houses"
ON house_invitations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id AND ho.user_id = auth.uid()
    WHERE h.id = house_invitations.house_id
      AND (h.owner_id = auth.uid() OR ho.role IN ('owner', 'occupant_with_permissions'))
  )
);

CREATE POLICY "Managers can create invitations"
ON house_invitations FOR INSERT
WITH CHECK (
  invited_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM houses h
    LEFT JOIN house_occupants ho ON ho.house_id = h.id AND ho.user_id = auth.uid()
    WHERE h.id = house_invitations.house_id
      AND (h.owner_id = auth.uid() OR ho.role IN ('owner', 'occupant_with_permissions'))
  )
);

CREATE POLICY "Users can update invitations sent to them"
ON house_invitations FOR UPDATE
USING (invited_user_id = auth.uid());

CREATE POLICY "Creators can cancel their invitations"
ON house_invitations FOR UPDATE
USING (invited_by = auth.uid());

-- ============================================================================
-- 21. POLÍTICAS RLS PARA NOTIFICATIONS
-- ============================================================================

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications for users"
ON notifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================================================
-- 22. CONFIGURAR CRON JOB
-- ============================================================================

-- Habilitar pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar el cron job para ejecutar expire_points() diariamente
-- Ajustado para horario chileno continental (UTC-3), que es 03:00 UTC
SELECT cron.schedule(
  'expire-points-daily',
  '0 3 * * *',
  $$SELECT expire_points()$$
);

-- ============================================================================
-- 23. CONFIGURAR STORAGE BUCKET PARA ARCHIVOS DE USUARIOS
-- ============================================================================

-- Crear el bucket 'user_files' si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user_files',
  'user_files',
  true,
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Política RLS: Los usuarios pueden subir archivos a su propia carpeta
CREATE POLICY "Users can upload files to their own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user_files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política RLS: Los usuarios pueden ver todos los archivos (bucket público)
CREATE POLICY "Anyone can view user files"
ON storage.objects FOR SELECT
USING (bucket_id = 'user_files');

-- Política RLS: Los usuarios pueden actualizar sus propios archivos
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user_files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política RLS: Los usuarios pueden eliminar sus propios archivos
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user_files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- FIN DEL ESQUEMA
-- ============================================================================

