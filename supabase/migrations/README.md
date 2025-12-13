# Migraciones de Base de Datos

Esta carpeta contiene todas las migraciones SQL aplicadas a la base de datos de Supabase del proyecto Bitify.

## Estructura

Las migraciones están numeradas secuencialmente y siguen el formato:

```
{numero}_{descripcion}.sql
```

## Migraciones Aplicadas

1. **`001_initial_schema_enums_and_types.sql`**: Enums y tipos personalizados
2. **`002_create_tables.sql`**: Todas las tablas principales
3. **`003_functions_and_triggers.sql`**: Funciones y triggers automáticos
4. **`004_row_level_security_policies_fixed.sql`**: Políticas de seguridad RLS
5. **`005_enable_pg_cron_and_schedule_expire_points.sql`**: Habilitación de pg_cron y configuración del cron job para expiración de puntos
6. **`006_rename_profiles_to_users.sql`**: Renombra la tabla `profiles` a `users` y actualiza todas las referencias
7. **`007_add_notifications_system.sql`**: Agrega sistema de notificaciones (tabla notifications, campos en user_preferences y tasks)
8. **`008_drop_all_and_recreate_schema.sql`**: Elimina todas las tablas, funciones y tipos existentes (migración destructiva)
9. **`009_recreate_complete_schema.sql`**: Recrea todo el esquema completo desde cero (enums, tablas, funciones, triggers, datos iniciales)
10. **`010_rls_policies_and_cron.sql`**: Aplica todas las políticas RLS y configura el cron job para expiración de puntos

## Aplicar Migraciones

Las migraciones se aplican automáticamente mediante el MCP de Supabase o manualmente desde el SQL Editor de Supabase.

### Verificar Migraciones Aplicadas

```sql
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC;
```

## Notas

- **No modificar migraciones existentes**: Una vez aplicadas, las migraciones no deben modificarse. Si necesitas cambios, crea una nueva migración.
- **Orden de aplicación**: Las migraciones deben aplicarse en orden secuencial.
- **Backup**: Siempre haz backup antes de aplicar migraciones en producción.
