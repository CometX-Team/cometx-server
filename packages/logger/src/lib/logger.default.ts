import chalk from 'chalk';

import { LogLevel, NSXLogger } from './logger.interface';

/**
 * @description
 * The default logger, which logs to the console (stdout) with optional timestamps. Since this logger is part of the
 * default CometX configuration, you do not need to specify it explicitly in your server config. You would only need
 * to specify it if you wish to change the log level (which defaults to `LogLevel.Info`) or remove the timestamp.
 *
 * @example
 * ```ts
 * import { DefaultLogger, LogLevel, CometXConfig } from '@cometx/api';
 *
 * export config: CometXConfig = {
 *     // ...
 *     logger: new DefaultLogger({ level: LogLevel.Debug, timestamp: false }),
 * }
 * ```
 *
 * @docsCategory Logger
 */
export class DefaultLogger implements NSXLogger {
    /** @internal */
    level: LogLevel = LogLevel.Info;
    private readonly timestamp: boolean;
    private defaultContext: string;
    private readonly localeStringOptions = {
        year: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
    } as const;

    constructor(options?: {
        level?: LogLevel;
        timestamp?: boolean;
        defaultContext?: string;
    }) {
        this.level =
            options && options.level != null ? options.level : LogLevel.Info;
        this.timestamp =
            options && options.timestamp !== undefined
                ? options.timestamp
                : true;
        this.defaultContext =
            options && options.defaultContext != null
                ? options.defaultContext
                : 'Context';
    }

    setDefaultContext(defaultContext: string) {
        this.defaultContext = defaultContext;
    }

    error(message: string, context?: string, trace?: string | undefined): void {
        if (context === 'ExceptionsHandler' && this.level < LogLevel.Verbose) {
            // In Nest v7, there is an ExternalExceptionFilter which catches *all*
            // errors and logs them, no matter the LogLevel attached to the error.
            // This results in overly-noisy logger output (e.g. a failed login attempt
            // will log a full stack trace). This check means we only let it log if
            // we are in Verbose or Debug mode.
            return;
        }
        if (this.level >= LogLevel.Error) {
            this.logMessage(
                chalk.red(`error`),
                chalk.red(
                    this.ensureString(message) + (trace ? `\n${trace}` : ''),
                ),
                context,
            );
        }
    }

    warn(message: string, context?: string): void {
        if (this.level >= LogLevel.Warn) {
            this.logMessage(
                chalk.yellow(`warn`),
                chalk.yellow(this.ensureString(message)),
                context,
            );
        }
    }

    info(message: string, context?: string): void {
        if (this.level >= LogLevel.Info) {
            this.logMessage(
                chalk.blue(`info`),
                this.ensureString(message),
                context,
            );
        }
    }

    verbose(message: string, context?: string): void {
        if (this.level >= LogLevel.Verbose) {
            this.logMessage(
                chalk.magenta(`verbose`),
                this.ensureString(message),
                context,
            );
        }
    }

    debug(message: string, context?: string): void {
        if (this.level >= LogLevel.Debug) {
            this.logMessage(
                chalk.magenta(`debug`),
                this.ensureString(message),
                context,
            );
        }
    }

    private logMessage(prefix: string, message: string, context?: string) {
        process.stdout.write(
            [
                prefix,
                this.logTimestamp(),
                this.logContext(context),
                message,
                '\n',
            ].join(' '),
        );
    }

    private logContext(context?: string) {
        return chalk.cyan(`[${context || this.defaultContext}]`);
    }

    private logTimestamp() {
        if (this.timestamp) {
            const timestamp = new Date(Date.now()).toLocaleString(
                undefined,
                this.localeStringOptions,
            );
            return chalk.gray(timestamp + ' -');
        } else {
            return '';
        }
    }

    private ensureString(message: string | object | any[]): string {
        return typeof message === 'string'
            ? message
            : JSON.stringify(message, null, 2);
    }
}
