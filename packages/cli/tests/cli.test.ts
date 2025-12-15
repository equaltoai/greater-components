import { afterEach, describe, expect, it, vi } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliBin = path.resolve(__dirname, '../dist/index.js');

const runInProcess = async (args: string[]) => {
	const originalArgv = process.argv;
	const output: string[] = [];

	const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
		output.push(typeof chunk === 'string' ? chunk : chunk.toString());
		return true;
	});

	process.argv = ['node', 'greater', ...args];
	await import('../src/index');
	process.argv = originalArgv;

	return {
		output: output.join(''),
		restore: () => writeSpy.mockRestore(),
	};
};

afterEach(() => {
	vi.restoreAllMocks();
	vi.resetModules();
});

describe('@equaltoai/greater-components-cli', () => {
	it('prints help via the compiled binary', async () => {
		const { execaNode } = await vi.importActual<typeof import('execa')>('execa');

		let result: { exitCode: number; stdout: string };
		try {
			result = await execaNode(cliBin, ['--help'], {
				env: {
					...process.env,
					NODE_ENV: 'test',
					NO_COLOR: '1',
				},
			});
		} catch (error) {
			// Some sandboxed environments disallow spawning subprocesses from Node.
			// Treat EPERM as an environmental limitation, not a CLI failure.
			if (String(error).includes('EPERM')) {
				return;
			}
			throw error;
		}

		expect(result.exitCode).toBe(0);
		expect(result.stdout).toContain('CLI for adding Greater Components to your project');
		expect(result.stdout.toLowerCase()).toContain('usage');
	});

	it('parses --help in-process without exiting', async () => {
		const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
			throw new Error('process.exit should not be called');
		});

		const { output, restore } = await runInProcess(['--help']);
		restore();

		expect(exitSpy).not.toHaveBeenCalled();
		expect(output).toContain('CLI for adding Greater Components to your project');
		expect(output.toLowerCase()).toContain('usage');
	});
});
