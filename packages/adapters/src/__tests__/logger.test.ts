import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createConsoleLogger, resolveLogger, defaultLogger } from '../logger.js';
import type { TransportLogger } from '../types.js';

describe('logger', () => {
	describe('resolveLogger', () => {
		it('should return base logger if no logger provided', () => {
			const logger = resolveLogger();
			expect(logger).toBe(defaultLogger);
		});

		it('should return base logger properties if undefined', () => {
			const logger = resolveLogger(undefined);
			expect(logger).toBe(defaultLogger);
		});

		it('should merge provided logger with base logger', () => {
			const customLogger: TransportLogger = {
				debug: vi.fn(),
			};
			const resolved = resolveLogger(customLogger);
			expect(resolved.debug).toBe(customLogger.debug);
			expect(resolved.info).toBe(defaultLogger.info);
			expect(resolved.warn).toBe(defaultLogger.warn);
			expect(resolved.error).toBe(defaultLogger.error);
		});

		it('should use all provided logger methods', () => {
			const customLogger: Required<TransportLogger> = {
				debug: vi.fn(),
				info: vi.fn(),
				warn: vi.fn(),
				error: vi.fn(),
			};
			const resolved = resolveLogger(customLogger);
			expect(resolved).toEqual(customLogger);
		});
	});

	describe('createConsoleLogger', () => {
		let consoleMock: any;
		const originalConsole = globalThis.console;

		beforeEach(() => {
			consoleMock = {
				debug: vi.fn(),
				log: vi.fn(),
				info: vi.fn(),
				warn: vi.fn(),
				error: vi.fn(),
			};
			globalThis.console = consoleMock;
		});

		afterEach(() => {
			globalThis.console = originalConsole;
		});

		it('should create a logger with namespace', () => {
			const logger = createConsoleLogger('TestNS');
			logger.info('hello');
			expect(consoleMock.info).toHaveBeenCalledWith('[TestNS] INFO: hello', undefined);
		});

		it('should use console.log if debug/info missing', () => {
			consoleMock.debug = undefined;
			consoleMock.info = undefined;

			const logger = createConsoleLogger('TestNS');

			logger.debug('debug msg');
			expect(consoleMock.log).toHaveBeenCalledWith('[TestNS] DEBUG: debug msg', undefined);

			logger.info('info msg');
			expect(consoleMock.log).toHaveBeenCalledWith('[TestNS] INFO: info msg', undefined);
		});

		it('should pass context/error objects', () => {
			const logger = createConsoleLogger('TestNS');
			const context = { foo: 'bar' };
			const error = new Error('oops');

			logger.debug('d', context);
			expect(consoleMock.debug).toHaveBeenCalledWith('[TestNS] DEBUG: d', context);

			logger.warn('w', context);
			expect(consoleMock.warn).toHaveBeenCalledWith('[TestNS] WARN: w', context);

			logger.error('e', error);
			expect(consoleMock.error).toHaveBeenCalledWith('[TestNS] ERROR: e', error);
		});

		it('should handle missing console methods safely', () => {
			consoleMock.warn = undefined;
			consoleMock.error = undefined;

			const logger = createConsoleLogger('TestNS');

			// Should not throw
			logger.warn('warning');
			logger.error('error');
		});

		it('should handle missing console object', () => {
			(globalThis as any).console = undefined;
			const logger = createConsoleLogger('TestNS');

			// Should return base logger (noop)
			expect(logger.debug).toBe(defaultLogger.debug);

			// Should not throw
			logger.info('test');
		});
	});
});
