-- Migración: Habilitar pg_cron y programar expiración de puntos
-- Fecha: 2025-12-16
-- Descripción: Habilita la extensión pg_cron y programa un cron job para ejecutar
--              expire_points() diariamente a medianoche UTC

-- Habilitar la extensión pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar el cron job para ejecutar expire_points() diariamente a medianoche horario chileno continental
-- El cron job se ejecutará todos los días a las 03:00 UTC (00:00 CLT, UTC-3)
SELECT cron.schedule(
  'expire-points-daily',           -- Nombre único del job
  '0 3 * * *',                     -- Cron expression: todos los días a las 03:00 UTC (medianoche Chile continental)
  $$SELECT expire_points()$$       -- Función a ejecutar
);

