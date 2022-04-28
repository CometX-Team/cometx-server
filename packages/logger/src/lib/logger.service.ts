import { LoggerService } from '@nestjs/common';

import { NSXLogger } from './logger.interface';

const noopLogger: NSXLogger = {
    error() {
        /* */
    },
    warn() {
        /* */
    },
    info() {
        /* */
    },
    verbose() {
        /* */
    },
    debug() {
        /* */
    },
};

/**
 * @description
 * The Logger is responsible for all logging in a CometX application.
 *
 * It is intended to be used as a static class:
 *
 * @example
 * ```ts
 * import { Logger } from '\@cometx/api';
 *
 * Logger.info(`Some log message`, 'My CometX Plugin');
 * ```
 *
 * The actual implementation - where the logs are written to - is defined by the {@link NSXLogger}
 * instance configured in the {@link CometXConfig}. By default, the {@link DefaultLogger} is used, which
 * logs to the console.
 *
 * ## Implementing a custom logger
 *
 * A custom logger can be passed to the `logger` config option by creating a class which implements the
 * {@link NSXLogger} interface. For example, here is how you might go about implementing a logger which
 * logs to a file:
 *
 * @example
 * ```ts
 * import { NSXLogger } from '\@cometx/api';
 * import fs from 'fs';
 *
 * // A simple custom logger which writes all logs to a file.
 * export class SimpleFileLogger implements NSXLogger {
 *     private logfile: fs.WriteStream;
 *
 *     constructor(logfileLocation: string) {
 *         this.logfile = fs.createWriteStream(logfileLocation, { flags: 'w' });
 *     }
 *
 *     error(message: string, context?: string) {
 *         this.logfile.write(`ERROR: [${context}] ${message}\n`);
 *     }
 *     warn(message: string, context?: string) {
 *         this.logfile.write(`WARN: [${context}] ${message}\n`);
 *     }
 *     info(message: string, context?: string) {
 *         this.logfile.write(`INFO: [${context}] ${message}\n`);
 *     }
 *     verbose(message: string, context?: string) {
 *         this.logfile.write(`VERBOSE: [${context}] ${message}\n`);
 *     }
 *     debug(message: string, context?: string) {
 *         this.logfile.write(`DEBUG: [${context}] ${message}\n`);
 *     }
 * }
 *
 * // in the CometXConfig
 * export const config = {
 *     // ...
 *     logger: new SimpleFileLogger('server.log'),
 * }
 * ```
 *
 * @docsCategory Logger
 */

export class Logger implements LoggerService {
    private static _instance: typeof Logger = Logger;
    private static _logger: NSXLogger;

    static get logger(): NSXLogger {
        return this._logger || noopLogger;
    }

    private get instance(): typeof Logger {
        const { _instance } = Logger;
        return _instance;
    }

    /** @internal */
    static useLogger(logger: NSXLogger) {
        Logger._logger = logger;
    }

    /** @internal */
    error(message: any, trace?: string, context?: string): any {
        this.instance.error(message, context, trace);
    }

    /** @internal */
    warn(message: any, context?: string): any {
        this.instance.warn(message, context);
    }

    /** @internal */
    log(message: any, context?: string): any {
        this.instance.info(message, context);
    }

    /** @internal */
    verbose(message: any, context?: string): any {
        this.instance.verbose(message, context);
    }

    /** @internal */
    debug(message: any, context?: string): any {
        this.instance.debug(message, context);
    }

    static error(message: string, context?: string, trace?: string): void {
        Logger.logger.error(message, context, trace);
    }

    static warn(message: string, context?: string): void {
        Logger.logger.warn(message, context);
    }

    static info(message: string, context?: string): void {
        Logger.logger.info(message, context);
    }

    static verbose(message: string, context?: string): void {
        Logger.logger.verbose(message, context);
    }

    static debug(message: string, context?: string): void {
        Logger.logger.debug(message, context);
    }
}
