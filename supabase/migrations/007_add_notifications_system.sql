-- Migración: Sistema de notificaciones
-- Fecha: 2025-12-16
-- Descripción: Agrega soporte para notificaciones de tareas, validaciones y eventos de miembros

-- 1. Crear enum para tipos de notificaciones
CREATE TYPE notification_type AS ENUM (
  'task_reminder',      -- Recordatorio para completar tarea
  'task_validation',    -- Tarea puede ser validada
  'member_joined',      -- Nuevo miembro llega a la casa
  'member_left'         -- Miembro deja la casa
);

-- 2. Agregar campos de notificaciones a user_preferences
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS notifications_task_reminder_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS notifications_task_validation_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS notifications_member_joined_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS notifications_member_left_enabled BOOLEAN NOT NULL DEFAULT true;

-- 3. Agregar campos de notificaciones a tasks
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS notification_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_minutes_before INTEGER;

-- Agregar constraint para notification_minutes_before (debe ser positivo si está definido)
ALTER TABLE tasks
ADD CONSTRAINT tasks_notification_minutes_before_check
CHECK (notification_minutes_before IS NULL OR notification_minutes_before > 0);

-- 4. Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  notification_type notification_type NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint: debe tener task_id o house_id según el tipo
  CONSTRAINT notifications_task_or_house_check CHECK (
    (notification_type IN ('task_reminder', 'task_validation') AND task_id IS NOT NULL) OR
    (notification_type IN ('member_joined', 'member_left') AND house_id IS NOT NULL)
  )
);

-- 5. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_task_id ON notifications(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_house_id ON notifications(house_id) WHERE house_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for) WHERE sent_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);

-- 6. Habilitar RLS en notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 7. Políticas RLS para notifications
-- Los usuarios solo pueden ver sus propias notificaciones
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- Los usuarios pueden insertar sus propias notificaciones (para el sistema)
CREATE POLICY "System can insert notifications for users"
ON notifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus propias notificaciones (marcar como enviadas)
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- 8. Agregar trigger para updated_at en notifications
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

