import type { ArchiveEntry, TagData, CategoryData } from '../../src/types.js';

export function createMockTags(count: number = 5): TagData[] {
	return Array.from({ length: count }, (_, i) => ({
		id: `tag-id-${i}`,
		slug: `tag-${i}`,
		name: i === 0 ? 'javascript' : `Tag ${i}`,
		count: (i + 1) * 10,
	}));
}

export function createMockArchiveData(): ArchiveEntry[] {
	return [
		{
			year: 2023,
			month: 1,
			count: 5,
			url: '/archive/2023/01',
		},
		{
			year: 2023,
			month: 2,
			count: 3,
			url: '/archive/2023/02',
		},
		{
			year: 2022,
			month: 12,
			count: 10,
			url: '/archive/2022/12',
		},
	];
}

export function createMockCategories(count: number = 3): CategoryData[] {
	return Array.from({ length: count }, (_, i) => ({
		id: `cat-id-${i}`,
		slug: `category-${i}`,
		name: `Category ${i}`,
		count: (i + 1) * 5,
		description: `Description for category ${i}`,
	}));
}
