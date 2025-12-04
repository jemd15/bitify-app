# Bitify Architecture Guide

## Overview

Bitify es una aplicación React Native construida con Expo que gestiona tareas del hogar. Este documento especifica la arquitectura, patrones y convenciones que deben seguirse en todo el proyecto.

## Principios Fundamentales

### Clean Architecture

El proyecto sigue los principios de Clean Architecture, organizando el código en capas con dependencias unidireccionales:

1. **Domain Layer**: Lógica de negocio pura, independiente de frameworks
2. **Application Layer**: Casos de uso y orquestación
3. **Infrastructure Layer**: Implementaciones concretas (APIs, almacenamiento)
4. **Presentation Layer**: UI, componentes React, pantallas

### Reglas de Código

- **NO comentarios en el código**: El código debe ser autoexplicativo mediante nombres descriptivos
- **NO magic strings/numbers**: Todos los valores literales deben estar en archivos de constantes
- **TypeScript estricto**: Todas las funciones, variables y props deben tener tipos explícitos
- **Separación de responsabilidades**: Cada módulo/archivo debe tener una única responsabilidad
- **Inmutabilidad**: Preferir estructuras inmutables y evitar mutaciones directas

## Guía de Responsabilidades por Tipo de Archivo/Carpeta

Esta sección explica detalladamente qué es cada tipo de archivo/carpeta en React/React Native y cuándo usarlo.

### Components (Componentes)

**¿Qué son?**
Los componentes son funciones que retornan elementos de UI (interfaz de usuario). Son los "bloques de construcción" de tu aplicación React.

**Ubicación**:

- `src/modules/{module}/components/` - Componentes específicos de un módulo
- `src/shared/components/` - Componentes reutilizables entre múltiples módulos

**Responsabilidades**:

- Renderizar UI (botones, inputs, cards, listas, etc.)
- Recibir datos vía props (propiedades)
- Manejar interacciones del usuario (clicks, cambios de texto, etc.)
- NO deben contener lógica de negocio compleja
- NO deben hacer llamadas directas a APIs
- Deben ser "tontos" (presentational) o "inteligentes" (container)

**Tipos de Componentes**:

1. **Presentational Components** (Componentes de Presentación):
   - Solo muestran datos
   - Reciben datos vía props
   - No manejan estado complejo
   - Ejemplo: `TaskCard`, `Button`, `Input`

2. **Container Components** (Componentes Contenedores):
   - Orquestan lógica y datos
   - Usan hooks para obtener datos
   - Pasan datos a componentes presentacionales
   - Ejemplo: `TasksListScreen` (que usa hooks y renderiza `TaskCard`)

**Cuándo crear un componente**:

- Cuando necesitas reutilizar la misma UI en múltiples lugares
- Cuando una parte de la UI es lo suficientemente compleja como para separarla
- Cuando quieres hacer el código más legible y mantenible

**Ejemplo**:

```typescript
// modules/tasks/components/TaskCard.tsx
interface TaskCardProps {
  task: Task;
  onPress: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(task.id)}>
      <Text>{task.title}</Text>
      <Text>{task.description}</Text>
    </TouchableOpacity>
  );
};
```

### Screens (Pantallas)

**¿Qué son?**
Las Screens son componentes especiales que representan una pantalla completa de la aplicación. Son el equivalente a "páginas" en una aplicación web.

**Ubicación**: `src/modules/{module}/screens/`

**Responsabilidades**:

- Representar una pantalla completa de la app
- Orquestar múltiples componentes
- Manejar estados de carga (loading), error y éxito
- Integrar hooks para obtener datos
- Manejar navegación (usando coordinadores)
- NO deben contener lógica de negocio (debe estar en services)
- NO deben hacer llamadas directas a APIs (deben usar hooks)

**Características**:

- Nombres terminan en "Screen" (ej: `LoginScreen.tsx`, `TasksListScreen.tsx`)
- Usan hooks personalizados para obtener datos
- Manejan estados de UI (loading, error, success)
- Usan coordinadores para navegación

**Ejemplo**:

```typescript
// modules/tasks/screens/TasksListScreen.tsx
export const TasksListScreen: React.FC = () => {
  const { data: tasks, isLoading, error } = useTasksList(houseId);
  const coordinator = useTasksCoordinator();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <View>
      {tasks?.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </View>
  );
};
```

### Hooks

**¿Qué son?**
Los hooks son funciones especiales de React que permiten "enganchar" funcionalidad a componentes. Empiezan con "use" (ej: `useState`, `useEffect`, `useQuery`).

**Ubicación**:

- `src/modules/{module}/hooks/` - Hooks específicos de un módulo
- `src/shared/hooks/` - Hooks reutilizables entre módulos

**Responsabilidades**:

- Encapsular lógica reutilizable
- Gestionar estado y efectos secundarios
- Abstraer llamadas a APIs usando React Query
- Transformar datos para presentación
- NO deben contener lógica de UI (renderizado)
- NO deben hacer llamadas directas a Supabase (deben usar services)

**Tipos de Hooks**:

1. **Data Hooks** (Hooks de Datos):
   - Obtienen datos del servidor usando React Query
   - Ejemplo: `useTasksList()`, `useHouseDetail()`
   - Retornan: `{ data, isLoading, error, refetch }`

2. **Mutation Hooks** (Hooks de Mutación):
   - Crean, actualizan o eliminan datos
   - Ejemplo: `useCreateTask()`, `useLogin()`
   - Retornan: `{ mutate, mutateAsync, isLoading, error }`

3. **UI Hooks** (Hooks de UI):
   - Manejan estado de UI local
   - Ejemplo: `useModal()`, `useForm()`
   - Retornan estado y funciones para modificar ese estado

**Cuándo crear un hook**:

- Cuando necesitas reutilizar lógica entre múltiples componentes
- Cuando quieres separar lógica de datos de la UI
- Cuando quieres hacer componentes más simples y legibles

**Ejemplo**:

```typescript
// modules/tasks/hooks/useTasksList.ts
export const useTasksList = (houseId: string) => {
  return useQuery({
    queryKey: ['tasks', 'list', houseId],
    queryFn: () => taskService.getByHouseId(houseId),
    enabled: !!houseId,
  });
};
```

### Modules (Módulos)

**¿Qué son?**
Los módulos son agrupaciones de código relacionado con una funcionalidad específica (feature-based). Cada módulo contiene todo lo necesario para esa funcionalidad.

**Ubicación**: `src/modules/{module}/`

**Responsabilidades**:

- Agrupar código relacionado con una funcionalidad
- Contener todas las capas (domain, services, repositories, presentation)
- Ser independiente y autocontenido
- NO debe depender de otros módulos directamente (usar shared cuando sea necesario)

**Estructura de un Módulo**:

```
modules/tasks/
├── components/        # Componentes específicos del módulo
├── screens/           # Pantallas del módulo
├── hooks/             # Hooks del módulo
├── services/           # Lógica de aplicación
├── repositories/      # Acceso a datos
├── domain/            # Lógica de negocio
├── coordinator/       # Navegación
├── store/            # Estado de UI del módulo
├── types/            # Tipos específicos
├── constants/         # Constantes del módulo
└── utils/             # Utilidades del módulo
```

**Cuándo crear un módulo**:

- Cuando tienes una funcionalidad completa y bien definida
- Cuando esa funcionalidad tiene múltiples pantallas y componentes
- Cuando quieres mantener el código organizado y fácil de encontrar

**Ejemplo de módulos**:

- `auth/` - Todo lo relacionado con autenticación
- `tasks/` - Todo lo relacionado con tareas
- `house/` - Todo lo relacionado con casas

### Utils (Utilidades)

**¿Qué son?**
Las utils son funciones puras (sin side effects) que realizan operaciones específicas y reutilizables.

**Ubicación**:

- `src/modules/{module}/utils/` - Utilidades específicas de un módulo
- `src/shared/utils/` - Utilidades compartidas entre módulos

**Responsabilidades**:

- Transformar datos (formatear fechas, convertir formatos, etc.)
- Filtrar datos (filtrar listas por criterios)
- Validar datos (validaciones de presentación)
- Calcular valores (cálculos matemáticos, transformaciones)
- NO deben tener side effects (no modificar estado global, no hacer llamadas a APIs)
- Deben ser funciones puras (mismo input = mismo output)
- Deben ser fácilmente testeables

**Cuándo crear una utilidad**:

- Cuando tienes una función que se usa en múltiples lugares
- Cuando quieres separar lógica pura de lógica de negocio
- Cuando quieres hacer el código más testeable

**Ejemplo**:

```typescript
// modules/tasks/utils/tasksFilters.ts
export const filterTasksByRoom = (tasks: Task[], roomId: string | null): Task[] => {
  if (roomId === null) {
    return tasks.filter(task => task.roomId === null);
  }
  return tasks.filter(task => task.roomId === roomId);
};

export const formatTaskDueDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
```

### Stores (Zustand)

**¿Qué son?**
Los stores son contenedores de estado global usando Zustand. Permiten compartir estado entre múltiples componentes sin necesidad de pasar props.

**Ubicación**:

- `src/modules/{module}/store/` - Stores específicos de un módulo
- `src/store/` - Stores globales de la aplicación

**Responsabilidades**:

- Gestionar estado de UI que no viene del servidor
- Gestionar preferencias de usuario (UI)
- Gestionar estado de formularios complejos
- Gestionar estado de modales/dialogs
- Gestionar filtros y búsquedas locales
- NO deben usarse para datos del servidor (usar React Query)
- NO deben usarse para estado local simple (usar useState)

**Cuándo usar un store**:

- Cuando necesitas compartir estado entre múltiples componentes que no están relacionados
- Cuando el estado es complejo y necesita persistencia
- Cuando quieres evitar "prop drilling" (pasar props por muchos niveles)

**Ejemplo**:

```typescript
// modules/tasks/store/tasksUi.store.ts
interface TasksUiState {
  selectedFilter: TaskFilter;
  showCompleted: boolean;
  setSelectedFilter: (filter: TaskFilter) => void;
  toggleShowCompleted: () => void;
}

export const useTasksUiStore = create<TasksUiState>(set => ({
  selectedFilter: TaskFilter.ALL,
  showCompleted: false,
  setSelectedFilter: filter => set({ selectedFilter: filter }),
  toggleShowCompleted: () => set(state => ({ showCompleted: !state.showCompleted })),
}));
```

### Lib (Librerías y Configuración)

**¿Qué son?**
La carpeta `lib/` contiene configuración e inicialización de librerías externas y utilidades de bajo nivel.

**Ubicación**: `src/lib/`

**Responsabilidades**:

- Configurar clientes de librerías externas (Supabase, React Query, etc.)
- Inicializar servicios de terceros
- Configurar utilidades compartidas de bajo nivel
- NO debe contener lógica de negocio
- NO debe contener componentes o hooks

**Qué va en lib/**:

- Configuración de Supabase (`supabase.ts`)
- Configuración de React Query (`queryClient.ts`)
- Configuración de otras librerías externas
- Utilidades de configuración de la app

**Ejemplo**:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Configuración Avanzada de React Query

**Ubicación**: `src/lib/queryClient.ts`

React Query se configura con opciones avanzadas para optimizar el comportamiento de la aplicación:

**Configuración del QueryClient**:

```typescript
// lib/queryClient.ts
import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query';
import { AppState, type AppStateStatus } from 'react-native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de detección de red
async function checkIsOnline(): Promise<boolean> {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 15000);
    const res = await fetch('https://api.supabase.co/health', {
      cache: 'no-store',
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Configurar online manager
onlineManager.setOnline(checkIsOnline());

// Configurar focus manager para refetch cuando la app vuelve al foreground
focusManager.setEventListener(onFocus => {
  const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
    focusManager.setFocused(status === 'active');
  });
  return () => subscription.remove();
});

// Query keys que se persisten
const STORED_CACHE_QUERY_KEY_ROOTS = ['houses', 'user-profile'] as const;

const createQueryClient = (userId?: string) =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // No refetch automático al enfocar ventana (evita problemas en feeds)
        refetchOnWindowFocus: false,
        // Deshabilitar structural sharing para poder confiar en timestamps
        // Esto es necesario cuando usamos timestamps para detectar cambios, ya que
        // React Query por defecto compara referencias de objetos, lo que puede causar
        // que actualizaciones con el mismo timestamp no se detecten correctamente
        structuralSharing: false,
        // No retry por defecto (fallar rápido y mostrar error al usuario)
        retry: false,
        // Tiempo que los datos se consideran frescos
        staleTime: 5 * 60 * 1000, // 5 minutos
        // Tiempo que los datos se mantienen en caché
        gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
      },
      mutations: {
        // Retry mutations una vez en caso de error de red
        retry: 1,
      },
    },
  });

// Persistencia selectiva
const dehydrateOptions = {
  shouldDehydrateMutation: () => false,
  shouldDehydrateQuery: (query: any) => {
    return STORED_CACHE_QUERY_KEY_ROOTS.includes(String(query.queryKey[0]));
  },
};

export function QueryProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  const [queryClient] = useState(() => createQueryClient(userId));
  const [persistOptions] = useState(() => {
    const asyncPersister = createAsyncStoragePersister({
      storage: AsyncStorage,
      key: `queryClient-${userId ?? 'logged-out'}`,
    });
    return {
      persister: asyncPersister,
      dehydrateOptions,
    };
  });

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      {children}
    </PersistQueryClientProvider>
  );
}

export { queryClient };
```

**Scoping por Usuario**:

El QueryClient se crea con un `userId` opcional para permitir aislamiento de caché entre usuarios. Esto es importante cuando:

1. Múltiples usuarios pueden usar la misma aplicación (modo multi-cuenta)
2. Se necesita limpiar caché al cambiar de usuario
3. Se quiere evitar que datos de un usuario se mezclen con otro

**Implementación**:

El `userId` se pasa al `QueryProvider` desde `AppProviders` usando la sesión actual:

```typescript
// src/AppProviders.tsx
import { QueryProvider } from '@lib/queryClient';
import { useAuthSession } from '@shared/hooks/useAuthSession';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useAuthSession();
  const userId = session?.user?.id;

  return (
    <QueryProvider userId={userId}>
      {children}
    </QueryProvider>
  );
};
```

**Limpieza al cambiar de usuario**:

```typescript
// En AppProviders o donde se maneje el cambio de sesión
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useAuthSession();
  const queryClient = useQueryClient();
  const previousUserIdRef = useRef<string | undefined>(session?.user?.id);

  useEffect(() => {
    const currentUserId = session?.user?.id;
    const previousUserId = previousUserIdRef.current;

    // Si el usuario cambió (logout o login diferente)
    if (previousUserId && previousUserId !== currentUserId) {
      // Limpiar caché del usuario anterior
      queryClient.clear();
    }

    previousUserIdRef.current = currentUserId;
  }, [session?.user?.id, queryClient]);

  return (
    <QueryProvider userId={currentUserId}>
      {children}
    </QueryProvider>
  );
};
```

**Nota**: En la mayoría de casos, cuando un usuario cierra sesión, se debe llamar a `queryClient.clear()` para limpiar todos los datos en caché. Esto se puede hacer en el listener de `onAuthStateChange` en `supabase.ts`.

**Características de la Configuración**:

1. **Detección de Red**: Verifica el estado de conexión periódicamente
2. **Focus Management**: Refetch automático cuando la app vuelve al foreground
3. **Persistencia Selectiva**: Solo queries importantes se persisten (houses, user-profile)
4. **Sin Retry por Defecto**: Falla rápido para mejor UX
5. **Scoping por Usuario**: Cada usuario tiene su propio QueryClient

**Uso en AppProviders**:

```typescript
// src/AppProviders.tsx
import { QueryProvider } from '@lib/queryClient';
import { useAuthSession } from '@shared/hooks/useAuthSession';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useAuthSession();
  const userId = session?.user?.id;

  return (
    <QueryProvider userId={userId}>
      {children}
    </QueryProvider>
  );
};
```

### Shared (Código Compartido)

**¿Qué son?**
La carpeta `shared/` contiene código que se usa en múltiples módulos. Es código transversal que no pertenece a un módulo específico.

**Ubicación**: `src/shared/`

**Responsabilidades**:

- Contener componentes reutilizables entre módulos
- Contener hooks reutilizables
- Contener tipos compartidos
- Contener constantes globales
- Contener utilidades compartidas
- Contener estilos compartidos
- NO debe contener lógica de negocio específica de un módulo
- NO debe depender de módulos específicos

**Estructura de Shared**:

```
shared/
├── components/        # Componentes base reutilizables (Button, Input, Card, ErrorBoundary, etc.)
├── hooks/             # Hooks reutilizables (useTimer, useGetTimeAgo, useAppState, etc.)
├── types/             # Tipos compartidos (errors.types.ts)
├── constants/         # Constantes globales (errorMessages.ts)
├── utils/             # Utilidades compartidas (stringHelpers, urlHelpers, etc.)
├── storage/           # Sistema de storage persistente tipado
│   ├── index.ts       # Clase Storage y exportaciones
│   ├── schema.ts      # Schemas TypeScript
│   └── hooks/
│       └── useStorage.ts
├── logger/            # Sistema de logging
│   ├── index.ts       # Exportación principal
│   ├── Logger.ts      # Clase Logger
│   ├── types.ts       # Tipos del logger
│   ├── util.ts        # Utilidades
│   └── transports/
│       └── console.ts  # Transport de consola
└── styles/            # Estilos compartidos
```

**Cuándo poner algo en shared**:

- Cuando se usa en 2 o más módulos diferentes
- Cuando es código genérico y reutilizable
- Cuando es infraestructura compartida (manejo de errores, tipos comunes)

**Ejemplo**:

```typescript
// shared/components/Button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary' }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles[variant]}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Services (Servicios)

**¿Qué son?**
Los servicios contienen la lógica de aplicación y orquestación. Coordinan entre repositorios y aplican reglas de negocio.

**Ubicación**: `src/modules/{module}/services/`

**Responsabilidades**:

- Contener lógica de aplicación y casos de uso
- Coordinar entre múltiples repositorios
- Validar datos usando esquemas Zod
- Transformar datos entre capas
- Aplicar reglas de negocio
- NO deben contener lógica de UI
- NO deben acceder directamente a Supabase (deben usar repositorios)
- NO deben contener lógica de presentación

**Cuándo crear un servicio**:

- Cuando necesitas orquestar múltiples operaciones
- Cuando necesitas aplicar reglas de negocio complejas
- Cuando necesitas coordinar entre múltiples repositorios

**Ejemplo**:

```typescript
// modules/tasks/services/TaskService.ts
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private houseRepository: HouseRepository,
  ) {}

  async createTask(params: CreateTaskParams): Promise<Task> {
    const house = await this.houseRepository.findById(params.houseId);
    if (!house) {
      throw new DomainError(ERROR_CODES.HOUSE.NOT_FOUND);
    }
    return this.taskRepository.create(params);
  }
}
```

### Repositories (Repositorios)

**¿Qué son?**
Los repositorios son la capa de infraestructura que maneja el acceso a datos. Implementan las interfaces definidas en el dominio.

**Ubicación**: `src/modules/{module}/repositories/`

**Responsabilidades**:

- Implementar acceso a datos (Supabase, APIs, etc.)
- Transformar entre modelos de dominio y modelos de base de datos
- Manejar errores técnicos y transformarlos a códigos de dominio
- NO deben contener lógica de negocio
- NO deben contener lógica de UI
- Deben implementar interfaces del dominio

**Cuándo crear un repositorio**:

- Cuando necesitas acceder a datos de Supabase
- Cuando necesitas abstraer el acceso a datos
- Cuando quieres hacer el código testeable (puedes mockear repositorios)

**Ejemplo**:

```typescript
// modules/tasks/repositories/TaskRepository.ts
export class TaskRepository implements TaskRepositoryInterface {
  async findById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw transformSupabaseError(error);
    }

    return data ? mapSupabaseTaskToDomain(data) : null;
  }
}
```

### Constants (Constantes)

**¿Qué son?**
Las constantes son valores que no cambian durante la ejecución de la aplicación. Incluyen strings, números, y configuraciones.

**Ubicación**:

- `src/modules/{module}/constants/` - Constantes específicas de un módulo
- `src/shared/constants/` - Constantes compartidas

**Responsabilidades**:

- Definir todos los valores literales (NO magic strings/numbers)
- Agrupar constantes relacionadas
- Facilitar mantenimiento y cambios
- Preparar para i18n (internacionalización)
- NO deben contener lógica
- NO deben contener funciones

**Cuándo crear constantes**:

- Cuando usas el mismo string/número en múltiples lugares
- Cuando quieres evitar "magic strings/numbers" en el código
- Cuando necesitas valores configurables

**Ejemplo**:

```typescript
// modules/tasks/constants/tasks.constants.ts
export const TASK_CONSTANTS = {
  DEFAULT_POINTS_ON_TIME: 10,
  DEFAULT_POINTS_EXTENDED: 5,
  MAX_TITLE_LENGTH: 100,
} as const;

export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;
```

### Types (Tipos)

**¿Qué son?**
Los tipos definen la estructura de datos en TypeScript. Ayudan a prevenir errores y hacen el código más legible.

**Ubicación**:

- `src/modules/{module}/types/` - Tipos específicos de un módulo
- `src/shared/types/` - Tipos compartidos

**Responsabilidades**:

- Definir interfaces y tipos TypeScript
- Tipar props de componentes
- Tipar parámetros de funciones
- Tipar respuestas de APIs
- NO deben contener lógica
- NO deben contener valores

**Cuándo crear tipos**:

- Cuando defines la estructura de un objeto
- Cuando quieres tipar props de componentes
- Cuando quieres tipar datos de APIs
- Cuando quieres hacer el código más seguro y legible

**Ejemplo**:

```typescript
// modules/tasks/types/tasks.types.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
}

export interface TaskCardProps {
  task: Task;
  onPress: (taskId: string) => void;
}
```

### Coordinators (Coordinadores)

**¿Qué son?**
Los coordinadores abstraen la navegación. Encapsulan la lógica de navegación y facilitan el testing y cambios de librería de navegación.

**Ubicación**: `src/modules/{module}/coordinator/`

**Responsabilidades**:

- Abstraer navegación de la UI
- Encapsular lógica de navegación
- Facilitar testing (puedes mockear navegación)
- Facilitar cambios de librería de navegación
- NO deben contener lógica de negocio
- NO deben contener lógica de UI

**Cuándo crear un coordinador**:

- Cuando necesitas navegar entre pantallas
- Cuando quieres abstraer la navegación
- Cuando quieres hacer el código más testeable

**Ejemplo**:

```typescript
// modules/tasks/coordinator/TasksCoordinator.ts
export class TasksCoordinator {
  static navigateToTaskDetail(taskId: string) {
    router.push(`/tasks/${taskId}`);
  }

  static navigateToCreateTask() {
    router.push('/tasks/create');
  }
}
```

### Domain (Dominio)

**¿Qué son?**
El dominio contiene la lógica de negocio pura, independiente de frameworks y tecnologías. Es el "corazón" de la aplicación.

**Ubicación**: `src/modules/{module}/domain/`

**Responsabilidades**:

- Definir entidades del dominio (tipos puros)
- Definir reglas de negocio
- Definir validaciones de dominio
- Definir interfaces de repositorios (NO implementaciones)
- NO debe depender de frameworks
- NO debe contener lógica de UI
- NO debe contener lógica de infraestructura

**Estructura del Domain**:

```
domain/
├── entities/          # Entidades del dominio (Task, House, User)
├── repositories/      # Interfaces de repositorios
└── validators/        # Validadores de negocio (esquemas Zod)
```

**Cuándo crear algo en domain**:

- Cuando defines una entidad de negocio
- Cuando defines reglas de negocio
- Cuando defines interfaces de repositorios
- Cuando defines validaciones de dominio

**Ejemplo**:

```typescript
// modules/tasks/domain/entities/Task.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
}

// modules/tasks/domain/repositories/TaskRepository.interface.ts
export interface TaskRepository {
  findById(id: string): Promise<Task | null>;
  create(task: CreateTaskParams): Promise<Task>;
}
```

## Estructura de Directorios

```
src/
├── app/                   # Expo Router - Configuración de rutas
├── lib/                   # Configuración y utilidades compartidas
│   ├── queryClient.ts     # Configuración avanzada de React Query
│   └── supabase.ts        # Cliente de Supabase
├── locale/                # Internacionalización (i18n)
│   ├── i18n.ts           # Configuración de i18n (native)
│   ├── i18n.web.ts        # Configuración de i18n (web)
│   ├── i18nProvider.tsx   # Provider de i18n
│   ├── helpers.ts         # Helpers de localización
│   ├── deviceLocales.ts   # Detección de idioma del dispositivo
│   ├── languages.ts       # Definición de idiomas soportados
│   └── locales/           # Archivos de traducción
│       ├── es/
│       │   └── messages.po # Mensajes en español
│       └── en/
│           └── messages.po # Mensajes en inglés
├── modules/               # Módulos de funcionalidad (feature-based)
│   ├── auth/              # Autenticación (login, registro, sesión)
│   ├── account/           # Gestión de cuenta de usuario
│   ├── house/             # Gestión de casas
│   ├── tasks/             # Gestión de tareas
│   ├── rooms/             # Gestión de habitaciones
│   ├── occupants/         # Gestión de ocupantes
│   ├── scores/            # Sistema de puntuación
│   └── invitations/       # Sistema de invitaciones
├── shared/                # Código compartido entre módulos
│   ├── components/        # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorScreen.tsx
│   │   └── README.md      # Catálogo de componentes
│   ├── hooks/             # Hooks reutilizables
│   │   ├── useAuthSession.ts
│   │   ├── useErrorHandler.ts
│   │   ├── useNetworkStatus.ts
│   │   └── useLanguagePrefs.ts
│   ├── logger/            # Sistema de logging
│   │   ├── index.ts       # Exportación principal
│   │   ├── Logger.ts      # Clase Logger
│   │   ├── transports/    # Transports (consola, archivo)
│   │   └── types.ts        # Tipos del logger
│   ├── storage/           # Storage persistente tipado
│   │   ├── index.ts       # Clase Storage y exportaciones
│   │   ├── schema.ts      # Schemas TypeScript
│   │   └── hooks/
│   │       └── useStorage.ts
│   ├── types/             # Tipos compartidos
│   │   └── errors.types.ts # Tipos de códigos de error
│   ├── constants/         # Constantes compartidas
│   │   └── errorMessages.ts # Mensajes de error
│   ├── utils/             # Utilidades compartidas
│   │   ├── errorTransformers.ts # Transformadores de errores
│   │   ├── sanitize.ts    # Sanitización de inputs
│   │   ├── retryWithBackoff.ts # Retry con backoff
│   │   └── rateLimiter.ts # Rate limiting
│   └── styles/            # Estilos compartidos
└── store/                 # Stores globales de UI (Zustand)
    ├── ui.store.ts        # Estado global de UI
    └── modals.store.ts    # Estado de modales
```

## Arquitectura por Capas

### 1. Domain Layer (Lógica de Negocio)

**Ubicación**: `src/modules/{module}/domain/`

**Responsabilidades**:

- Entidades del dominio (tipos TypeScript puros)
- Reglas de negocio
- Validaciones de dominio
- Interfaces de repositorios (no implementaciones)

**Estructura**:

```
modules/{module}/
└── domain/
    ├── entities/          # Entidades del dominio
    ├── repositories/      # Interfaces de repositorios
    └── validators/        # Validadores de negocio
```

**Ejemplo**:

```typescript
// modules/tasks/domain/entities/Task.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  roomId: string | null;
  houseId: string;
  assignedTo: string[];
  requiresValidation: boolean;
  pointsOnTime: number;
  pointsExtended: number;
  pointsNotCompleted: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Application Layer (Casos de Uso)

**Ubicación**: `src/modules/{module}/services/`

**Responsabilidades**:

- Lógica de aplicación y orquestación
- Coordinación entre repositorios
- Transformación de datos entre capas
- Validación de casos de uso

**Estructura**:

```
modules/{module}/
└── services/
    ├── {module}Service.ts        # Servicio principal
    └── {module}Mutations.ts      # Mutaciones (crear, actualizar, eliminar)
```

**Patrones**:

- Los servicios NO deben contener lógica de UI
- Los servicios deben usar repositorios, no acceso directo a Supabase
- Cada servicio debe tener responsabilidad única

**Ejemplo**:

```typescript
// modules/tasks/services/TaskService.ts
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private houseRepository: HouseRepository,
  ) {}

  async createTask(params: CreateTaskParams): Promise<Task> {
    const house = await this.houseRepository.findById(params.houseId);
    if (!house) {
      throw new Error('HOUSE_NOT_FOUND');
    }
    return this.taskRepository.create(params);
  }
}
```

### 3. Infrastructure Layer (Implementaciones)

**Ubicación**: `src/modules/{module}/repositories/`

**Responsabilidades**:

- Implementación de repositorios usando Supabase
- Acceso a datos
- Transformación entre modelos de dominio y modelos de base de datos
- Manejo de errores de infraestructura

**Estructura**:

```
modules/{module}/
└── repositories/
    └── {module}Repository.ts     # Implementación del repositorio
```

**Patrones**:

- Los repositorios implementan interfaces del dominio
- Mapean entre modelos de Supabase y entidades del dominio
- Manejan errores de red/base de datos

### 4. Presentation Layer (UI)

**Ubicación**: `src/modules/{module}/`

**Responsabilidades**:

- Componentes React
- Pantallas (Screens)
- Hooks personalizados para UI
- Coordinadores de navegación
- Stores de UI (Zustand)

**Estructura Completa de un Módulo**:

```
modules/{module}/
├── components/           # Componentes específicos del módulo
│   └── {Component}/
│       ├── index.tsx
│       └── styles.ts
├── screens/              # Pantallas del módulo
│   └── {Screen}Screen/
│       ├── index.tsx
│       └── styles.ts
├── hooks/                # Hooks personalizados
│   ├── use{Entity}List.ts
│   ├── use{Entity}Detail.ts
│   └── use{Entity}Mutations.ts
├── coordinator/          # Coordinador de navegación
│   └── {Module}Coordinator.ts
├── store/                # Store de UI (Zustand)
│   └── {module}Ui.store.ts
├── types/                 # Tipos específicos del módulo
│   └── {module}.types.ts
├── constants/             # Constantes del módulo
│   └── {module}.constants.ts
├── utils/                 # Utilidades del módulo
│   ├── {module}Filters.ts
│   └── {module}Mappers.ts
├── services/              # Servicios de aplicación
│   └── {module}Service.ts
├── repositories/          # Repositorios (infraestructura)
│   └── {module}Repository.ts
└── domain/                # Lógica de dominio
    ├── entities/
    ├── repositories/
    └── validators/
```

## Detalle de Capas de Presentación

### Components

**Responsabilidades**:

- Componentes reutilizables dentro del módulo
- Componentes que encapsulan lógica de presentación específica
- NO deben contener lógica de negocio
- Deben recibir datos ya procesados vía props

**Estructura con subcarpetas (obligatoria)**:

- Cada componente debe tener su propia subcarpeta
- Estructura: `ComponentName/index.tsx` y `ComponentName/styles.ts`
- El archivo principal se llama `index.tsx` para facilitar imports
- El archivo de estilos se llama `styles.ts` (sin prefijo del componente, ya que está encapsulado)

**Convenciones**:

- Nombres en PascalCase
- Props tipadas con interfaces TypeScript
- **Estilos SIEMPRE en archivos separados** (ver sección "Estilos")
- Componentes deben ser funcionales (no clases)

**Regla importante**:

- Si un componente necesita otros componentes, deben importarse de:
  - `components/` del módulo correspondiente
  - `@shared/components/`
- NO crear componentes internos dentro de la subcarpeta del componente

**Ejemplo**:

```typescript
// modules/tasks/components/TaskCard/index.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@shared/components/Button';
import { styles } from './styles';

interface TaskCardProps {
  task: Task;
  onPress: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onComplete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Button title="Completar" onPress={() => onComplete(task.id)} />
    </View>
  );
};
```

```typescript
// modules/tasks/components/TaskCard/styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### Screens

**Responsabilidades**:

- Pantallas completas de la aplicación
- Orquestación de componentes
- Manejo de estados de carga y error
- Integración con hooks de datos

**Estructura con subcarpetas (obligatoria)**:

- Cada screen debe tener su propia subcarpeta
- Estructura: `ScreenName/index.tsx` y `ScreenName/styles.ts`
- El archivo principal se llama `index.tsx` para facilitar imports
- El archivo de estilos se llama `styles.ts` (sin prefijo del screen, ya que está encapsulado)

**Convenciones**:

- Nombres terminan en "Screen"
- Usan hooks personalizados para obtener datos
- Manejan estados de loading, error y success
- Usan coordinadores para navegación

**Regla importante**:

- Si una screen necesita otros componentes, deben importarse de:
  - `components/` del módulo correspondiente
  - `@shared/components/`
- NO crear componentes internos dentro de la subcarpeta del screen

**Ejemplo**:

```typescript
// modules/tasks/screens/TasksListScreen/index.tsx
import React from 'react';
import { View } from 'react-native';
import { useTasksList } from '../../hooks/useTasksList';
import { TasksCoordinator } from '../../coordinator/TasksCoordinator';
import { TaskCard } from '../../components/TaskCard';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { ErrorScreen } from '@shared/components/ErrorScreen';
import { styles } from './styles';

export const TasksListScreen: React.FC = () => {
  const { data: tasks, isLoading, error } = useTasksList();
  const coordinator = TasksCoordinator;

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <View style={styles.container}>
      {tasks?.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </View>
  );
};
```

```typescript
// modules/tasks/screens/TasksListScreen/styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### Hooks

**Responsabilidades**:

- Abstracción de lógica de datos usando React Query
- Encapsulación de lógica de UI reutilizable
- Transformación de datos para presentación

**Tipos de Hooks**:

1. **Data Hooks** (React Query):
   - `use{Entity}List`: Obtener listas
   - `use{Entity}Detail`: Obtener detalle
   - `use{Entity}Mutations`: Mutaciones (create, update, delete)

2. **UI Hooks**:
   - Hooks para manejar estado de UI local
   - Hooks para interacciones de usuario

**Convenciones**:

- Nombres empiezan con "use"
- Data hooks usan React Query
- Retornan objetos con `data`, `isLoading`, `error`, `mutate`, etc.

**Ejemplo**:

```typescript
// modules/tasks/hooks/useTasksList.ts
const RQKEY_ROOT = 'tasks';
export const RQKEY = (houseId: string) => [RQKEY_ROOT, 'list', houseId];

export const useTasksList = (houseId: string) => {
  return useQuery({
    queryKey: RQKEY(houseId),
    queryFn: () => taskService.getByHouseId(houseId),
    enabled: !!houseId,
  });
};
```

### Coordinators

**Responsabilidades**:

- Abstracción de navegación
- Encapsulación de lógica de navegación
- Facilita testing y cambios de librería de navegación

**Convenciones**:

- Un coordinador por módulo
- Métodos descriptivos para navegar
- No expone detalles de implementación de navegación

**Ejemplo**:

```typescript
// modules/tasks/coordinator/TasksCoordinator.ts
export class TasksCoordinator {
  constructor(private navigation: NavigationProp) {}

  navigateToTaskDetail = (taskId: string) => {
    this.navigation.navigate('TaskDetail', { taskId });
  };

  navigateToCreateTask = () => {
    this.navigation.navigate('CreateTask');
  };
}
```

### Stores (Zustand)

**Responsabilidades**:

- Estado de UI global o por módulo
- Estado que no proviene del servidor
- Estado de formularios complejos
- Preferencias de UI

**Convenciones**:

- Un store por módulo para UI específica
- Store global solo para UI compartida
- NO usar para estado del servidor (usar React Query)

**Ejemplo**:

```typescript
// modules/tasks/store/tasksUi.store.ts
interface TasksUiState {
  selectedFilter: TaskFilter;
  showCompleted: boolean;
  setSelectedFilter: (filter: TaskFilter) => void;
  toggleShowCompleted: () => void;
}

export const useTasksUiStore = create<TasksUiState>(set => ({
  selectedFilter: TaskFilter.ALL,
  showCompleted: false,
  setSelectedFilter: filter => set({ selectedFilter: filter }),
  toggleShowCompleted: () => set(state => ({ showCompleted: !state.showCompleted })),
}));
```

### Types

**Responsabilidades**:

- Definición de tipos TypeScript específicos del módulo
- Tipos de props de componentes
- Tipos de parámetros de funciones
- Tipos de respuesta de APIs

**Convenciones**:

- Un archivo principal `{module}.types.ts`
- Tipos exportados con nombres descriptivos
- Interfaces para objetos, types para uniones

### Constants

**Responsabilidades**:

- Todas las constantes del módulo
- Strings que se usan en múltiples lugares
- Números mágicos
- Enums y valores constantes

**Convenciones**:

- NO magic strings/numbers en el código
- Todo valor literal debe estar aquí
- Agrupados por categoría

**Ejemplo**:

```typescript
// modules/tasks/constants/tasks.constants.ts
export const TASK_CONSTANTS = {
  DEFAULT_POINTS_ON_TIME: 10,
  DEFAULT_POINTS_EXTENDED: 5,
  DEFAULT_POINTS_NOT_COMPLETED: -5,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;

export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  VALIDATED: 'validated',
  EXPIRED: 'expired',
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
```

### Utils

**Responsabilidades**:

- Funciones puras de utilidad
- Transformadores de datos
- Filtros
- Formateadores
- Validadores de presentación

**Convenciones**:

- Funciones puras (sin side effects)
- Fácilmente testeables
- Nombres descriptivos

**Ejemplo**:

```typescript
// modules/tasks/utils/tasksFilters.ts
export const filterTasksByRoom = (tasks: Task[], roomId: string | null): Task[] => {
  if (roomId === null) {
    return tasks.filter(task => task.roomId === null);
  }
  return tasks.filter(task => task.roomId === roomId);
};

export const filterTasksByStatus = (tasks: Task[], status: TaskStatus): Task[] => {
  return tasks.filter(task => task.status === status);
};
```

## Shared (Código Compartido)

### Shared Components

**Ubicación**: `src/shared/components/`

**Responsabilidades**:

- Componentes reutilizables entre múltiples módulos
- Componentes de UI base (Button, Input, Card, etc.)
- Componentes de layout

**Componentes Disponibles**:

- **`Button`**: Botón con variantes (solid, outline, ghost) y colores (primary, secondary, danger)
- **`Input`**: Campo de texto con label y manejo de errores
- **`ErrorBoundary`**: Boundary para capturar errores de React
- **`ErrorScreen`**: Pantalla de error con opción de reintentar
- **`Divider`**: Separador visual
- **`LoadingSpinner`**: Indicador de carga
- **`Skeleton`**: Componentes skeleton para loading states (SkeletonText, SkeletonCircle, SkeletonPill)
- **`Card`**: Contenedor con sombra
- **`Toast`**: Sistema de notificaciones toast con tipos (default, success, error, warning, info)

**Importación**:

```typescript
import {
  Button,
  Input,
  ErrorBoundary,
  ErrorScreen,
  Divider,
  LoadingSpinner,
  SkeletonText,
  Card,
  ToastContainer,
  showToast,
} from '@shared/components';
```

### Documentación de Componentes Compartidos

Todos los componentes compartidos deben estar documentados con:

1. **Props y tipos**: Todas las props deben estar tipadas y documentadas
2. **Ejemplos de uso**: Incluir ejemplos en comentarios o README
3. **Variantes**: Documentar todas las variantes disponibles
4. **Accesibilidad**: Documentar características de accesibilidad

**Estructura de Documentación**:

````typescript
// shared/components/Button.tsx
/**
 * Button - Componente de botón reutilizable
 *
 * @example
 * ```tsx
 * <Button
 *   title="Guardar"
 *   onPress={handleSave}
 *   variant="primary"
 *   size="medium"
 * />
 * ```
 *
 * @variants
 * - primary: Botón principal (azul)
 * - secondary: Botón secundario (gris)
 * - danger: Botón de acción destructiva (rojo)
 *
 * @sizes
 * - small: 32px de altura
 * - medium: 44px de altura (default)
 * - large: 56px de altura
 */
interface ButtonProps {
  /** Texto del botón */
  title: string;
  /** Función llamada al presionar */
  onPress: () => void;
  /** Variante visual del botón */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Tamaño del botón */
  size?: 'small' | 'medium' | 'large';
  /** Deshabilitado */
  disabled?: boolean;
  /** Label de accesibilidad (por defecto usa title) */
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // ...
};
````

**README de Componentes**:

Cada componente complejo debe tener un README:

````markdown
# Button Component

Componente de botón reutilizable con múltiples variantes y tamaños.

## Props

| Prop    | Tipo                                 | Default   | Descripción          |
| ------- | ------------------------------------ | --------- | -------------------- |
| title   | string                               | -         | Texto del botón      |
| onPress | () => void                           | -         | Función al presionar |
| variant | 'primary' \| 'secondary' \| 'danger' | 'primary' | Variante visual      |
| size    | 'small' \| 'medium' \| 'large'       | 'medium'  | Tamaño del botón     |

## Ejemplos

### Botón Primario

```tsx
<Button title="Guardar" onPress={handleSave} />
```
````

### Botón Secundario

```tsx
<Button title="Cancelar" onPress={handleCancel} variant="secondary" />
```

### Botón Deshabilitado

```tsx
<Button title="Guardar" onPress={handleSave} disabled={!isValid} />
```

## Accesibilidad

- Soporta `accessibilityLabel` personalizado
- Role: `button`
- Estado accesible: `disabled`

````

**Catálogo de Componentes**:

Mantener un archivo `shared/components/README.md` con lista de todos los componentes:

```markdown
# Componentes Compartidos

## Componentes Base

- **Button**: Botón reutilizable con variantes
- **Input**: Campo de texto con validación
- **Card**: Contenedor de contenido con sombra
- **Modal**: Modal reutilizable
- **LoadingSpinner**: Indicador de carga

## Componentes de Layout

- **Screen**: Contenedor de pantalla completa
- **Header**: Header de pantalla
- **Content**: Contenedor de contenido con scroll

## Componentes de Formulario

- **TextField**: Campo de texto con label y error
- **Select**: Selector desplegable
- **Checkbox**: Checkbox con label
- **Switch**: Toggle switch
````

### Convenciones de Documentación

- **JSDoc en componentes**: Usar JSDoc para documentar props y ejemplos
- **README para componentes complejos**: Componentes con > 5 props deben tener README
- **Ejemplos en código**: Incluir ejemplos de uso en comentarios
- **Tipos explícitos**: Todas las props deben estar tipadas
- **Accesibilidad documentada**: Documentar características a11y

### Shared Hooks

**Ubicación**: `src/shared/hooks/`

**Responsabilidades**:

- Hooks reutilizables entre módulos
- Hooks de utilidad general
- Hook de manejo de errores (`useErrorHandler.ts`) - Ver sección "Manejo de Errores"

**Hooks Disponibles**:

- **`useTimer`**: Timer con funciones de reset y cancel
- **`useDedupe`**: Deduplicación de llamadas con timeout configurable
- **`useGetTimeAgo`**: Formateo de fechas relativas (usa `date-fns`)
- **`useAppState`**: Estado de la app (foreground/background)
- **`useIsKeyboardVisible`**: Visibilidad del teclado
- **`useCleanError`**: Limpieza de mensajes de error para mostrar al usuario

**Importación**:

```typescript
import {
  useTimer,
  useDedupe,
  useGetTimeAgo,
  useAppState,
  useIsKeyboardVisible,
  useCleanError,
} from '@shared/hooks';
```

### Shared Types

**Ubicación**: `src/shared/types/`

**Responsabilidades**:

- Tipos compartidos entre módulos
- Tipos de configuración
- Tipos de utilidad
- Tipos de códigos de error (`errors.types.ts`)

### Shared Constants

**Ubicación**: `src/shared/constants/`

**Responsabilidades**:

- Constantes globales de la aplicación
- Configuraciones compartidas
- Mensajes de error (`errorMessages.ts`)

### Shared Utils

**Ubicación**: `src/shared/utils/`

**Responsabilidades**:

- Utilidades generales
- Helpers de formato
- Utilidades de validación general
- Transformadores de errores (`errorTransformers.ts`)

**Utilidades Disponibles**:

- **`enforceLen`**: Limitar longitud de strings con opción de ellipsis
- **`useEnforceMaxGraphemeCount`**: Hook para limitar conteo de grafemas (usa `graphemer`)
- **`countLines`**: Contar líneas en un string
- **`capitalize`**: Capitalizar primera letra de un string
- **`isValidDomain`**: Validar si un string es un dominio válido
- **`getHostnameFromUrl`**: Extraer hostname de una URL
- **`isRelativeUrl`**: Verificar si una URL es relativa
- **`isExternalUrl`**: Verificar si una URL es externa

**Importación**:

```typescript
import {
  enforceLen,
  useEnforceMaxGraphemeCount,
  countLines,
  capitalize,
  isValidDomain,
  getHostnameFromUrl,
  isRelativeUrl,
  isExternalUrl,
} from '@shared/utils';
```

## Storage Persistente Tipado

### Arquitectura del Storage

El sistema de storage proporciona almacenamiento persistente tipado con TypeScript, permitiendo scoping por dispositivo o cuenta.

**Ubicación**: `src/shared/storage/`

**Estructura**:

```
shared/storage/
├── index.ts              # Exportación principal y clase Storage
├── schema.ts             # Schemas TypeScript del storage
└── hooks/
    └── useStorage.ts     # Hook para usar storage en componentes
```

### Uso del Storage

**Importación**:

```typescript
import { device, account } from '@shared/storage';
```

**API del Storage**:

Cada instancia de Storage tiene la siguiente interfaz:

- `set([...scope, key], value)`: Almacenar un valor
- `get([...scope, key])`: Obtener un valor
- `remove([...scope, key])`: Eliminar un valor
- `removeMany([...scope], [...keys])`: Eliminar múltiples valores

### Storage por Dispositivo

El storage de dispositivo almacena datos específicos del dispositivo que no varían por cuenta:

```typescript
// shared/storage/schema.ts
export type Device = {
  appLanguage: 'es' | 'en';
  hasSeenOnboarding: boolean;
  lastSyncTimestamp: number | undefined;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notificationsEnabled: boolean;
  };
};

// Uso
import { device } from '@shared/storage';

device.set(['appLanguage'], 'es');
const language = device.get(['appLanguage']); // 'es' | 'en' | undefined

device.set(['preferences', 'theme'], 'dark');
const theme = device.get(['preferences', 'theme']);
```

### Storage por Cuenta

El storage de cuenta almacena datos específicos de cada usuario:

```typescript
// shared/storage/schema.ts
export type Account = {
  lastViewedHouseId: string | undefined;
  taskFilters: {
    showCompleted: boolean;
    selectedRoomId: string | null;
  };
  searchHistory: string[];
};

// Uso con scoping
import { account } from '@shared/storage';
import { useAuthSession } from '@shared/hooks/useAuthSession';

// En un componente o hook
export const useAccountStorage = () => {
  const { data: session } = useAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('User must be authenticated to use account storage');
  }

  return {
    setLastViewedHouseId: (houseId: string) => {
      account.set([userId, 'lastViewedHouseId'], houseId);
    },
    getLastViewedHouseId: (): string | undefined => {
      return account.get([userId, 'lastViewedHouseId']);
    },
    setTaskFilter: (filter: { showCompleted: boolean }) => {
      account.set([userId, 'taskFilters', 'showCompleted'], filter.showCompleted);
    },
    getTaskFilters: () => {
      return {
        showCompleted: account.get([userId, 'taskFilters', 'showCompleted']) ?? false,
      };
    },
  };
};
```

### Hook useStorage

Para usar storage en componentes React:

```typescript
// shared/storage/hooks/useStorage.ts
import { useState, useEffect, useCallback } from 'react';
import { Storage } from '@shared/storage';

export function useStorage<
  Store extends Storage<any, any>,
  Key extends keyof StorageSchema<Store>,
>(
  storage: Store,
  scopes: [...StorageScopes<Store>, Key],
): [StorageSchema<Store>[Key] | undefined, (data: StorageSchema<Store>[Key]) => void] {
  const [value, setValue] = useState<StorageSchema<Store>[Key] | undefined>(() =>
    storage.get(scopes),
  );

  useEffect(() => {
    const listener = storage.addOnValueChangedListener(scopes, () => {
      setValue(storage.get(scopes));
    });
    return () => listener.remove();
  }, [storage, scopes]);

  const setter = useCallback(
    (data: StorageSchema<Store>[Key]) => {
      setValue(data);
      storage.set(scopes, data);
    },
    [storage, scopes],
  );

  return [value, setter] as const;
}
```

**Uso en componentes**:

```typescript
// modules/tasks/components/TaskFilters.tsx
import { useStorage } from '@shared/storage';
import { device } from '@shared/storage';

export const TaskFilters: React.FC = () => {
  const [showCompleted, setShowCompleted] = useStorage(device, ['taskFilters', 'showCompleted']);

  return (
    <Switch
      value={showCompleted ?? false}
      onValueChange={setShowCompleted}
    />
  );
};
```

### Implementación de Storage

**Ejemplo de implementación con MMKV**:

```typescript
// shared/storage/index.ts
import { MMKV } from 'react-native-mmkv';

export class Storage<Scopes extends unknown[], Schema> {
  protected sep = ':';
  protected store: MMKV;
  private listeners = new Map<string, Set<() => void>>();

  constructor({ id }: { id: string }) {
    this.store = new MMKV({ id });
  }

  set<Key extends keyof Schema>(scopes: [...Scopes, Key], data: Schema[Key]): void {
    this.store.set(scopes.join(this.sep), JSON.stringify({ data }));
    this.notifyListeners(scopes);
  }

  get<Key extends keyof Schema>(scopes: [...Scopes, Key]): Schema[Key] | undefined {
    const value = this.store.getString(scopes.join(this.sep));
    if (!value) return undefined;
    try {
      const parsed = JSON.parse(value);
      return parsed.data;
    } catch {
      return undefined;
    }
  }

  remove<Key extends keyof Schema>(scopes: [...Scopes, Key]): void {
    this.store.delete(scopes.join(this.sep));
    this.notifyListeners(scopes);
  }

  removeMany(scopes: Scopes, keys: (keyof Schema)[]): void {
    keys.forEach(key => {
      this.remove([...scopes, key] as any);
    });
  }

  addOnValueChangedListener<Key extends keyof Schema>(
    scopes: [...Scopes, Key],
    callback: () => void,
  ): { remove: () => void } {
    const key = scopes.join(this.sep);

    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    this.listeners.get(key)!.add(callback);

    return {
      remove: () => {
        const callbacks = this.listeners.get(key);
        if (callbacks) {
          callbacks.delete(callback);
          if (callbacks.size === 0) {
            this.listeners.delete(key);
          }
        }
      },
    };
  }

  private notifyListeners<Key extends keyof Schema>(scopes: [...Scopes, Key]): void {
    const key = scopes.join(this.sep);
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  }
}

// Instancias exportadas
export const device = new Storage<[], DeviceSchema>({ id: 'device' });
export const account = new Storage<[string], AccountSchema>({ id: 'account' });
```

### Convenciones

- **Schemas tipados**: Todos los schemas deben estar en `schema.ts`
- **Scoping apropiado**: Usar `device` para datos del dispositivo, `account` para datos por usuario
- **No datos sensibles**: Nunca almacenar contraseñas o tokens en storage local
- **Migraciones**: Si cambias un schema, implementa migración de datos

## Gestión de Estado

### Estado del Servidor (React Query)

**Cuándo usar**:

- Datos que vienen de Supabase
- Datos que necesitan caché
- Datos que necesitan sincronización
- Mutaciones (create, update, delete)

**Patrones**:

- Un hook por query/mutation
- Query keys consistentes y descriptivos
- Invalidación de queries después de mutaciones
- Optimistic updates cuando sea apropiado

### Estado de UI (Zustand)

**Cuándo usar**:

- Estado de UI que no viene del servidor
- Preferencias de usuario (UI)
- Estado de formularios complejos
- Estado de modales/dialogs
- Filtros y búsquedas locales

**Cuándo NO usar**:

- Datos del servidor (usar React Query)
- Estado local simple (usar useState)
- Estado de navegación (usar React Navigation)

### Gestión de Estado de UI Detallada

#### Cuándo Usar Context API vs Zustand

**Context API** se usa para:

- Estado que necesita ser accesible en toda la app (providers)
- Estado que cambia raramente (theme, language)
- Estado que necesita múltiples consumers

**Zustand** se usa para:

- Estado de UI que se actualiza frecuentemente
- Estado que necesita persistencia
- Estado que necesita selectores optimizados
- Estado de módulos específicos

**Ejemplo de Context API**:

```typescript
// shared/providers/ThemeProvider.tsx
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}>({
  theme: 'light',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

**Ejemplo de Zustand**:

```typescript
// modules/tasks/store/tasksUi.store.ts
interface TasksUiState {
  selectedFilter: TaskFilter;
  showCompleted: boolean;
  searchQuery: string;
  setSelectedFilter: (filter: TaskFilter) => void;
  toggleShowCompleted: () => void;
  setSearchQuery: (query: string) => void;
}

export const useTasksUiStore = create<TasksUiState>(set => ({
  selectedFilter: TaskFilter.ALL,
  showCompleted: false,
  searchQuery: '',
  setSelectedFilter: filter => set({ selectedFilter: filter }),
  toggleShowCompleted: () => set(state => ({ showCompleted: !state.showCompleted })),
  setSearchQuery: query => set({ searchQuery: query }),
}));
```

#### Estado de Formularios Complejos

**Para formularios simples**: Usar `useState`

```typescript
// Formulario simple
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```

**Para formularios complejos**: Usar Zustand o `useReducer`

```typescript
// modules/auth/store/loginForm.store.ts
interface LoginFormState {
  email: string;
  password: string;
  errors: {
    email?: string;
    password?: string;
  };
  touched: {
    email: boolean;
    password: boolean;
  };
  setField: (field: 'email' | 'password', value: string) => void;
  setError: (field: 'email' | 'password', error: string | undefined) => void;
  setTouched: (field: 'email' | 'password') => void;
  reset: () => void;
}

export const useLoginFormStore = create<LoginFormState>(set => ({
  email: '',
  password: '',
  errors: {},
  touched: {},
  setField: (field, value) => set(state => ({ [field]: value })),
  setError: (field, error) =>
    set(state => ({
      errors: { ...state.errors, [field]: error },
    })),
  setTouched: field =>
    set(state => ({
      touched: { ...state.touched, [field]: true },
    })),
  reset: () =>
    set({
      email: '',
      password: '',
      errors: {},
      touched: {},
    }),
}));
```

#### Estado de Modales/Dialogs

**Store global de modales**:

```typescript
// src/store/modals.store.ts
type ModalType = 'task-detail' | 'create-task' | 'confirm-delete' | null;

interface ModalsState {
  currentModal: ModalType;
  modalProps: Record<string, unknown>;
  openModal: (type: ModalType, props?: Record<string, unknown>) => void;
  closeModal: () => void;
}

export const useModalsStore = create<ModalsState>(set => ({
  currentModal: null,
  modalProps: {},
  openModal: (type, props = {}) => set({ currentModal: type, modalProps: props }),
  closeModal: () => set({ currentModal: null, modalProps: {} }),
}));
```

**Uso**:

```typescript
// modules/tasks/components/TaskCard.tsx
import { useModalsStore } from '@store/modals.store';

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const openModal = useModalsStore(state => state.openModal);

  const handlePress = () => {
    openModal('task-detail', { taskId: task.id });
  };

  return <TouchableOpacity onPress={handlePress}>...</TouchableOpacity>;
};
```

#### Estado de Navegación

**NO usar Zustand para navegación**: Usar Expo Router directamente

```typescript
// ❌ MAL - No usar Zustand para navegación
const useNavigationStore = create({
  currentRoute: '/tasks',
  navigate: (route: string) => set({ currentRoute: route }),
});

// ✅ BIEN - Usar Expo Router
import { router } from 'expo-router';

router.push('/tasks');
```

#### Sincronización de Estado entre Tabs (Web)

Para sincronizar estado entre múltiples tabs en web:

```typescript
// shared/storage/syncStorage.ts
import { BroadcastChannel } from 'broadcast-channel';

const channel = new BroadcastChannel('app-state');

export function syncStore<T>(store: Store<T>, key: string): void {
  // Escuchar cambios de otros tabs
  channel.onmessage = (event: { key: string; state: T }) => {
    if (event.key === key) {
      store.setState(event.state);
    }
  };

  // Enviar cambios a otros tabs
  const originalSetState = store.setState;
  store.setState = (state: T) => {
    originalSetState(state);
    channel.postMessage({ key, state });
  };
}
```

#### Selectores Optimizados

**Usar selectores para evitar re-renders innecesarios**:

```typescript
// ❌ MAL - Re-renderiza cuando cualquier parte del store cambia
const { selectedFilter, showCompleted } = useTasksUiStore();

// ✅ BIEN - Solo re-renderiza cuando selectedFilter cambia
const selectedFilter = useTasksUiStore(state => state.selectedFilter);
const showCompleted = useTasksUiStore(state => state.showCompleted);

// ✅ MEJOR - Selector combinado
const filters = useTasksUiStore(state => ({
  selectedFilter: state.selectedFilter,
  showCompleted: state.showCompleted,
}));
```

#### Persistencia de Estado de UI

**Persistir estado de UI importante**:

```typescript
// modules/tasks/store/tasksUi.store.ts
import { persist } from 'zustand/middleware';
import { device } from '@shared/storage';

// Crear un adaptador de storage para Zustand
const zustandStorage = {
  getItem: (name: string): string | null => {
    const value = device.get([name as any]);
    return value ? JSON.stringify(value) : null;
  },
  setItem: (name: string, value: string): void => {
    try {
      const parsed = JSON.parse(value);
      device.set([name as any], parsed);
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  },
  removeItem: (name: string): void => {
    device.remove([name as any]);
  },
};

export const useTasksUiStore = create<TasksUiState>()(
  persist(
    set => ({
      selectedFilter: TaskFilter.ALL,
      showCompleted: false,
      setSelectedFilter: filter => set({ selectedFilter: filter }),
      toggleShowCompleted: () => set(state => ({ showCompleted: !state.showCompleted })),
    }),
    {
      name: 'tasks-ui',
      storage: zustandStorage,
      partialize: state => ({
        selectedFilter: state.selectedFilter,
        showCompleted: state.showCompleted,
      }),
    },
  ),
);
```

### Convenciones

- **Context API para providers**: Usar Context para estado global de providers
- **Zustand para UI frecuente**: Usar Zustand para estado que cambia frecuentemente
- **Selectores optimizados**: Usar selectores para evitar re-renders
- **Persistencia selectiva**: Solo persistir estado importante
- **NO Zustand para navegación**: Usar Expo Router directamente
- **Formularios complejos**: Usar Zustand o useReducer para formularios con > 5 campos

## Autenticación y Sesión

### Estado de Autenticación Global

**Principio**: El estado de autenticación proviene del servidor (Supabase), por lo tanto debe manejarse con React Query, NO con Zustand.

**Implementación**:

- Hook `useAuthSession()` que consulta `supabase.auth.getSession()`
- Query key: `['auth', 'session']`
- Store de Zustand solo para UI relacionada (ej: mostrar modal de login, estado de formulario)

**Ejemplo de Hook de Sesión**:

```typescript
// src/shared/hooks/useAuthSession.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@lib/supabase';

const RQKEY_ROOT = 'auth';
export const RQKEY_SESSION = [RQKEY_ROOT, 'session'];

export const useAuthSession = () => {
  return useQuery({
    queryKey: RQKEY_SESSION,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: Infinity,
    retry: false,
  });
};
```

### Persistencia de Sesión

**Supabase maneja automáticamente la persistencia**:

- Los tokens se almacenan automáticamente en AsyncStorage (React Native)
- No es necesario manejar manualmente el almacenamiento de tokens
- La sesión se restaura automáticamente al iniciar la app

**Escucha de cambios de autenticación**:

- Usar `supabase.auth.onAuthStateChange()` en `AppProviders` o en un hook dedicado
- Invalidar la query de sesión cuando cambie el estado de autenticación
- Actualizar React Query cuando el usuario inicie/cierre sesión

**Ejemplo de Listener de Autenticación**:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { queryClient } from '@lib/queryClient';
import { RQKEY_SESSION } from '@shared/hooks/useAuthSession';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

supabase.auth.onAuthStateChange((event, session) => {
  queryClient.setQueryData(RQKEY_SESSION, session);

  if (event === 'SIGNED_OUT') {
    queryClient.clear();
  }
});
```

**Inicialización de Sesión en AppProviders**:

La sesión debe inicializarse al arrancar la aplicación para evitar flashes de pantalla de login:

```typescript
// src/AppProviders.tsx
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabase';
import { RQKEY_SESSION } from '@shared/hooks/useAuthSession';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      queryClient.setQueryData(RQKEY_SESSION, data.session);
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

### Protección de Rutas

**Implementación con Expo Router**:

- Crear layout protegido que verifique autenticación
- Redirigir a `/account/auth` si no hay sesión activa
- Usar `useAuthSession()` para verificar estado de autenticación

**Estructura de Rutas Protegidas**:

```
app/
├── _layout.tsx              # Layout raíz
├── (auth)/                  # Rutas públicas (login, registro)
│   └── account/
│       └── auth.tsx
└── (tabs)/                  # Rutas protegidas
    ├── _layout.tsx          # Layout protegido
    └── ...
```

**Ejemplo de Layout Protegido**:

```typescript
// app/(tabs)/_layout.tsx
import { Redirect } from 'expo-router';
import { useAuthSession } from '@shared/hooks/useAuthSession';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';

export default function ProtectedLayout() {
  const { data: session, isLoading } = useAuthSession();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <Redirect href="/account/auth" />;
  }

  return <Stack />;
}
```

### Módulo Auth

**Estructura completa del módulo de autenticación**:

```
modules/auth/
├── components/
│   ├── LoginForm.tsx
│   └── SignUpForm.tsx
├── screens/
│   ├── LoginScreen.tsx
│   └── SignUpScreen.tsx
├── hooks/
│   ├── useLogin.ts              # Hook de mutación para login
│   └── useSignUp.ts             # Hook de mutación para registro
│   # Nota: useAuthSession está en shared/hooks/useAuthSession.ts
├── coordinator/
│   └── AuthCoordinator.ts
├── services/
│   └── AuthService.ts
├── repositories/
│   └── AuthRepository.ts
├── domain/
│   ├── entities/
│   │   └── User.ts
│   ├── repositories/
│   │   └── AuthRepository.interface.ts
│   └── validators/
│       ├── login.validator.ts
│       └── signUp.validator.ts
├── types/
│   └── auth.types.ts
└── constants/
    └── auth.constants.ts
```

**Flujo Completo de Login**:

1. **Screen** (`LoginScreen.tsx`):
   - Renderiza `LoginForm`
   - Maneja estados de loading/error
   - Usa `useLogin()` hook

2. **Hook** (`useLogin.ts`):
   - Usa React Query mutation
   - Llama a `AuthService.login()`
   - Invalida query de sesión al éxito
   - Navega usando `AuthCoordinator`

3. **Service** (`AuthService.ts`):
   - Valida input con esquema Zod
   - Llama a `AuthRepository.login()`
   - Transforma respuesta de Supabase a entidad de dominio

4. **Repository** (`AuthRepository.ts`):
   - Implementa `AuthRepository.interface`
   - Usa `supabase.auth.signInWithPassword()`
   - Maneja errores de Supabase
   - Transforma errores técnicos a códigos de error del dominio

**Ejemplo de Implementación Completa**:

```typescript
// modules/auth/domain/validators/login.validator.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('EMAIL_INVALID'),
  password: z.string().min(1, 'PASSWORD_REQUIRED'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// modules/auth/repositories/AuthRepository.ts
import { supabase } from '@lib/supabase';
import { AuthRepository as IAuthRepository } from '@modules/auth/domain/repositories/AuthRepository.interface';
import { LoginInput } from '@modules/auth/domain/validators/login.validator';

export class AuthRepository implements IAuthRepository {
  async login(input: LoginInput): Promise<{ userId: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('INVALID_CREDENTIALS');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('EMAIL_NOT_CONFIRMED');
      }
      throw new Error('LOGIN_FAILED');
    }

    if (!data.user) {
      throw new Error('LOGIN_FAILED');
    }

    return { userId: data.user.id };
  }
}

// modules/auth/services/AuthService.ts
import { AuthRepository } from '@modules/auth/repositories/AuthRepository';
import { loginSchema } from '@modules/auth/domain/validators/login.validator';

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async login(input: unknown): Promise<{ userId: string }> {
    const validatedInput = loginSchema.parse(input);
    return this.authRepository.login(validatedInput);
  }
}

// modules/auth/hooks/useLogin.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@modules/auth/services/AuthService';
import { AuthRepository } from '@modules/auth/repositories/AuthRepository';
import { RQKEY_SESSION } from '@shared/hooks/useAuthSession';
import { AuthCoordinator } from '@modules/auth/coordinator/AuthCoordinator';
import { LoginInput } from '@modules/auth/domain/validators/login.validator';

const authService = new AuthService(new AuthRepository());

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQKEY_SESSION });
      AuthCoordinator.navigateToHome();
    },
  });
};
```

### Manejo de Errores de Autenticación

**Nota**: El manejo de errores de autenticación sigue el sistema centralizado de transformación de errores descrito en la sección "Manejo de Errores". Los códigos de error de autenticación están definidos en `ERROR_CODES.AUTH` y los mensajes en `ERROR_MESSAGES`.

**Códigos de Error de Autenticación**:

- `AUTH_INVALID_CREDENTIALS`: Email o contraseña incorrectos
- `AUTH_EMAIL_NOT_CONFIRMED`: Email no verificado
- `AUTH_USER_NOT_FOUND`: Usuario no existe
- `AUTH_TOO_MANY_REQUESTS`: Demasiados intentos, cuenta temporalmente bloqueada
- `AUTH_LOGIN_FAILED`: Error genérico de login
- `AUTH_SIGNUP_FAILED`: Error al crear cuenta
- `AUTH_SESSION_EXPIRED`: Sesión expirada

**Uso en el Módulo Auth**:

Los repositorios de autenticación usan `transformSupabaseError()` para convertir errores de Supabase a códigos de dominio. Los mensajes se obtienen usando `getErrorMessage()` desde `@shared/constants/errorMessages`.

Ver la sección "Manejo de Errores" para ejemplos completos de implementación.

## Manejo de Errores

### Arquitectura del Sistema de Transformación de Errores

El sistema de manejo de errores sigue un flujo de transformación en capas:

1. **Infrastructure Layer (Repository)**: Transforma errores técnicos (Supabase, red, etc.) → Códigos de error del dominio
2. **Application Layer (Service)**: Propaga códigos de error del dominio sin transformación
3. **Presentation Layer (Hook/Componente)**: Transforma códigos de error → Mensajes legibles para el usuario

**Principio**: Los errores técnicos nunca deben llegar a la UI. Siempre deben transformarse a códigos de dominio primero.

### Estructura del Sistema

El sistema de transformación de errores está centralizado en `shared/` porque es funcionalidad transversal:

```
shared/
├── types/
│   └── errors.types.ts          # Tipos de códigos de error del dominio
├── constants/
│   └── errorMessages.ts          # Mensajes de error por código
└── utils/
    └── errorTransformers.ts     # Funciones puras para transformar errores
```

### Tipos de Errores

**Ubicación**: `src/shared/types/errors.types.ts`

Define todos los códigos de error posibles en la aplicación. Los códigos deben ser descriptivos y agrupados por módulo o categoría.

**Ejemplo**:

```typescript
// shared/types/errors.types.ts

export const ERROR_CODES = {
  // Errores de autenticación
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    EMAIL_NOT_CONFIRMED: 'AUTH_EMAIL_NOT_CONFIRMED',
    USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
    TOO_MANY_REQUESTS: 'AUTH_TOO_MANY_REQUESTS',
    LOGIN_FAILED: 'AUTH_LOGIN_FAILED',
    SIGNUP_FAILED: 'AUTH_SIGNUP_FAILED',
    SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  },
  // Errores de red
  NETWORK: {
    CONNECTION_FAILED: 'NETWORK_CONNECTION_FAILED',
    TIMEOUT: 'NETWORK_TIMEOUT',
    SERVER_ERROR: 'NETWORK_SERVER_ERROR',
  },
  // Errores de validación
  VALIDATION: {
    INVALID_INPUT: 'VALIDATION_INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'VALIDATION_MISSING_REQUIRED_FIELD',
    INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  },
  // Errores genéricos
  GENERIC: {
    UNKNOWN_ERROR: 'GENERIC_UNKNOWN_ERROR',
    OPERATION_FAILED: 'GENERIC_OPERATION_FAILED',
  },
} as const;

export type ErrorCode =
  | (typeof ERROR_CODES.AUTH)[keyof typeof ERROR_CODES.AUTH]
  | (typeof ERROR_CODES.NETWORK)[keyof typeof ERROR_CODES.NETWORK]
  | (typeof ERROR_CODES.VALIDATION)[keyof typeof ERROR_CODES.VALIDATION]
  | (typeof ERROR_CODES.GENERIC)[keyof typeof ERROR_CODES.GENERIC];

export class DomainError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message?: string,
    public readonly originalError?: unknown,
  ) {
    super(message || code);
    this.name = 'DomainError';
  }
}
```

### Constantes de Mensajes de Error

**Ubicación**: `src/shared/constants/errorMessages.ts`

Contiene todos los mensajes de error legibles para el usuario, organizados por código de error.

**Convenciones**:

- Todos los mensajes deben estar aquí, NO hardcodeados
- Mensajes deben ser claros y accionables
- Preparados para i18n futuro (usar constantes, no strings directos)
- Agrupados por módulo/categoría

**Ejemplo**:

```typescript
// shared/constants/errorMessages.ts
import { ERROR_CODES } from '@shared/types/errors.types';

export const ERROR_MESSAGES: Record<string, string> = {
  // Errores de autenticación
  [ERROR_CODES.AUTH.INVALID_CREDENTIALS]: 'Email o contraseña incorrectos',
  [ERROR_CODES.AUTH.EMAIL_NOT_CONFIRMED]:
    'Por favor verifica tu email antes de iniciar sesión',
  [ERROR_CODES.AUTH.USER_NOT_FOUND]: 'Usuario no encontrado',
  [ERROR_CODES.AUTH.TOO_MANY_REQUESTS]:
    'Demasiados intentos. Por favor intenta más tarde',
  [ERROR_CODES.AUTH.LOGIN_FAILED]: 'Error al iniciar sesión. Por favor intenta de nuevo',
  [ERROR_CODES.AUTH.SIGNUP_FAILED]:
    'Error al crear la cuenta. Por favor intenta de nuevo',
  [ERROR_CODES.AUTH.SESSION_EXPIRED]:
    'Tu sesión ha expirado. Por favor inicia sesión nuevamente',

  // Errores de red
  [ERROR_CODES.NETWORK.CONNECTION_FAILED]:
    'No se pudo conectar al servidor. Verifica tu conexión a internet',
  [ERROR_CODES.NETWORK.TIMEOUT]:
    'La solicitud tardó demasiado. Por favor intenta de nuevo',
  [ERROR_CODES.NETWORK.SERVER_ERROR]:
    'El servidor está experimentando problemas. Por favor intenta más tarde',

  // Errores de validación
  [ERROR_CODES.VALIDATION.INVALID_INPUT]: 'Los datos ingresados no son válidos',
  [ERROR_CODES.VALIDATION.MISSING_REQUIRED_FIELD]: 'Faltan campos requeridos',
  [ERROR_CODES.VALIDATION.INVALID_FORMAT]: 'El formato de los datos no es correcto',

  // Errores genéricos
  [ERROR_CODES.GENERIC.UNKNOWN_ERROR]:
    'Ocurrió un error inesperado. Por favor intenta de nuevo',
  [ERROR_CODES.GENERIC.OPERATION_FAILED]:
    'La operación falló. Por favor intenta de nuevo',
};

export const getErrorMessage = (code: string): string => {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.GENERIC.UNKNOWN_ERROR];
};
```

### Transformadores de Errores

**Ubicación**: `src/shared/utils/errorTransformers.ts`

Funciones puras que transforman errores de diferentes fuentes (Supabase, Zod, red, etc.) a códigos de dominio o mensajes de usuario.

**Convenciones**:

- Funciones puras (sin side effects)
- Fácilmente testeables
- Una función por fuente de error (Supabase, Zod, etc.)
- Siempre retornan códigos de dominio, nunca errores técnicos

**Ejemplo**:

```typescript
// shared/utils/errorTransformers.ts
import { AuthError } from '@supabase/supabase-js';
import { ZodError } from 'zod';
import { ERROR_CODES, DomainError } from '@shared/types/errors.types';

export const transformSupabaseError = (error: AuthError | Error): DomainError => {
  if (!(error instanceof Error)) {
    return new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR, undefined, error);
  }

  const errorMessage = error.message.toLowerCase();
  const errorCode = (error as AuthError).status;

  if (
    errorMessage.includes('invalid login credentials') ||
    errorMessage.includes('invalid credentials')
  ) {
    return new DomainError(ERROR_CODES.AUTH.INVALID_CREDENTIALS, undefined, error);
  }

  if (
    errorMessage.includes('email not confirmed') ||
    errorMessage.includes('email_not_confirmed')
  ) {
    return new DomainError(ERROR_CODES.AUTH.EMAIL_NOT_CONFIRMED, undefined, error);
  }

  if (
    errorMessage.includes('user not found') ||
    errorMessage.includes('user_not_found')
  ) {
    return new DomainError(ERROR_CODES.AUTH.USER_NOT_FOUND, undefined, error);
  }

  if (errorCode === 429 || errorMessage.includes('too many requests')) {
    return new DomainError(ERROR_CODES.AUTH.TOO_MANY_REQUESTS, undefined, error);
  }

  if (
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('fetch')
  ) {
    return new DomainError(ERROR_CODES.NETWORK.CONNECTION_FAILED, undefined, error);
  }

  if (errorCode && errorCode >= 500) {
    return new DomainError(ERROR_CODES.NETWORK.SERVER_ERROR, undefined, error);
  }

  return new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR, undefined, error);
};

export const transformZodError = (error: ZodError): DomainError => {
  const firstError = error.errors[0];

  if (firstError.code === 'invalid_type') {
    return new DomainError(
      ERROR_CODES.VALIDATION.INVALID_FORMAT,
      firstError.message,
      error,
    );
  }

  if (firstError.code === 'too_small' || firstError.code === 'too_big') {
    return new DomainError(
      ERROR_CODES.VALIDATION.INVALID_INPUT,
      firstError.message,
      error,
    );
  }

  return new DomainError(ERROR_CODES.VALIDATION.INVALID_INPUT, firstError.message, error);
};

export const transformUnknownError = (error: unknown): DomainError => {
  if (error instanceof DomainError) {
    return error;
  }

  if (error instanceof ZodError) {
    return transformZodError(error);
  }

  if (error instanceof Error) {
    if (
      'status' in error ||
      error.message.includes('supabase') ||
      error.message.includes('auth')
    ) {
      return transformSupabaseError(error);
    }
  }

  return new DomainError(ERROR_CODES.GENERIC.UNKNOWN_ERROR, undefined, error);
};
```

### Uso en Repositorios

Los repositorios deben transformar errores técnicos a códigos de dominio usando los transformadores:

```typescript
// modules/auth/repositories/AuthRepository.ts
import { supabase } from '@lib/supabase';
import { transformSupabaseError } from '@shared/utils/errorTransformers';
import { ERROR_CODES, DomainError } from '@shared/types/errors.types';
import { LoginInput } from '@modules/auth/domain/validators/login.validator';

export class AuthRepository {
  async login(input: LoginInput): Promise<{ userId: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw transformSupabaseError(error);
      }

      if (!data.user) {
        throw new DomainError(ERROR_CODES.AUTH.LOGIN_FAILED);
      }

      return { userId: data.user.id };
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw transformSupabaseError(error as Error);
    }
  }
}
```

### Uso en Servicios

Los servicios propagan errores de dominio sin transformación adicional, pero pueden agregar contexto:

```typescript
// modules/auth/services/AuthService.ts
import { AuthRepository } from '@modules/auth/repositories/AuthRepository';
import { loginSchema } from '@modules/auth/domain/validators/login.validator';
import { transformZodError } from '@shared/utils/errorTransformers';
import { ZodError } from 'zod';
import { DomainError } from '@shared/types/errors.types';

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async login(input: unknown): Promise<{ userId: string }> {
    try {
      const validatedInput = loginSchema.parse(input);
      return await this.authRepository.login(validatedInput);
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw transformZodError(error as ZodError);
    }
  }
}
```

### Uso en Hooks/Componentes

Los hooks y componentes transforman códigos de error a mensajes legibles usando las constantes:

```typescript
// modules/auth/hooks/useLogin.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@modules/auth/services/AuthService';
import { AuthRepository } from '@modules/auth/repositories/AuthRepository';
import { RQKEY_SESSION } from '@shared/hooks/useAuthSession';
import { AuthCoordinator } from '@modules/auth/coordinator/AuthCoordinator';
import { LoginInput } from '@modules/auth/domain/validators/login.validator';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { DomainError } from '@shared/types/errors.types';
import { transformUnknownError } from '@shared/utils/errorTransformers';

const authService = new AuthService(new AuthRepository());

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      try {
        return await authService.login(input);
      } catch (error) {
        // Transformar DomainError a Error con mensaje legible
        // pero mantener el código en el mensaje para debugging
        if (error instanceof DomainError) {
          const message = getErrorMessage(error.code);
          const errorWithCode = new Error(message);
          (errorWithCode as any).code = error.code;
          throw errorWithCode;
        }
        // Transformar errores desconocidos
        throw transformUnknownError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQKEY_SESSION });
      AuthCoordinator.navigateToHome();
    },
  });
};
```

**Alternativa en Componentes**:

```typescript
// modules/auth/components/LoginForm.tsx
import { useLogin } from '@modules/auth/hooks/useLogin';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { ERROR_CODES } from '@shared/types/errors.types';

export const LoginForm: React.FC = () => {
  const loginMutation = useLogin();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (data: LoginInput) => {
    setErrorMessage(null);

    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : getErrorMessage(ERROR_CODES.GENERIC.UNKNOWN_ERROR);
      setErrorMessage(message);
    }
  };

  return (
    <View>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      {/* ... */}
    </View>
  );
};
```

### Hook de Utilidad para Errores

Para simplificar el manejo de errores en componentes, se puede crear un hook reutilizable:

```typescript
// shared/hooks/useErrorHandler.ts
import { useCallback } from 'react';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { ERROR_CODES, DomainError } from '@shared/types/errors.types';
import { transformUnknownError } from '@shared/utils/errorTransformers';

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown): string => {
    const domainError = transformUnknownError(error);
    return getErrorMessage(domainError.code);
  }, []);

  return { handleError };
};
```

**Uso**:

```typescript
const { handleError } = useErrorHandler();

try {
  await someOperation();
} catch (error) {
  const message = handleError(error);
  setErrorMessage(message);
}
```

### Errores de API

- Todos los errores deben ser tipados usando `DomainError`
- Errores técnicos nunca deben llegar a la UI
- Errores críticos deben ser logueados (usando el `originalError` de `DomainError`)
- Usar transformadores para convertir errores técnicos a códigos de dominio

### Errores de UI

- Componentes de error reutilizables que aceptan mensajes de error
- Estados de error en todas las queries/mutations
- Manejo graceful de errores (mostrar mensajes amigables, no stack traces)
- Usar `getErrorMessage()` para obtener mensajes legibles

### Logging de Errores

Para errores críticos, loguear el error original manteniendo el mensaje amigable:

```typescript
import { logger } from '@shared/logger';

try {
  await operation();
} catch (error) {
  if (error instanceof DomainError && error.originalError) {
    logger.error('Operation failed', {
      code: error.code,
      originalError: error.originalError,
    });
  }
  throw error;
}
```

## Sistema de Logging

### Arquitectura del Logger

El sistema de logging está centralizado y proporciona diferentes niveles de log para desarrollo y producción. **NO utilizamos servicios externos** como Sentry o similares. El logging es local y se usa principalmente para desarrollo y debugging.

**Ubicación**: `src/shared/logger/`

**Estructura**:

```
shared/logger/
├── index.ts              # Exportación principal del logger
├── Logger.ts             # Clase Logger principal
├── transports/           # Transports (consola, archivo, etc.)
│   └── console.ts       # Transport de consola
├── types.ts              # Tipos del logger
└── util.ts               # Utilidades del logger
```

**Transport Disponible**:

- **`consoleTransport`**: Transport de consola para desarrollo. Los logs se muestran en la consola con colores y formato según el nivel.

### Niveles de Log

El logger soporta los siguientes niveles:

- **`debug`**: Logs de desarrollo, solo visibles en modo desarrollo
- **`info`**: Información general, breadcrumbs para producción
- **`warn`**: Advertencias, problemas no críticos
- **`error`**: Errores conocidos o excepciones

**Configuración**:

El nivel de log se configura mediante la variable de entorno `EXPO_PUBLIC_LOG_LEVEL` (por defecto: `info`).

### Uso del Logger

**Importación**:

```typescript
import { logger } from '@shared/logger';

// O crear una instancia con contexto personalizado
import { Logger } from '@shared/logger';
const logger = Logger.create(Logger.Context.Tasks);
```

**Ejemplos de uso**:

```typescript
// Logs de desarrollo (solo en __DEV__)
logger.debug('Task created', { taskId, houseId });

// Logs informativos (breadcrumbs)
logger.info('User completed task', { taskId, userId });

// Advertencias (poco usado, preferir error)
logger.warn('Task completion took longer than expected', { taskId, duration: 5000 });

// Errores conocidos (sin excepción)
logger.error('Failed to complete task', { taskId, errorCode: 'TASK_NOT_FOUND' });

// Errores con excepción
try {
  await operation();
} catch (e) {
  logger.error(e, { message: 'Operation failed', context: { taskId } });
}
```

### Contextos

Los contextos permiten filtrar logs por módulo o funcionalidad:

```typescript
// shared/logger/types.ts
export enum LoggerContext {
  Auth = 'auth',
  Tasks = 'tasks',
  House = 'house',
  Network = 'network',
  Storage = 'storage',
}
```

**Filtrado de logs de debug**:

En desarrollo, puedes filtrar logs de debug usando la variable de entorno `EXPO_PUBLIC_LOG_DEBUG`:

```bash
# Solo logs de tasks
EXPO_PUBLIC_LOG_DEBUG=tasks

# Múltiples contextos
EXPO_PUBLIC_LOG_DEBUG=tasks,auth

# Con wildcards
EXPO_PUBLIC_LOG_DEBUG=tasks*
```

### Implementación del Logger

**Ejemplo de implementación básica**:

```typescript
// shared/logger/Logger.ts
export enum LoggerContext {
  Auth = 'auth',
  Tasks = 'tasks',
  House = 'house',
  Network = 'network',
  Storage = 'storage',
}

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: LoggerContext;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  error?: Error;
}

export class Logger {
  private context?: LoggerContext;
  private level: 'debug' | 'info' | 'warn' | 'error';

  constructor(context?: LoggerContext) {
    this.context = context;
    this.level = (process.env.EXPO_PUBLIC_LOG_LEVEL as any) || 'info';
  }

  static create(context?: LoggerContext): Logger {
    return new Logger(context);
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    if (!__DEV__) return;
    if (this.shouldLog('debug')) {
      this.log('debug', message, metadata);
    }
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      this.log('info', message, metadata);
    }
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      this.log('warn', message, metadata);
    }
  }

  error(errorOrMessage: Error | string, metadata?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      if (errorOrMessage instanceof Error) {
        this.log('error', errorOrMessage.message, {
          ...metadata,
          error: errorOrMessage,
          stack: errorOrMessage.stack,
        });
      } else {
        this.log('error', errorOrMessage, metadata);
      }
    }
  }

  private shouldLog(level: LogEntry['level']): boolean {
    const levels: LogEntry['level'][] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.level);
    const logLevelIndex = levels.indexOf(level);
    return logLevelIndex >= currentLevelIndex;
  }

  private log(
    level: LogEntry['level'],
    message: string,
    metadata?: Record<string, unknown>,
  ): void {
    const entry: LogEntry = {
      level,
      message,
      context: this.context,
      metadata,
      timestamp: new Date(),
    };

    // En desarrollo, usar console
    if (__DEV__) {
      const prefix = this.context ? `[${this.context}]` : '';
      const logMethod = level === 'error' ? console.error : console[level] || console.log;
      logMethod(`${prefix} ${message}`, metadata || '');
    }

    // En producción, podrías enviar a un archivo o storage local
    // pero NO a servicios externos
  }
}

// Instancia global
export const logger = new Logger();
```

### Convenciones de Logging

- **Usar contextos apropiados**: Crear instancias con contexto cuando sea útil para filtrar
- **Metadata útil**: Incluir información relevante en metadata (IDs, estados, etc.)
- **No loguear datos sensibles**: Nunca loguear contraseñas, tokens, o información personal
- **Logs en desarrollo**: Usar `debug` para información detallada solo en desarrollo
- **Logs en producción**: Usar `info` para breadcrumbs importantes, `error` para errores

## Validación

### Librería de Validación: Zod

**Zod** es la librería estándar para validación en el proyecto. Se usa para:

- Validación de esquemas de datos
- Validación de formularios
- Validación de respuestas de API
- Inferencia de tipos TypeScript desde esquemas

**Ubicación de esquemas**:

- **Validación de Dominio**: `src/modules/{module}/domain/validators/`
- **Validación de Presentación**: `src/modules/{module}/utils/{module}Validators.ts` o en componentes de formulario

**Patrones**:

- Crear esquemas Zod reutilizables
- Inferir tipos TypeScript desde esquemas usando `z.infer<typeof schema>`
- Usar `.parse()` para validación estricta (lanza error)
- Usar `.safeParse()` para validación segura (retorna resultado)
- Transformar errores de Zod a mensajes de usuario amigables

**Ejemplo de Validación de Dominio**:

```typescript
// modules/auth/domain/validators/login.validator.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('EMAIL_INVALID'),
  password: z.string().min(8, 'PASSWORD_TOO_SHORT'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

**Ejemplo de Validación en Presentación**:

```typescript
// modules/auth/components/LoginForm.tsx
import { loginSchema } from '@modules/auth/domain/validators/login.validator';

const handleSubmit = (data: FormData) => {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    setFieldErrors(errors);
    return;
  }

  onLogin(result.data);
};
```

### Validación de Dominio

- En la capa de dominio usando esquemas Zod
- Reglas de negocio
- Validaciones que no dependen de UI
- Esquemas reutilizables en `domain/validators/`

### Validación de Presentación

- En componentes de formulario usando esquemas Zod
- Validación de inputs en tiempo real
- Feedback inmediato al usuario
- Transformación de errores de Zod a mensajes amigables

## Testing

### Estructura de Tests

- Tests unitarios para utils, services, domain
- Tests de componentes con React Native Testing Library
- Tests de integración para flujos completos

### Convenciones

- Un archivo de test por archivo de código
- Tests descriptivos y específicos
- Mocking de dependencias externas

## Librerías y Propósitos

### Core

- **React 19.1.0**: Biblioteca UI base
- **React Native 0.81.5**: Framework para aplicaciones móviles
- **Expo ~54.0.25**: Framework y herramientas para React Native
- **TypeScript ~5.9.2**: Tipado estático

### Estado y Datos

- **@tanstack/react-query ^5.90.11**: Gestión de estado del servidor, caché, sincronización y mutaciones. Usado para todas las operaciones con Supabase.
- **@tanstack/react-query-devtools ^5.91.1**: Herramientas de desarrollo para React Query (solo desarrollo)
- **zustand ^5.0.9**: Gestión de estado de UI local. Usado para estado de UI que no proviene del servidor (filtros, preferencias de UI, modales, formularios complejos).

### Backend y Base de Datos

- **@supabase/supabase-js ^2.86.0**: Cliente de Supabase para autenticación, base de datos y storage. Usado para todas las operaciones de backend. Maneja automáticamente la persistencia de sesiones de autenticación.

### Validación

- **zod ^3.23.8**: Librería de validación de esquemas TypeScript-first. Usada para validación de formularios, validación de datos de dominio, validación de respuestas de API e inferencia de tipos TypeScript desde esquemas.

### Navegación

- **expo-router ^6.0.15**: Sistema de navegación basado en archivos para Expo. Usado para routing y navegación entre pantallas.

### Internacionalización

- **@lingui/core**: Core de Lingui para internacionalización
- **@lingui/react**: Componentes React para Lingui
- **@lingui/macro**: Macros para extracción de mensajes

### Storage y Persistencia

- **react-native-mmkv**: Storage rápido y eficiente para React Native (usado en storage persistente)
- **@react-native-async-storage/async-storage**: AsyncStorage para React Native (usado en React Query persist)
- **@tanstack/query-async-storage-persister**: Persister de React Query para AsyncStorage
- **@tanstack/react-query-persist-client**: Cliente persistente de React Query

### Utilidades

- **date-fns ^3.0.0**: Librería de utilidades para fechas. Usada en `useGetTimeAgo` para formateo de fechas relativas.
- **graphemer ^1.4.0**: Librería para conteo de grafemas Unicode. Usada en `useEnforceMaxGraphemeCount` para limitar correctamente la longitud de strings con caracteres especiales.

### Red y Conectividad

- **@react-native-community/netinfo**: Detección de estado de red y conectividad

### UI y Estilos

- **react-native-safe-area-context ~5.6.0**: Manejo de safe areas en dispositivos móviles
- **react-native-screens ~4.16.0**: Optimización de rendimiento de pantallas nativas
- **expo-image**: Componente de imagen optimizado para Expo

### Seguridad

- **expo-secure-store**: Almacenamiento seguro para datos sensibles (tokens, etc.)
- **isomorphic-dompurify**: Sanitización de HTML para prevenir XSS

### Desarrollo

- **eslint**: Linter para mantener calidad de código
- **prettier**: Formateador de código
- **typescript**: Compilador y type checker

## Convenciones de Código

### Nombres de Archivos

- **Componentes**: PascalCase (ej: `TaskCard.tsx`)
- **Hooks**: camelCase con prefijo "use" (ej: `useTasksList.ts`)
- **Services**: PascalCase con sufijo "Service" (ej: `TaskService.ts`)
- **Stores**: camelCase con sufijo ".store.ts" (ej: `tasksUi.store.ts`)
- **Types**: camelCase con sufijo ".types.ts" (ej: `tasks.types.ts`)
- **Constants**: camelCase con sufijo ".constants.ts" (ej: `tasks.constants.ts`)
- **Utils**: camelCase con sufijo descriptivo (ej: `tasksFilters.ts`)

### Nombres de Variables y Funciones

- **Variables**: camelCase
- **Funciones**: camelCase
- **Constantes**: UPPER_SNAKE_CASE (solo en archivos de constantes)
- **Tipos/Interfaces**: PascalCase
- **Enums**: PascalCase

### Imports

- Orden: externos → internos → relativos
- Agrupar con líneas en blanco
- Usar path aliases cuando sea posible (`@modules/*`, `@lib/*`, `@shared/*`)

### Estilos

- Usar `StyleSheet.create` para estilos
- **SIEMPRE separar StyleSheets en archivos propios**: Los StyleSheets deben estar en archivos separados dentro de la subcarpeta del componente/screen
- NO usar estilos inline (excepto para estilos dinámicos)
- NO definir StyleSheets en el mismo archivo que el componente
- Estilos compartidos en `shared/styles/`
- Estilos específicos de módulo en el módulo

**Convención de nombres de archivos de estilos**:

- El archivo de estilos se llama `styles.ts` (sin prefijo del componente/screen)
- Ubicado dentro de la subcarpeta del componente/screen: `ComponentName/styles.ts`
- El contexto ya está dado por la carpeta, por lo que no necesita el nombre del componente

**Ejemplo**:

```typescript
// modules/tasks/components/TaskCard/index.tsx
import { View, Text } from 'react-native';
import { styles } from './styles';

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
    </View>
  );
};
```

```typescript
// modules/tasks/components/TaskCard/styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

## Flujo de Datos

### Lectura de Datos

1. Screen llama a hook personalizado
2. Hook usa React Query para obtener datos
3. React Query llama a Service
4. Service usa Repository
5. Repository accede a Supabase
6. Datos fluyen de vuelta transformándose en cada capa

### Escritura de Datos

1. Screen llama a hook de mutación
2. Hook usa React Query mutation
3. Mutation llama a Service
4. Service valida y orquesta
5. Service llama a Repository
6. Repository escribe en Supabase
7. React Query invalida queries relacionadas
8. UI se actualiza automáticamente

## Módulos Principales

### Auth Module

- Autenticación de usuarios (login, registro)
- Gestión de sesión
- Recuperación de contraseña
- Verificación de email
- Manejo de estado de autenticación global

### Account Module

- Gestión de perfil de usuario
- Configuración de cuenta
- Edición de perfil

### House Module

- Creación y gestión de casas
- Información de casa (nombre, habitaciones, ocupantes)
- Configuración de casa (caducidad de puntos)

### Rooms Module

- Gestión de habitaciones
- Asignación de tareas a habitaciones

### Tasks Module

- Creación de tareas
- Asignación de tareas
- Completado de tareas
- Validación de tareas
- Sistema de puntuación

### Occupants Module

- Gestión de ocupantes
- Permisos de ocupantes
- Roles (dueño, ocupante con permisos, ocupante)

### Invitations Module

- Invitaciones a casas
- Aceptación/rechazo de invitaciones

### Scores Module

- Visualización de puntajes
- Historial de puntos
- Caducidad de puntos

## Accesibilidad (a11y)

### Principios de Accesibilidad

Bitify debe ser accesible para todos los usuarios, incluyendo aquellos con discapacidades visuales, auditivas, motoras o cognitivas.

### Componentes Accesibles

**Labels y Roles**:

```typescript
// shared/components/Button.tsx
import { AccessibilityProps } from 'react-native';

interface ButtonProps extends AccessibilityProps {
  title: string;
  onPress: () => void;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, accessibilityLabel, ...props }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint="Presiona dos veces para activar"
      {...props}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

**Inputs Accesibles**:

```typescript
// shared/components/Input.tsx
export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <View>
      <Text
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={label}
      >
        {label}
      </Text>
      <TextInput
        {...props}
        accessible={true}
        accessibilityLabel={label}
        accessibilityHint={error ? `Error: ${error}` : undefined}
        accessibilityState={{ invalid: !!error }}
      />
      {error && (
        <Text
          accessible={true}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
};
```

### Navegación por Teclado

**Focus Management**:

```typescript
// shared/components/Form.tsx
import { useRef } from 'react';

export const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  const inputRefs = useRef<TextInput[]>([]);

  const handleSubmit = () => {
    // Mover focus al siguiente input o submit
    const firstEmptyInput = inputRefs.current.find(ref => !ref.value);
    if (firstEmptyInput) {
      firstEmptyInput.focus();
    } else {
      onSubmit();
    }
  };

  return <View>{children}</View>;
};
```

### Screen Readers

**Textos Descriptivos**:

```typescript
// modules/tasks/components/TaskCard.tsx
export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const statusLabel = task.status === 'completed' ? 'Completada' : 'Pendiente';
  const dueDateLabel = task.dueDate
    ? `Vence el ${formatDate(task.dueDate)}`
    : 'Sin fecha de vencimiento';

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Tarea ${task.title}, ${statusLabel}, ${dueDateLabel}`}
      accessibilityHint="Presiona dos veces para ver detalles"
    >
      <Text>{task.title}</Text>
      <Text>{statusLabel}</Text>
    </TouchableOpacity>
  );
};
```

### Contraste de Colores

**Verificar Contraste**:

- Texto sobre fondo debe tener ratio de contraste mínimo de 4.5:1 (WCAG AA)
- Texto grande (18pt+) debe tener ratio mínimo de 3:1
- Usar herramientas para verificar contraste

### Testing de Accesibilidad

**React Native Testing Library**:

```typescript
// __tests__/components/TaskCard.test.tsx
import { render } from '@testing-library/react-native';
import { TaskCard } from '@modules/tasks/components/TaskCard';

it('should be accessible', () => {
  const { getByLabelText } = render(
    <TaskCard task={mockTask} onPress={jest.fn()} />
  );

  expect(getByLabelText(/Tarea/)).toBeTruthy();
});
```

### Convenciones

- **Siempre proporcionar accessibilityLabel**: Para todos los elementos interactivos
- **Usar roles apropiados**: `button`, `text`, `header`, `link`, etc.
- **Hints descriptivos**: Proporcionar hints cuando la acción no es obvia
- **Estados accesibles**: Usar `accessibilityState` para estados (disabled, selected, etc.)
- **Live regions**: Usar `accessibilityLiveRegion` para actualizaciones dinámicas
- **Contraste adecuado**: Verificar que todos los textos sean legibles
- **Tamaño de toque**: Mínimo 44x44 puntos para elementos táctiles

## Manejo de Red y Offline

### Detección de Estado de Red

**Hook de Estado de Red**:

```typescript
// shared/hooks/useNetworkStatus.ts
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected ?? false;
      setIsOnline(online);
      setIsConnected(online && (state.isInternetReachable ?? true));

      // Actualizar React Query
      onlineManager.setOnline(online);
    });

    return () => unsubscribe();
  }, []);

  return { isOnline, isConnected };
};
```

### Indicadores Visuales de Estado

```typescript
// shared/components/NetworkStatus.tsx
import { useNetworkStatus } from '@shared/hooks/useNetworkStatus';

export const NetworkStatus: React.FC = () => {
  const { isConnected } = useNetworkStatus();

  if (!isConnected) {
    return (
      <View style={styles.banner}>
        <Text>Sin conexión a internet</Text>
      </View>
    );
  }

  return null;
};
```

### Queue de Operaciones Offline

**Sistema de Queue**:

```typescript
// shared/storage/offlineQueue.ts
interface QueuedOperation {
  id: string;
  type: 'mutation';
  mutationKey: string[];
  variables: unknown;
  timestamp: number;
}

class OfflineQueue {
  private queue: QueuedOperation[] = [];

  async add(operation: Omit<QueuedOperation, 'id' | 'timestamp'>): Promise<void> {
    const queued: QueuedOperation = {
      ...operation,
      id: generateId(),
      timestamp: Date.now(),
    };

    this.queue.push(queued);
    await this.persistQueue();
  }

  async processQueue(queryClient: QueryClient): Promise<void> {
    const { isConnected } = await NetInfo.fetch();
    if (!isConnected) return;

    while (this.queue.length > 0) {
      const operation = this.queue[0];
      try {
        await queryClient.executeMutation({
          mutationKey: operation.mutationKey,
          variables: operation.variables,
        });
        this.queue.shift();
      } catch (error) {
        logger.error('Failed to process queued operation', { operation, error });
        break;
      }
    }

    await this.persistQueue();
  }

  private async persistQueue(): Promise<void> {
    await device.set(['offlineQueue'], this.queue);
  }
}

export const offlineQueue = new OfflineQueue();
```

**Uso en Mutations**:

```typescript
// modules/tasks/hooks/useCompleteTask.ts
import { offlineQueue } from '@shared/storage/offlineQueue';
import { useNetworkStatus } from '@shared/hooks/useNetworkStatus';

export const useCompleteTask = () => {
  const { isConnected } = useNetworkStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      if (!isConnected) {
        // Agregar a queue offline
        await offlineQueue.add({
          type: 'mutation',
          mutationKey: ['tasks', 'complete'],
          variables: { taskId },
        });
        throw new Error('OFFLINE_QUEUED');
      }

      return taskService.completeTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
```

### Sincronización al Volver Online

```typescript
// src/AppProviders.tsx
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { offlineQueue } from '@shared/storage/offlineQueue';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state.isConnected) {
        // Procesar queue cuando vuelve la conexión
        await offlineQueue.processQueue(queryClient);
        // Refetch queries críticas
        await queryClient.refetchQueries({ queryKey: ['tasks'] });
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  return <QueryProvider>{children}</QueryProvider>;
};
```

### Estrategias de Retry con Backoff

```typescript
// shared/utils/retryWithBackoff.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
```

### Convenciones

- **Detectar estado de red**: Usar `NetInfo` para detectar conectividad
- **Indicadores visuales**: Mostrar banner cuando no hay conexión
- **Queue offline**: Guardar mutaciones para ejecutar cuando vuelva la conexión
- **Sincronización automática**: Procesar queue al volver online
- **Retry inteligente**: Usar backoff exponencial para reintentos
- **Caché agresivo**: Mantener datos en caché para uso offline

## Consideraciones de Seguridad

### Principios de Seguridad

1. **Validación en Backend**: Toda validación crítica debe estar en Supabase RLS
2. **Validación en Frontend**: Validación en frontend solo para UX, no para seguridad
3. **Autenticación Requerida**: Todas las operaciones requieren autenticación
4. **Permisos Verificados**: Verificar permisos en cada operación
5. **Sanitización de Inputs**: Sanitizar todos los inputs del usuario

### Validación en Backend (Supabase RLS)

**Row Level Security Policies**:

```sql
-- Ejemplo de política RLS en Supabase
CREATE POLICY "Users can only see tasks from their houses"
ON tasks FOR SELECT
USING (
  house_id IN (
    SELECT house_id FROM house_occupants
    WHERE user_id = auth.uid()
  )
);
```

### Validación en Frontend

**Sanitización de Inputs**:

```typescript
// shared/utils/sanitize.ts
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover tags HTML
    .slice(0, 1000); // Limitar longitud
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
```

**Validación con Zod**:

```typescript
// modules/tasks/domain/validators/createTask.validator.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(100)
    .transform(s => sanitizeString(s)),
  description: z
    .string()
    .max(500)
    .transform(s => sanitizeString(s))
    .optional(),
  houseId: z.string().uuid(),
});
```

### Manejo Seguro de Tokens

**NO almacenar tokens manualmente**: Supabase maneja tokens automáticamente

**NO loguear tokens**: Nunca loguear tokens o información sensible

```typescript
// ❌ MAL
logger.debug('Token', { token: session.access_token });

// ✅ BIEN
logger.debug('Session created', { userId: session.user.id });
```

### Protección XSS

**Sanitizar contenido del usuario**:

```typescript
// shared/utils/sanitizeHtml.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href'],
  });
}
```

### Rate Limiting en Frontend

```typescript
// shared/utils/rateLimiter.ts
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Limpiar requests fuera de la ventana
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Uso
if (!rateLimiter.canMakeRequest('login', 5, 60000)) {
  throw new Error('TOO_MANY_REQUESTS');
}
```

### Secure Storage

**NO almacenar datos sensibles en AsyncStorage**: Usar SecureStore para datos sensibles

```typescript
// shared/storage/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async get(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  },

  async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};
```

### Convenciones

- **Validar en backend**: Toda validación crítica en Supabase RLS
- **Sanitizar inputs**: Limpiar todos los inputs del usuario
- **No loguear datos sensibles**: Nunca loguear tokens, contraseñas, etc.
- **Autenticación requerida**: Verificar sesión en todas las operaciones
- **Verificar permisos**: Comprobar permisos en cada operación
- **Rate limiting**: Implementar rate limiting en frontend para prevenir abuso
- **Secure storage**: Usar SecureStore para datos sensibles

## Error Boundaries

### ¿Qué son los Error Boundaries?

Los Error Boundaries son componentes React que capturan errores JavaScript en cualquier parte del árbol de componentes hijo, registran esos errores y muestran una UI de fallback en lugar del árbol de componentes que falló.

**Ubicación**: `src/shared/components/ErrorBoundary.tsx`

### Implementación

```typescript
// shared/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';
import { logger } from '@shared/logger';

interface Props {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!);
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo salió mal</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'Ocurrió un error inesperado'}
          </Text>
          <Button title="Reintentar" onPress={this.handleReset} />
        </View>
      );
    }

    return this.props.children;
  }
}
```

**Nota**: El logger debe estar inicializado antes de usar ErrorBoundary. Si el logger no está disponible, se puede usar `console.error` como fallback:

```typescript
const logError = logger?.error || console.error;
logError(error, { componentStack: errorInfo.componentStack });
```

### Uso en la Aplicación

**Error Boundary Global**:

```typescript
// src/AppProviders.tsx
import { ErrorBoundary } from '@shared/components/ErrorBoundary';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={error => <ErrorScreen error={error} />}
      onError={(error, errorInfo) => {
        // Loguear error crítico
        logger.error(error, { errorInfo });
      }}
    >
      <QueryProvider>
        {children}
      </QueryProvider>
    </ErrorBoundary>
  );
};
```

**Error Boundary por Módulo**:

```typescript
// modules/tasks/screens/TasksListScreen.tsx
import { ErrorBoundary } from '@shared/components/ErrorBoundary';

export const TasksListScreen: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={error => (
        <View>
          <Text>Error al cargar las tareas</Text>
          <Text>{error.message}</Text>
        </View>
      )}
    >
      <TasksListContent />
    </ErrorBoundary>
  );
};
```

### Componente de Error Screen

```typescript
// shared/components/ErrorScreen.tsx
import { View, Text, Button, StyleSheet } from 'react-native';

interface ErrorScreenProps {
  error: Error;
  onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! Algo salió mal</Text>
      <Text style={styles.message}>{error.message}</Text>
      {onRetry && <Button title="Reintentar" onPress={onRetry} />}
    </View>
  );
};
```

### Convenciones

- **Error Boundary Global**: Envolver la app completa en AppProviders
- **Error Boundaries Locales**: Usar en módulos críticos para aislar errores
- **Logging**: Siempre loguear errores capturados
- **Fallback UI**: Proporcionar UI de fallback clara y accionable
- **No capturar errores de eventos**: Error Boundaries NO capturan errores en event handlers

## Performance y Optimización

### Principios de Performance

1. **Lazy Loading**: Cargar código solo cuando se necesita
2. **Memoización**: Evitar re-renders innecesarios
3. **Virtualización**: Renderizar solo elementos visibles en listas
4. **Caché Agresivo**: Usar React Query para caché inteligente
5. **Optimistic Updates**: Actualizar UI inmediatamente

### Lazy Loading de Módulos

**Code Splitting con Expo Router**:

```typescript
// app/(tabs)/tasks.tsx
import { lazy } from 'react';

const TasksListScreen = lazy(() => import('@modules/tasks/screens/TasksListScreen'));

export default function TasksScreen() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TasksListScreen />
    </Suspense>
  );
}
```

**Lazy Loading de Componentes Pesados**:

```typescript
// modules/tasks/components/TaskDetailModal.tsx
import { lazy, Suspense } from 'react';

const TaskDetailContent = lazy(() => import('./TaskDetailContent'));

export const TaskDetailModal: React.FC = ({ taskId }) => {
  return (
    <Modal>
      <Suspense fallback={<LoadingSpinner />}>
        <TaskDetailContent taskId={taskId} />
      </Suspense>
    </Modal>
  );
};
```

### Memoización de Componentes

**React.memo para Componentes Presentacionales**:

```typescript
// modules/tasks/components/TaskCard.tsx
import { memo } from 'react';

export const TaskCard = memo<TaskCardProps>(({ task, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(task.id)}>
      <Text>{task.title}</Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Comparación personalizada
  return prevProps.task.id === nextProps.task.id &&
         prevProps.task.status === nextProps.task.status;
});
```

**useMemo para Valores Calculados**:

```typescript
// modules/tasks/screens/TasksListScreen.tsx
export const TasksListScreen: React.FC = () => {
  const { data: tasks } = useTasksList();
  const { selectedFilter } = useTasksUiStore();

  const filteredTasks = useMemo(() => {
    return filterTasksByStatus(tasks ?? [], selectedFilter);
  }, [tasks, selectedFilter]);

  return <TasksList tasks={filteredTasks} />;
};
```

**useCallback para Funciones**:

```typescript
// modules/tasks/components/TaskCard.tsx
export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const handleComplete = useCallback(() => {
    onComplete(task.id);
  }, [task.id, onComplete]);

  return <Button onPress={handleComplete} />;
};
```

### Optimización de Listas

**FlatList con Optimizaciones**:

```typescript
// modules/tasks/components/TasksList.tsx
import { FlatList } from 'react-native';

export const TasksList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const renderItem = useCallback(({ item }: { item: Task }) => {
    return <TaskCard task={item} />;
  }, []);

  const keyExtractor = useCallback((item: Task) => item.id, []);

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
};
```

### Optimización de Imágenes

```typescript
// shared/components/OptimizedImage.tsx
import { Image } from 'expo-image';

export const OptimizedImage: React.FC<ImageProps> = ({ source, ...props }) => {
  return (
    <Image
      source={source}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      {...props}
    />
  );
};
```

### Bundle Size Monitoring

```typescript
// scripts/analyze-bundle.js
// Analizar tamaño del bundle y detectar dependencias grandes
```

### Performance Profiling

**React DevTools Profiler**: Usar para identificar componentes lentos

**Flipper**: Usar para profiling de performance en React Native

### Convenciones

- **Memoizar componentes pesados**: Usar `React.memo` para componentes que se renderizan frecuentemente
- **Memoizar cálculos costosos**: Usar `useMemo` para transformaciones de datos
- **Memoizar callbacks**: Usar `useCallback` para funciones pasadas como props
- **Virtualizar listas largas**: Usar `FlatList` con optimizaciones para listas > 50 items
- **Lazy load módulos grandes**: Cargar pantallas y componentes pesados de forma lazy
- **Optimizar imágenes**: Usar formatos modernos (WebP) y lazy loading

## Optimistic UI (Interfaz Optimista)

### ¿Qué es Optimistic UI?

Optimistic UI es una técnica que actualiza la interfaz de usuario **inmediatamente** cuando el usuario realiza una acción, antes de que la petición al servidor se complete. Esto hace que la aplicación se sienta más rápida y responsiva.

**Principio**: Asumir que la operación será exitosa y actualizar la UI inmediatamente. Si falla, revertir los cambios.

### Cuándo Usar Optimistic UI

**Usar cuando**:

- La acción es reversible (like, bookmark, toggle)
- La probabilidad de éxito es alta
- La acción mejora significativamente la experiencia del usuario
- El costo de revertir es bajo

**NO usar cuando**:

- La acción es crítica y no reversible fácilmente
- La probabilidad de fallo es alta
- El estado resultante es complejo de predecir
- Requiere validación del servidor antes de mostrar

### Patrones de Optimistic UI

#### 1. Optimistic Updates con React Query

React Query proporciona callbacks (`onMutate`, `onSuccess`, `onError`) para implementar optimistic updates.

**Patrón básico**:

```typescript
// modules/tasks/hooks/useCompleteTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@modules/tasks/services/TaskService';
import { RQKEY_TASKS_LIST } from '@modules/tasks/hooks/useTasksList';

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.completeTask(taskId),

    // 1. Actualizar optimísticamente ANTES de la mutación
    onMutate: async (taskId: string) => {
      // Cancelar queries en progreso para evitar sobrescribir
      await queryClient.cancelQueries({ queryKey: RQKEY_TASKS_LIST });

      // Snapshot del valor anterior (para revertir si falla)
      const previousTasks = queryClient.getQueryData(RQKEY_TASKS_LIST);

      // Actualizar optimísticamente
      queryClient.setQueryData(RQKEY_TASKS_LIST, (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map(task =>
          task.id === taskId
            ? { ...task, status: 'completed', completedAt: new Date() }
            : task,
        );
      });

      // Retornar contexto para revertir si falla
      return { previousTasks };
    },

    // 2. Si falla, revertir los cambios
    onError: (error, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(RQKEY_TASKS_LIST, context.previousTasks);
      }
    },

    // 3. Si tiene éxito, invalidar para obtener datos frescos del servidor
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RQKEY_TASKS_LIST });
    },

    // 4. Siempre ejecutar al final (éxito o error)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: RQKEY_TASKS_LIST });
    },
  });
};
```

#### 2. Shadow System (Sistema de Sombra)

Para entidades que aparecen en múltiples lugares (como tareas en diferentes listas o feeds), usar un sistema de "sombra" que mantiene actualizaciones optimísticas locales. Este sistema permite mantener actualizaciones optimísticas sincronizadas entre múltiples queries que contienen la misma entidad.

**Ejemplo de implementación**:

```typescript
// modules/tasks/cache/taskShadow.ts
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { Task } from '@modules/tasks/domain/entities/Task';
import { useState, useEffect, useMemo } from 'react';

interface TaskShadow {
  isCompleted: boolean | undefined;
  completedAt: Date | undefined;
  optimisticPoints: number | undefined;
}

const shadows = new WeakMap<Task, Partial<TaskShadow>>();

export function updateTaskShadow(
  queryClient: QueryClient,
  taskId: string,
  updates: Partial<TaskShadow>,
) {
  // Actualizar shadow local
  queryClient.setQueriesData<Task[]>({ queryKey: ['tasks'] }, old => {
    if (!old) return old;
    return old.map(task => {
      if (task.id === taskId) {
        const shadow = shadows.get(task) || {};
        shadows.set(task, { ...shadow, ...updates });
      }
      return task;
    });
  });
}

// Nota: Este hook requiere que el componente se re-renderice cuando
// el shadow cambia. Para esto, el QueryClient debe invalidar las queries
// después de actualizar el shadow, o usar un sistema de suscripción.
export function useTaskShadow(task: Task): Task {
  const queryClient = useQueryClient();
  const [shadow, setShadow] = useState(() => shadows.get(task));

  useEffect(() => {
    // Suscribirse a cambios del shadow
    // Nota: Esta es una implementación simplificada.
    // En producción, podrías usar un sistema de eventos más robusto.
    const checkShadow = () => {
      const currentShadow = shadows.get(task);
      if (currentShadow !== shadow) {
        setShadow(currentShadow);
      }
    };

    // Verificar periódicamente (en producción usar un sistema de eventos)
    const interval = setInterval(checkShadow, 100);
    return () => clearInterval(interval);
  }, [task, shadow]);

  return useMemo(() => {
    if (!shadow) return task;

    return {
      ...task,
      isCompleted: shadow.isCompleted ?? task.isCompleted,
      completedAt: shadow.completedAt ?? task.completedAt,
      points: shadow.optimisticPoints ?? task.points,
    };
  }, [task, shadow]);
}
```

**Uso en mutaciones**:

```typescript
// modules/tasks/hooks/useCompleteTask.ts
export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      // Actualizar shadow ANTES de la mutación
      updateTaskShadow(queryClient, taskId, {
        isCompleted: true,
        completedAt: new Date(),
      });

      // Ejecutar mutación
      return await taskService.completeTask(taskId);
    },

    onError: (error, taskId) => {
      // Revertir shadow si falla
      updateTaskShadow(queryClient, taskId, {
        isCompleted: false,
        completedAt: undefined,
      });
    },
  });
};
```

#### 3. Mutation Queues (Colas de Mutaciones)

Para acciones que pueden ejecutarse rápidamente múltiples veces (como toggle de likes), usar colas de mutaciones.

**Ejemplo**:

```typescript
// modules/tasks/hooks/useToggleTaskCompletion.ts
import { useToggleMutationQueue } from '@shared/hooks/useToggleMutationQueue';

export const useToggleTaskCompletion = (task: Task) => {
  const queryClient = useQueryClient();
  const completeMutation = useCompleteTask();
  const uncompleteMutation = useUncompleteTask();

  return useToggleMutationQueue({
    initialState: task.isCompleted,
    runMutation: async (prevCompleted, shouldComplete) => {
      if (shouldComplete) {
        await completeMutation.mutateAsync(task.id);
        return true;
      } else {
        await uncompleteMutation.mutateAsync(task.id);
        return false;
      }
    },
    onSuccess: finalCompleted => {
      updateTaskShadow(queryClient, task.id, {
        isCompleted: finalCompleted,
      });
    },
  });
};
```

**Hook de utilidad para colas**:

```typescript
// shared/hooks/useToggleMutationQueue.ts
export function useToggleMutationQueue<TServerState>({
  initialState,
  runMutation,
  onSuccess,
}: {
  initialState: TServerState;
  runMutation: (prevState: TServerState, nextIsOn: boolean) => Promise<TServerState>;
  onSuccess: (finalState: TServerState) => void;
}) {
  const [queue] = useState({
    activeTask: null as { isOn: boolean; resolve: Function; reject: Function } | null,
    queuedTask: null as { isOn: boolean; resolve: Function; reject: Function } | null,
  });

  async function processQueue() {
    if (queue.activeTask) return;

    let confirmedState: TServerState = initialState;
    try {
      while (queue.queuedTask) {
        const nextTask = queue.queuedTask;
        queue.activeTask = nextTask;
        queue.queuedTask = null;

        try {
          confirmedState = await runMutation(confirmedState, nextTask.isOn);
          nextTask.resolve(confirmedState);
        } catch (e) {
          nextTask.reject(e);
        }
      }
    } finally {
      onSuccess(confirmedState);
      queue.activeTask = null;
      queue.queuedTask = null;
    }
  }

  function queueToggle(isOn: boolean): Promise<TServerState> {
    return new Promise((resolve, reject) => {
      if (queue.activeTask) {
        queue.queuedTask = { isOn, resolve, reject };
      } else {
        queue.activeTask = { isOn, resolve, reject };
        processQueue();
      }
    });
  }

  return queueToggle;
}
```

#### 4. Optimistic Counts (Conteos Optimísticos)

Para conteos que cambian frecuentemente (como número de tareas completadas), mantener conteos optimísticos.

**Ejemplo**:

```typescript
// modules/tasks/hooks/useCompleteTask.ts
export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.completeTask(taskId),

    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: RQKEY_TASKS_LIST });

      queryClient.setQueryData(RQKEY_TASKS_LIST, (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map(task => {
          if (task.id === taskId) {
            const currentCompletedCount = task.house?.completedTasksCount ?? 0;
            return {
              ...task,
              status: 'completed',
              house: {
                ...task.house,
                optimisticCompletedCount: currentCompletedCount + 1,
              },
            };
          }
          return task;
        });
      });
    },
  });
};
```

### Mejores Prácticas

1. **Siempre revertir en caso de error**:
   - Usar `onError` para restaurar el estado anterior
   - Guardar snapshot en `onMutate` usando el contexto

2. **Cancelar queries en progreso**:
   - Usar `queryClient.cancelQueries()` en `onMutate` para evitar conflictos

3. **Invalidar después del éxito**:
   - Usar `onSuccess` o `onSettled` para invalidar queries y obtener datos frescos

4. **Manejar estados intermedios**:
   - Mostrar estados de "pending" cuando sea apropiado (ej: `likeUri: 'pending'`)

5. **Sincronizar múltiples queries**:
   - Si una entidad aparece en múltiples queries, actualizar todas optimísticamente

6. **Considerar límites de red**:
   - En conexiones lentas, optimistic UI es aún más valioso

### Ejemplo Completo: Toggle de Completado de Tarea

```typescript
// modules/tasks/hooks/useToggleTaskCompletion.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@modules/tasks/services/TaskService';
import { RQKEY_TASKS_LIST } from '@modules/tasks/hooks/useTasksList';
import { updateTaskShadow } from '@modules/tasks/cache/taskShadow';

export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) => {
      // Actualizar shadow inmediatamente
      updateTaskShadow(queryClient, taskId, {
        isCompleted: !isCompleted,
        completedAt: !isCompleted ? new Date() : undefined,
      });

      // Ejecutar mutación
      return isCompleted
        ? taskService.uncompleteTask(taskId)
        : taskService.completeTask(taskId);
    },

    onMutate: async ({ taskId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: RQKEY_TASKS_LIST });

      const previousTasks = queryClient.getQueryData(RQKEY_TASKS_LIST);

      queryClient.setQueryData(RQKEY_TASKS_LIST, (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map(task =>
          task.id === taskId
            ? {
                ...task,
                status: !isCompleted ? 'completed' : 'pending',
                completedAt: !isCompleted ? new Date() : undefined,
              }
            : task,
        );
      });

      return { previousTasks };
    },

    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(RQKEY_TASKS_LIST, context.previousTasks);
      }

      // Revertir shadow
      updateTaskShadow(queryClient, variables.taskId, {
        isCompleted: variables.isCompleted,
        completedAt: variables.isCompleted ? undefined : new Date(),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: RQKEY_TASKS_LIST });
    },
  });
};
```

### Consideraciones de Performance

- **Actualizaciones batch**: Agrupar múltiples actualizaciones optimísticas cuando sea posible
- **Debouncing**: Para acciones que pueden dispararse rápidamente, considerar debouncing
- **Memoización**: Usar `useMemo` para calcular estados derivados de shadows
- **WeakMap para shadows**: Usar WeakMap para evitar memory leaks con shadows

### Testing de Optimistic UI

Al testear optimistic updates:

1. Verificar que la UI se actualiza inmediatamente
2. Verificar que se revierte correctamente en caso de error
3. Verificar que se sincroniza con el servidor después del éxito
4. Verificar que múltiples clicks rápidos se manejan correctamente

## Internacionalización (i18n)

### Librería: Lingui

Bitify utiliza **Lingui** para la internacionalización. El idioma principal es **español** y el secundario es **inglés**.

**Librerías**:

- `@lingui/core`: Core de Lingui
- `@lingui/react`: Componentes React para Lingui
- `@lingui/macro`: Macros para extracción de mensajes

### Estructura de i18n

**Ubicación**: `src/locale/`

```
locale/
├── i18n.ts              # Configuración principal de i18n (native)
├── i18n.web.ts          # Configuración para web
├── i18nProvider.tsx     # Provider de i18n
├── helpers.ts           # Helpers de localización
├── deviceLocales.ts      # Detección de idioma del dispositivo
├── languages.ts         # Definición de idiomas soportados
└── locales/             # Archivos de traducción
    ├── es/
    │   └── messages.po  # Mensajes en español
    └── en/
        └── messages.po  # Mensajes en inglés
```

### Idiomas Soportados

**Idioma Principal**: Español (`es`)
**Idioma Secundario**: Inglés (`en`)

```typescript
// locale/languages.ts
export enum AppLanguage {
  ES = 'es',
  EN = 'en',
}

export interface Language {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: AppLanguage.ES, label: 'Spanish', nativeLabel: 'Español' },
  { code: AppLanguage.EN, label: 'English', nativeLabel: 'English' },
];
```

### Configuración de i18n

**Provider en AppProviders**:

```typescript
// src/AppProviders.tsx
import { I18nProvider } from '@locale/i18nProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {children}
      </I18nProvider>
    </QueryClientProvider>
  );
};
```

**Configuración de i18n**:

```typescript
// locale/i18n.ts
import { i18n } from '@lingui/core';
import { messages as messagesEs } from '@locale/locales/es/messages';
import { messages as messagesEn } from '@locale/locales/en/messages';
import { AppLanguage } from '@locale/languages';

export async function dynamicActivate(locale: AppLanguage): Promise<void> {
  switch (locale) {
    case AppLanguage.ES:
      i18n.loadAndActivate({ locale: 'es', messages: messagesEs });
      break;
    case AppLanguage.EN:
      i18n.loadAndActivate({ locale: 'en', messages: messagesEn });
      break;
    default:
      i18n.loadAndActivate({ locale: 'es', messages: messagesEs });
  }
}

export function useLocaleLanguage(): void {
  const { appLanguage } = useLanguagePrefs();

  useEffect(() => {
    dynamicActivate(appLanguage);
  }, [appLanguage]);
}
```

### Uso en Componentes

**Con macros de Lingui**:

```typescript
// modules/tasks/components/TaskCard.tsx
import { Trans, t, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { _ } = useLingui();

  return (
    <View>
      <Text>{task.title}</Text>
      <Text>{_(msg`Completada el ${task.completedAt}`)}</Text>
      <Button title={_(msg`Completar`)} />
    </View>
  );
};
```

**Con Trans para textos complejos**:

```typescript
import { Trans } from '@lingui/react';

<Trans>
  Tarea <Text style={styles.bold}>{task.title}</Text> completada
</Trans>
```

**Con variables**:

```typescript
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

const { _ } = useLingui();
const message = _(msg`Tienes ${count} tareas pendientes`, { count });
```

### Uso en Hooks y Utilidades

```typescript
// modules/tasks/hooks/useTasksList.ts
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const useTasksList = () => {
  const { _ } = useLingui();

  const errorMessage = _(msg`No se pudieron cargar las tareas`);

  // ...
};
```

### Detección de Idioma del Dispositivo

```typescript
// locale/deviceLocales.ts
import * as Localization from 'expo-localization';

export function getDeviceLocales(): string[] {
  return Localization.getLocales().map(locale => locale.languageCode);
}

export function getDeviceLanguage(): AppLanguage {
  const locales = getDeviceLocales();
  const firstLocale = locales[0] || 'es';

  if (firstLocale.startsWith('es')) {
    return AppLanguage.ES;
  }
  if (firstLocale.startsWith('en')) {
    return AppLanguage.EN;
  }

  return AppLanguage.ES; // Default a español
}
```

### Cambio de Idioma

El idioma se almacena en el storage persistente y se puede cambiar desde la configuración:

```typescript
// shared/hooks/useLanguagePrefs.ts
import { useStorage } from '@shared/storage';
import { device } from '@shared/storage';
import { AppLanguage } from '@locale/languages';
import { dynamicActivate } from '@locale/i18n';
import { useEffect } from 'react';

export const useLanguagePrefs = () => {
  const [appLanguage, setAppLanguage] = useStorage(device, ['appLanguage']);
  const currentLanguage = appLanguage || AppLanguage.ES;

  // Activar el idioma cuando cambia
  useEffect(() => {
    dynamicActivate(currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (language: AppLanguage) => {
    setAppLanguage(language);
    // dynamicActivate se llamará automáticamente por el useEffect
  };

  return {
    appLanguage: currentLanguage,
    changeLanguage,
  };
};
```

### Extracción de Mensajes

Lingui extrae automáticamente los mensajes usando macros:

```bash
# Extraer mensajes a archivos .po
npx lingui extract

# Compilar mensajes a JavaScript
npx lingui compile
```

### Convenciones

- **NO hardcodear strings**: Todos los textos visibles al usuario deben usar i18n
- **Usar macros**: Usar `msg`, `t`, `Trans` de `@lingui/macro`
- **IDs descriptivos**: Los mensajes se identifican por su contenido, no por IDs
- **Pluralización**: Usar pluralización de Lingui cuando sea necesario
- **Formateo de fechas/números**: Usar `Intl` APIs con el locale actual
