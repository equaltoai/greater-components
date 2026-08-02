import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

const scratchDirectories: string[] = [];

afterEach(() => {
	for (const directory of scratchDirectories.splice(0)) {
		rmSync(directory, { recursive: true, force: true });
	}
});

describe('createLesserMessagesHandlers non-Apollo consumer', () => {
	it('typechecks the vendored binding without GraphQL client packages installed', () => {
		const scratch = mkdtempSync(join(tmpdir(), 'greater-messages-no-apollo-'));
		scratchDirectories.push(scratch);

		const adaptersSource = dirname(dirname(fileURLToPath(import.meta.url)));
		cpSync(adaptersSource, join(scratch, 'vendor'), { recursive: true });

		writeFileSync(
			join(scratch, 'consumer.ts'),
			`import {
	createLesserMessagesHandlers,
	type LesserMessagesAdapter,
} from './vendor/messaging/createLesserMessagesHandlers.js';

const adapter: LesserMessagesAdapter = {
	query: async () => ({} as never),
	mutate: async () => ({} as never),
	getConversations: async () => [],
	getConversation: async () => null,
	markConversationAsRead: async () => undefined,
	search: async () => ({ accounts: [] }),
	subscribeToConversationUpdates: () => ({
		subscribe: () => ({ unsubscribe() {} }),
	}),
};

createLesserMessagesHandlers({ adapter });
`
		);

		writeFileSync(
			join(scratch, 'tsconfig.json'),
			JSON.stringify({
				compilerOptions: {
					target: 'ES2022',
					module: 'NodeNext',
					moduleResolution: 'NodeNext',
					strict: true,
					noEmit: true,
					types: [],
					lib: ['ES2022', 'DOM'],
				},
				files: ['consumer.ts'],
			})
		);

		const tscPath = join(process.cwd(), '../../node_modules/typescript/bin/tsc');
		const result = spawnSync(process.execPath, [tscPath, '-p', join(scratch, 'tsconfig.json')], {
			cwd: scratch,
			encoding: 'utf8',
		});

		expect(result.status, `${result.stdout}${result.stderr}`).toBe(0);
		expect(result.stdout).toBe('');
		expect(existsSync(join(scratch, 'node_modules'))).toBe(false);
	});
});
