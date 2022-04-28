import { NSXLogger } from './logger.interface';

/**
 * A logger that does not log.
 */
export class NoopLogger implements NSXLogger {
    debug(_message: string, _context?: string): void {
        // noop!
    }

    error(_message: string, _context?: string, _trace?: string): void {
        // noop!
    }

    info(_message: string, _context?: string): void {
        // noop!
    }

    verbose(_message: string, _context?: string): void {
        // noop!
    }

    warn(_message: string, _context?: string): void {
        // noop!
    }
}
