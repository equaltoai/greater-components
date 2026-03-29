import { describe, expect, it } from 'vitest';
import { createTestConfig } from './fixtures/index.js';
import { getInstallTarget, getInstalledFilePath } from '../src/utils/install-path.js';

describe('install-path', () => {
	it('installs lib/lib virtual paths at the lib alias root', () => {
		const config = createTestConfig();

		const target = getInstallTarget('lib/lib/graphqlTimelineStore.svelte.ts', config, '/project');

		expect(target.targetDir).toBe('/project/src/lib');
		expect(target.relativePath).toBe('graphqlTimelineStore.svelte.ts');
		expect(getInstalledFilePath('lib/lib/graphqlTimelineStore.svelte.ts', config, '/project')).toBe(
			'/project/src/lib/graphqlTimelineStore.svelte.ts'
		);
	});

	it('keeps ordinary lib/components paths under the components subtree', () => {
		const config = createTestConfig();

		const target = getInstallTarget(
			'lib/components/TimelineVirtualized.svelte',
			config,
			'/project'
		);

		expect(target.targetDir).toBe('/project/src/lib');
		expect(target.relativePath).toBe('components/TimelineVirtualized.svelte');
	});
});
