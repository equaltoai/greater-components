import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2020,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
		rules: {
			'svelte/no-at-html-tags': 'warn',
			'svelte/valid-compile': 'error',
			'svelte/no-reactive-reassign': 'error',
			'svelte/no-unused-svelte-ignore': 'warn',
			'svelte/require-each-key': 'error',
		},
	},
	{
		files: ['packages/icons/src/icons/*.svelte'],
		rules: {
			'svelte/valid-compile': 'off',
		},
	},
	{
		files: ['packages/primitives/src/components/Button.svelte', 'packages/primitives/src/components/TextField.svelte'],
		rules: {
			'svelte/valid-compile': ['error', {
				ignoreWarnings: true
			}],
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'no-console': ['warn', { allow: ['warn', 'error'] }],
		},
	},
	{
		files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
	{
		ignores: [
			'**/dist/**',
			'**/build/**',
			'**/.svelte-kit/**',
			'**/package/**',
			'**/.env',
			'**/.env.*',
			'!**/.env.example',
			'**/node_modules/**',
			'**/coverage/**',
			'**/.turbo/**',
			'**/.changeset/**',
			'**/playwright-report/**',
			'**/test-results/**',
			'**/storybook-static/**',
			'**/*.cjs',
			'**/*.config.js',
			'**/*.config.ts',
			'**/scripts/*.js',
		],
	},
];