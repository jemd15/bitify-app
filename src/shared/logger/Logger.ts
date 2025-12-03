import {
  LogContext,
  LogLevel,
  type Metadata,
  type Transport,
} from './types'
import {enabledLogLevels} from './util'
import {consoleTransport} from './transports/console'

const TRANSPORTS: Transport[] = [consoleTransport]

export class Logger {
  static Level = LogLevel
  static Context = LogContext

  level: LogLevel
  context: LogContext | undefined = undefined
  contextFilter: string = ''

  protected debugContextRegexes: RegExp[] = []
  protected transports: Transport[] = []

  static create(context?: LogContext): Logger {
    const logger = new Logger({
      level: (process.env.EXPO_PUBLIC_LOG_LEVEL as LogLevel) || LogLevel.Info,
      context,
      contextFilter: process.env.EXPO_PUBLIC_LOG_DEBUG || '',
    })
    for (const transport of TRANSPORTS) {
      logger.addTransport(transport)
    }
    return logger
  }

  constructor({
    level,
    context,
    contextFilter,
  }: {
    level?: LogLevel
    context?: LogContext
    contextFilter?: string
  } = {}) {
    this.context = context
    this.level = level || LogLevel.Info
    this.contextFilter = contextFilter || ''
    if (this.contextFilter) {
      this.level = LogLevel.Debug
    }
    this.debugContextRegexes = (this.contextFilter || '')
      .split(',')
      .map(filter => {
        return new RegExp(filter.replace(/[^\w:*-]/, '').replace(/\*/g, '.*'))
      })
  }

  debug(message: string, metadata: Metadata = {}): void {
    if (!__DEV__) return
    this.transport({level: LogLevel.Debug, message, metadata})
  }

  info(message: string, metadata: Metadata = {}): void {
    this.transport({level: LogLevel.Info, message, metadata})
  }

  log(message: string, metadata: Metadata = {}): void {
    this.transport({level: LogLevel.Log, message, metadata})
  }

  warn(message: string, metadata: Metadata = {}): void {
    this.transport({level: LogLevel.Warn, message, metadata})
  }

  error(errorOrMessage: Error | string, metadata: Metadata = {}): void {
    this.transport({level: LogLevel.Error, message: errorOrMessage, metadata})
  }

  addTransport(transport: Transport): () => void {
    this.transports.push(transport)
    return () => {
      this.transports.splice(this.transports.indexOf(transport), 1)
    }
  }

  protected transport({
    level,
    message,
    metadata = {},
  }: {
    level: LogLevel
    message: string | Error
    metadata: Metadata
  }): void {
    if (
      level === LogLevel.Debug &&
      !!this.contextFilter &&
      !!this.context &&
      !this.debugContextRegexes.find(reg => reg.test(this.context!))
    )
      return

    const timestamp = Date.now()

    if (!enabledLogLevels[this.level].includes(level)) return

    for (const transport of this.transports) {
      transport(level, this.context, message, metadata, timestamp)
    }
  }
}

