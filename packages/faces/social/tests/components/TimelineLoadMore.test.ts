import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import TimelineLoadMore from '../../src/components/Timeline/LoadMore.svelte';

describe('Timeline.LoadMore standalone composition', () => {
	it('loads another page without requiring Timeline.Root context', async () => {
		const onLoadMore = vi.fn().mockResolvedValue(undefined);
		render(TimelineLoadMore, { props: { onLoadMore, hasMore: true } });

		await fireEvent.click(screen.getByRole('button', { name: 'Load more' }));

		await waitFor(() => expect(onLoadMore).toHaveBeenCalledOnce());
	});

	it('hides when a virtualized timeline has reached its end', () => {
		render(TimelineLoadMore, { props: { onLoadMore: vi.fn(), hasMore: false } });

		expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
	});
});
