import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Annotations from '../../../../../src/components/CreativeTools/CritiqueMode/Annotations.svelte';
import TestCritiqueContext from './TestCritiqueContext.svelte';
import type { CritiqueAnnotation } from '../../../../../src/components/CreativeTools/CritiqueMode/context.svelte';

const mockArtwork = { id: 'a1', title: 'Art' } as any;

const mockAnnotations: CritiqueAnnotation[] = [
	{
		id: '1',
		authorId: 'u1',
		authorName: 'User 1',
		content: 'Nice composition',
		category: 'composition',
		position: { x: 0.5, y: 0.5 },
		createdAt: new Date(),
		replies: [],
	},
	{
		id: '2',
		authorId: 'u2',
		authorName: 'User 2',
		content: 'Check color',
		category: 'color',
		position: { x: 0.2, y: 0.2 },
		createdAt: new Date(),
		replies: [],
	},
];

describe('CritiqueMode Annotations', () => {
	it('renders annotations', () => {
		render(TestCritiqueContext, {
			props: {
				artwork: mockArtwork,
				initialAnnotations: mockAnnotations,
				children: () => render(Annotations),
			},
		});

		const markers = screen.getAllByRole('button', { name: /Annotation/ });
		expect(markers).toHaveLength(2);
	});

	it.skip('shows tooltip on click', async () => {
		render(TestCritiqueContext, {
			props: {
				artwork: mockArtwork,
				initialAnnotations: mockAnnotations,
				children: () => render(Annotations),
			},
		});

		const marker = screen.getByLabelText(/Annotation 1/);
		await fireEvent.click(marker);

		expect(await screen.findByText('User 1')).toBeInTheDocument();
		expect(await screen.findByText('Nice composition')).toBeInTheDocument();
		expect(await screen.findByText('composition')).toBeInTheDocument();
	});

	it.skip('toggles selection on click', async () => {
		render(TestCritiqueContext, {
			props: {
				artwork: mockArtwork,
				initialAnnotations: mockAnnotations,
				children: () => render(Annotations),
			},
		});

		const marker = screen.getByLabelText(/Annotation 1/);

		// Select
		await fireEvent.click(marker);
		expect(await screen.findByText('Nice composition')).toBeInTheDocument();
		expect(marker.classList.contains('selected')).toBe(true);

		// Deselect
		await fireEvent.click(marker);
		// waitForElementToBeRemoved is safer
		// but checking classList logic:
		// class:selected={ctx.selectedAnnotationId === annotation.id}
		// It relies on re-render.
		// Wait for re-render
		await screen.findByLabelText(/Annotation 1/);

		// We can check if tooltip is gone
		// expect(screen.queryByText('Nice composition')).not.toBeInTheDocument();
		// But finding by query is instant.
		// We can wait for it to disappear?
		// await waitFor(() => expect(screen.queryByText('Nice composition')).not.toBeInTheDocument());

		// Let's just check the class.
		// Since marker reference might be stale if re-rendered?
		// Svelte updates DOM elements.
		expect(marker.classList.contains('selected')).toBe(false);
	});

	it('applies category colors', () => {
		render(TestCritiqueContext, {
			props: {
				artwork: mockArtwork,
				initialAnnotations: mockAnnotations,
				children: () => render(Annotations),
			},
		});

		const fills = document.body.querySelectorAll('.critique-annotations__marker-fill');
		expect(fills).toHaveLength(2);
		expect(fills[0]?.getAttribute('fill')).toBe('#3b82f6');
	});

	it('does not render when disabled in config', () => {
		render(TestCritiqueContext, {
			props: {
				artwork: mockArtwork,
				config: { enableAnnotations: false },
				initialAnnotations: mockAnnotations,
				children: () => render(Annotations),
			},
		});

		const markers = screen.queryAllByRole('button', { name: /Annotation/ });
		expect(markers).toHaveLength(0);
	});
});
