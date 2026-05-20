import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type CmsContractType = 'Article' | 'Draft' | 'Publication' | 'DraftPreview';
type ContractDirection =
	| 'matches-greater-field'
	| 'needs-adapter-mapping'
	| 'out-of-scope-for-mvp'
	| 'should-not-leak-into-ui';

const LESSER_CMS_FIELD_DIRECTIONS = {
	Article: {
		id: 'matches-greater-field',
		slug: 'matches-greater-field',
		author: 'needs-adapter-mapping',
		title: 'needs-adapter-mapping',
		subtitle: 'needs-adapter-mapping',
		excerpt: 'needs-adapter-mapping',
		content: 'matches-greater-field',
		contentFormat: 'needs-adapter-mapping',
		featuredImage: 'needs-adapter-mapping',
		generatedBy: 'should-not-leak-into-ui',
		tableOfContents: 'out-of-scope-for-mvp',
		readingTimeMinutes: 'needs-adapter-mapping',
		wordCount: 'needs-adapter-mapping',
		series: 'out-of-scope-for-mvp',
		seriesOrder: 'out-of-scope-for-mvp',
		categories: 'needs-adapter-mapping',
		seoTitle: 'needs-adapter-mapping',
		seoDescription: 'needs-adapter-mapping',
		canonicalUrl: 'needs-adapter-mapping',
		ogImage: 'needs-adapter-mapping',
		editorNotes: 'should-not-leak-into-ui',
		reviewStatus: 'should-not-leak-into-ui',
		reviewedBy: 'should-not-leak-into-ui',
		publishedBy: 'should-not-leak-into-ui',
		publishedAt: 'needs-adapter-mapping',
		createdAt: 'out-of-scope-for-mvp',
		updatedAt: 'needs-adapter-mapping',
	},
	Draft: {
		id: 'matches-greater-field',
		author: 'should-not-leak-into-ui',
		contentType: 'out-of-scope-for-mvp',
		title: 'needs-adapter-mapping',
		slug: 'out-of-scope-for-mvp',
		content: 'matches-greater-field',
		contentFormat: 'needs-adapter-mapping',
		status: 'out-of-scope-for-mvp',
		scheduledAt: 'out-of-scope-for-mvp',
		objectId: 'out-of-scope-for-mvp',
		autosaveVersion: 'out-of-scope-for-mvp',
		lastSavedAt: 'needs-adapter-mapping',
		generatedBy: 'should-not-leak-into-ui',
		reviewedBy: 'should-not-leak-into-ui',
		createdAt: 'out-of-scope-for-mvp',
		updatedAt: 'out-of-scope-for-mvp',
	},
	Publication: {
		id: 'matches-greater-field',
		name: 'matches-greater-field',
		tagline: 'matches-greater-field',
		description: 'matches-greater-field',
		slug: 'out-of-scope-for-mvp',
		logoUrl: 'needs-adapter-mapping',
		bannerUrl: 'needs-adapter-mapping',
		customDomain: 'needs-adapter-mapping',
		actor: 'should-not-leak-into-ui',
		members: 'out-of-scope-for-mvp',
		createdAt: 'out-of-scope-for-mvp',
		updatedAt: 'out-of-scope-for-mvp',
	},
} satisfies Record<Exclude<CmsContractType, 'DraftPreview'>, Record<string, ContractDirection>>;

function findRepoRoot(start = process.cwd()): string {
	let current = start;

	for (;;) {
		if (existsSync(resolve(current, 'docs/lesser/contracts/graphql-schema.graphql'))) {
			return current;
		}

		const parent = dirname(current);
		if (parent === current) {
			throw new Error('Could not locate repository root from current working directory.');
		}
		current = parent;
	}
}

function readLesserSchema(): string {
	return readFileSync(
		resolve(findRepoRoot(), 'docs/lesser/contracts/graphql-schema.graphql'),
		'utf8'
	);
}

function extractTypeFields(schema: string, typeName: CmsContractType): string[] {
	const match = new RegExp(`^type ${typeName} \\{\\n([\\s\\S]*?)^\\}`, 'm').exec(schema);
	if (!match) {
		throw new Error(`Could not find GraphQL type ${typeName}`);
	}

	return match[1]
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'))
		.map((line) => line.split(':')[0].trim())
		.sort();
}

function extractQueryFields(schema: string): string[] {
	const match = /^extend type Query \{\n([\s\S]*?)^\}/m.exec(schema);
	if (!match) {
		throw new Error('Could not find GraphQL Query extension');
	}

	return match[1]
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'))
		.map((line) => line.split('(')[0].split(':')[0].trim())
		.sort();
}

function extractEnumValues(schema: string, enumName: string): string[] {
	const match = new RegExp(`^enum ${enumName} \\{\\n([\\s\\S]*?)^\\}`, 'm').exec(schema);
	if (!match) {
		throw new Error(`Could not find GraphQL enum ${enumName}`);
	}

	return match[1]
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);
}

describe('Lesser CMS contract boundary', () => {
	const schema = readLesserSchema();

	it.each(Object.keys(LESSER_CMS_FIELD_DIRECTIONS) as Exclude<CmsContractType, 'DraftPreview'>[])(
		'lists every Lesser %s field in the adapter-gap audit',
		(typeName) => {
			const contractFields = extractTypeFields(schema, typeName);
			const auditedFields = Object.keys(LESSER_CMS_FIELD_DIRECTIONS[typeName]).sort();

			expect(auditedFields).toEqual(contractFields);
		}
	);

	it('keeps Lesser server-side draft preview explicit for editor rendering boundaries', () => {
		expect(extractTypeFields(schema, 'DraftPreview' as CmsContractType)).toEqual([
			'draftId',
			'errors',
			'renderedBytes',
			'renderedHtml',
			'sourceBytes',
			'sourceFormat',
			'success',
		]);
		expect(extractQueryFields(schema)).toContain('draftPreview');
	});

	it('keeps the Article/Draft content-format boundary explicit', () => {
		expect(extractEnumValues(schema, 'ContentFormat')).toEqual(['HTML', 'MARKDOWN']);
	});
});
