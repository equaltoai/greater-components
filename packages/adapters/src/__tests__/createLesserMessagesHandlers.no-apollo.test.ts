import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { afterEach, describe, expect, it } from 'vitest';

const scratchDirectories: string[] = [];

afterEach(() => {
	for (const directory of scratchDirectories.splice(0)) {
		rmSync(directory, { recursive: true, force: true });
	}
});

function isWithin(root: string, candidate: string): boolean {
	const pathFromRoot = relative(root, candidate);
	return pathFromRoot === '' || (!pathFromRoot.startsWith('..') && !isAbsolute(pathFromRoot));
}

function compileHermetically(scratch: string, consumerPath: string): readonly ts.Diagnostic[] {
	const options: ts.CompilerOptions = {
		target: ts.ScriptTarget.ES2022,
		module: ts.ModuleKind.NodeNext,
		moduleResolution: ts.ModuleResolutionKind.NodeNext,
		strict: true,
		noEmit: true,
		types: [],
	};
	const host = ts.createCompilerHost(options);

	// Only relative/absolute imports that resolve inside the fixture are legal.
	// This prevents NodeNext from walking to any ancestor node_modules directory;
	// TypeScript's standard libraries continue to load through the normal host.
	host.resolveModuleNames = (moduleNames, containingFile) =>
		moduleNames.map((moduleName) => {
			if (!moduleName.startsWith('.') && !isAbsolute(moduleName)) return undefined;
			const resolved = ts.resolveModuleName(
				moduleName,
				containingFile,
				options,
				host
			).resolvedModule;
			return resolved && isWithin(scratch, resolved.resolvedFileName) ? resolved : undefined;
		});

	const program = ts.createProgram({ rootNames: [consumerPath], options, host });
	return ts.getPreEmitDiagnostics(program);
}

function formatDiagnostics(diagnostics: readonly ts.Diagnostic[]): string {
	return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
		getCanonicalFileName: (fileName) => fileName,
		getCurrentDirectory: () => process.cwd(),
		getNewLine: () => '\n',
	});
}

function createFixture(): { parent: string; scratch: string; consumerPath: string } {
	const parent = mkdtempSync(join(tmpdir(), 'greater-messages-no-apollo-'));
	scratchDirectories.push(parent);
	const scratch = join(parent, 'consumer');
	mkdirSync(scratch);

	// Deliberately plant the exact ancestor decoy that made the old assertion
	// spuriously green. The hermetic resolver must never consult it.
	const decoyDirectory = join(parent, 'node_modules', '@apollo', 'client');
	mkdirSync(decoyDirectory, { recursive: true });
	writeFileSync(join(decoyDirectory, 'index.d.ts'), 'export interface ApolloDecoy {}\n');
	writeFileSync(
		join(decoyDirectory, 'package.json'),
		'{"name":"@apollo/client","types":"index.d.ts"}\n'
	);

	const adaptersSource = dirname(dirname(fileURLToPath(import.meta.url)));
	cpSync(adaptersSource, join(scratch, 'vendor'), { recursive: true });
	const consumerPath = join(scratch, 'consumer.ts');
	writeFileSync(
		consumerPath,
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

class ParameterDriftProbe implements LesserMessagesAdapter {
	query = adapter.query;
	mutate = adapter.mutate;
	getConversations = adapter.getConversations;
	// This must remain an error: method bivariance must not accept a narrower parameter.
	// @ts-expect-error deliberate compile-time parameter drift probe
	getConversation(id: 'only-this-literal') {
		return Promise.resolve(null);
	}
	markConversationAsRead = adapter.markConversationAsRead;
	search = adapter.search;
	subscribeToConversationUpdates = adapter.subscribeToConversationUpdates;
}

void ParameterDriftProbe;
createLesserMessagesHandlers({ adapter });
`
	);

	return { parent, scratch, consumerPath };
}

describe('createLesserMessagesHandlers non-Apollo consumer', () => {
	it('typechecks with a resolver pinned away from ancestor node_modules', () => {
		const { scratch, consumerPath } = createFixture();
		const diagnostics = compileHermetically(scratch, consumerPath);

		expect(formatDiagnostics(diagnostics)).toBe('');
	});

	it('rejects an Apollo type leak even when an ancestor decoy could satisfy it', () => {
		const { scratch, consumerPath } = createFixture();
		const bindingPath = join(scratch, 'vendor', 'messaging', 'createLesserMessagesHandlers.ts');
		writeFileSync(
			bindingPath,
			`import type { ApolloDecoy } from '@apollo/client';\ntype ApolloLeak = ApolloDecoy;\nvoid (undefined as unknown as ApolloLeak);\n${readFileSync(bindingPath, 'utf8')}`
		);

		const diagnostics = compileHermetically(scratch, consumerPath);
		const output = formatDiagnostics(diagnostics);

		expect(output).toContain("Cannot find module '@apollo/client'");
	});
});
