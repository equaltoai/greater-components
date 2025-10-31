import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: 'schemas/lesser/schema.graphql',
	documents: 'packages/fediverse/src/adapters/graphql/documents/**/*.graphql',
	generates: {
		'packages/fediverse/src/adapters/graphql/generated/types.ts': {
			plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
			config: {
				skipTypename: false,
				withHooks: false,
				withComponent: false,
				withHOC: false,
				enumsAsTypes: true,
				constEnums: false,
				immutableTypes: true,
				maybeValue: 'T | null | undefined',
				inputMaybeValue: 'T | null',
				scalars: {
					Time: 'string',
					Cursor: 'string',
					Duration: 'string',
					Upload: 'File | Blob',
				},
				namingConvention: {
					typeNames: 'pascal-case#pascalCase',
					enumValues: 'upper-case#upperCase',
					transformUnderscore: true,
				},
				avoidOptionals: {
					field: false,
					inputValue: false,
					object: false,
				},
				nonOptionalTypename: true,
			},
		},
		'packages/adapters/src/graphql/generated/types.ts': {
			plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
			config: {
				skipTypename: false,
				withHooks: false,
				withComponent: false,
				withHOC: false,
				enumsAsTypes: true,
				constEnums: false,
				immutableTypes: true,
				maybeValue: 'T | null | undefined',
				inputMaybeValue: 'T | null',
				scalars: {
					Time: 'string',
					Cursor: 'string',
					Duration: 'string',
					Upload: 'File | Blob',
				},
				namingConvention: {
					typeNames: 'pascal-case#pascalCase',
					enumValues: 'upper-case#upperCase',
					transformUnderscore: true,
				},
				avoidOptionals: {
					field: false,
					inputValue: false,
					object: false,
				},
				nonOptionalTypename: true,
			},
		},
		'packages/fediverse/src/adapters/graphql/generated/introspection.json': {
			plugins: ['introspection'],
		},
		'packages/fediverse/src/adapters/graphql/generated/possible-types.ts': {
			plugins: ['fragment-matcher'],
		},
	},
	hooks: {
		afterAllFileWrite: ['prettier --write', 'eslint --fix'],
	},
};

export default config;
