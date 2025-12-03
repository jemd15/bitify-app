/**
 * Logger contexts, defined here and used via `Logger.Context.*` static prop.
 */
export enum LogContext {
  Default = 'logger',
  Auth = 'auth',
  Tasks = 'tasks',
  House = 'house',
  Network = 'network',
  Storage = 'storage',
}

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
}

export type Transport = (
  level: LogLevel,
  context: LogContext | undefined,
  message: string | Error,
  metadata: Metadata,
  timestamp: number,
) => void

export type Metadata = {
  /**
   * Reserved for appending `LogContext` in logging payloads
   */
  __context__?: undefined

  /**
   * Applied as breadcrumb types. Defaults to `default`.
   */
  type?:
    | 'default'
    | 'debug'
    | 'error'
    | 'navigation'
    | 'http'
    | 'info'
    | 'query'
    | 'transaction'
    | 'ui'
    | 'user'

  /**
   * Tags for categorizing logs
   */
  tags?: {
    [key: string]: number | string | boolean | null | undefined
  }

  /**
   * Any additional data
   */
  [key: string]: Serializable | Error | unknown
}

export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Serializable[]
  | {
      [key: string]: Serializable
    }

