import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Editor } from '../../../src/components/Editor/index.js';
import EditorTestWrapper from '../../fixtures/EditorTestWrapper.svelte';

describe('Editor Components Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Editor Subcomponents', () => {
		const components = [{ name: 'Toolbar', Component: Editor.Toolbar }];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(EditorTestWrapper, {
				props: {
					component: Component,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('Editor.Root', () => {
		it('renders without errors', () => {
			render(EditorTestWrapper);
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
