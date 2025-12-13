-- Migración: Eliminar todo y recrear esquema completo
-- ADVERTENCIA: Esta migración elimina TODAS las tablas y datos existentes

-- 1. Eliminar todas las tablas en orden (respetando foreign keys)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reward_redemptions CASCADE;
DROP TABLE IF EXISTS house_rewards CASCADE;
DROP TABLE IF EXISTS house_invitations CASCADE;
DROP TABLE IF EXISTS point_history CASCADE;
DROP TABLE IF EXISTS user_house_points CASCADE;
DROP TABLE IF EXISTS task_validations CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS house_occupants CASCADE;
DROP TABLE IF EXISTS houses CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS user_limits CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Eliminar todos los tipos ENUM
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS points_type CASCADE;
DROP TYPE IF EXISTS points_expiration_type CASCADE;
DROP TYPE IF EXISTS invitation_status CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS recurrence_type CASCADE;
DROP TYPE IF EXISTS occupant_role CASCADE;
DROP TYPE IF EXISTS user_type CASCADE;

-- 3. Eliminar todas las funciones
DROP FUNCTION IF EXISTS expire_points() CASCADE;
DROP FUNCTION IF EXISTS handle_invitation_accepted() CASCADE;
DROP FUNCTION IF EXISTS create_house_owner() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_reward_stock_on_redemption() CASCADE;
DROP FUNCTION IF EXISTS handle_task_validation() CASCADE;
DROP FUNCTION IF EXISTS update_points_on_task_completion() CASCADE;
DROP FUNCTION IF EXISTS calculate_extended_due_date() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 4. Eliminar cron jobs
SELECT cron.unschedule('expire-points-daily') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'expire-points-daily'
);

