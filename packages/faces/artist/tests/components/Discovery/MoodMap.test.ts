import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import MoodMap from '../../../src/components/Discovery/MoodMap.svelte';

describe('Discovery.MoodMap', () => {
	it('renders with default presets', () => {
		render(MoodMap);
		expect(screen.getByText('Mood Discovery')).toBeInTheDocument();
		expect(screen.getByText('Reset')).toBeInTheDocument();
		// 'Calm' appears in preset and label
		expect(screen.getAllByText('Calm').length).toBeGreaterThan(0);
		expect(screen.getByText('Joyful')).toBeInTheDocument();
	});

	it('handles preset selection', async () => {
		const onChange = vi.fn();
		render(MoodMap, { props: { onChange } });

		await fireEvent.click(screen.getByRole('button', { name: 'Select Joyful mood' }));

		expect(onChange).toHaveBeenCalledWith(
			expect.objectContaining({
				energy: 0.7,
				valence: 0.8,
			})
		);
	});

	it('handles clear selection', async () => {
		const onChange = vi.fn();
		render(MoodMap, { props: { selection: { x: 0.5, y: 0.5 }, onChange } });

		await fireEvent.click(screen.getByText('Reset'));

		expect(onChange).toHaveBeenCalledWith({ energy: 0, valence: 0 });
	});

	it('handles mouse interaction on map', async () => {
		const onChange = vi.fn();
		const { container } = render(MoodMap, { props: { onChange } });

		const map = container.querySelector('.mood-map__canvas');
		expect(map).toBeInTheDocument();

		if (map) {
			// Mock getBoundingClientRect
			vi.spyOn(map, 'getBoundingClientRect').mockReturnValue({
				left: 0,
				top: 0,
				width: 200,
				height: 200,
				bottom: 200,
				right: 200,
				x: 0,
				y: 0,
				toJSON: () => {},
			});

			// Mock setPointerCapture
			map.setPointerCapture = vi.fn();

			// Click center (100, 100) -> should be (0, 0)
			// formula: x = (client - left)/width * 2 - 1
			// y = 1 - (client - top)/height * 2

			// Click top-right (200, 0) -> x=1, y=1
			await fireEvent.pointerDown(map, { clientX: 200, clientY: 0, pointerId: 1 });
			expect(onChange).toHaveBeenCalledWith({ energy: 1, valence: 1 });

			// Drag to bottom-left (0, 200) -> x=-1, y=-1
			await fireEvent.pointerMove(map, { clientX: 0, clientY: 200, pointerId: 1 });
			expect(onChange).toHaveBeenCalledWith({ energy: -1, valence: -1 });

			await fireEvent.pointerUp(map, { pointerId: 1 });
		}
	});

	it('does not update on move if not dragging', async () => {
		const onChange = vi.fn();
		const { container } = render(MoodMap, { props: { onChange } });
		const map = container.querySelector('.mood-map__canvas');

		if (!map) throw new Error('Map canvas not found');

		vi.spyOn(map, 'getBoundingClientRect').mockReturnValue({
			left: 0,
			top: 0,
			width: 200,
			height: 200,
			bottom: 200,
			right: 200,
			x: 0,
			y: 0,
			toJSON: () => {},
		});

		await fireEvent.pointerMove(map, { clientX: 100, clientY: 100 });
		expect(onChange).not.toHaveBeenCalled();
	});

	it('displays current values', () => {
		render(MoodMap, { props: { selection: { x: 0.5, y: -0.5 } } });
		// 0.50 and -0.50
		expect(screen.getByText('0.50')).toBeInTheDocument();
		expect(screen.getByText('-0.50')).toBeInTheDocument();
	});
});
