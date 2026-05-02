import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import CustomEmojiPicker from '../../src/patterns/CustomEmojiPicker.svelte';

describe('CustomEmojiPicker', () => {
	it('prefers onSelectUnicode for Unicode fallback selections', async () => {
		const onSelect = vi.fn();
		const onSelectUnicode = vi.fn();

		render(CustomEmojiPicker, {
			props: {
				emojis: [],
				handlers: { onSelect, onSelectUnicode },
			},
		});

		await fireEvent.click(screen.getByRole('button', { name: 'grinning face' }));

		expect(onSelectUnicode).toHaveBeenCalledWith('😀');
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('marks Unicode fallback selections for onSelect-only consumers', async () => {
		const onSelect = vi.fn();

		render(CustomEmojiPicker, {
			props: {
				emojis: [],
				handlers: { onSelect },
			},
		});

		await fireEvent.click(screen.getByRole('button', { name: 'grinning face' }));

		expect(onSelect).toHaveBeenCalledWith(
			expect.objectContaining({
				shortcode: '😀',
				isUnicode: true,
				unicode: '😀',
			})
		);
	});
});
