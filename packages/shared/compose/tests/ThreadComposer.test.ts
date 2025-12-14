import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThreadComposer from '../src/ThreadComposer.svelte';
import * as UnicodeCounter from '../src/UnicodeCounter.js';

// Mock UnicodeCounter
vi.mock('../src/UnicodeCounter.js', async (importOriginal) => {
	const actual = await importOriginal<typeof UnicodeCounter>();
	return {
		...actual,
		countWeightedCharacters: vi.fn((text, _options) => {
			const count = text.length;
			return {
				count,
				graphemeCount: count,
				urls: 0,
				mentions: 0,
				hashtags: 0,
			};
		}),
	};
});

// Mock headless button
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: () => ({
		actions: {
			button: (_node: HTMLElement) => ({
				destroy: () => {},
			}),
		},
	}),
}));

// Mock crypto.randomUUID
global.crypto.randomUUID = vi.fn(() => `uuid-${Math.random()}`) as any;

describe('ThreadComposer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render initial state with one post', () => {
		render(ThreadComposer);

		expect(screen.getByText('Compose Thread')).toBeTruthy();
		expect(screen.getByText('1 / 10 posts')).toBeTruthy();
		expect(screen.getAllByRole('listitem')).toHaveLength(1);
		expect(screen.getByRole('textbox')).toBeTruthy();
	});

	it('should add a post when "Add post" is clicked', async () => {
		render(ThreadComposer);

		const addButton = screen.getByText('Add post to thread');
		await fireEvent.click(addButton);

		expect(screen.getAllByRole('listitem')).toHaveLength(2);
		expect(screen.getByText('2 / 10 posts')).toBeTruthy();
		// Check for post numbers
		expect(screen.getByText('1')).toBeTruthy();
		expect(screen.getByText('2')).toBeTruthy();
	});

	it('should respect max posts limit', async () => {
		render(ThreadComposer, { maxPosts: 2 });

		const addButton = screen.getByText('Add post to thread');
		await fireEvent.click(addButton); // Now have 2
		expect(screen.getAllByRole('listitem')).toHaveLength(2);

		await fireEvent.click(addButton); // Try to add 3rd
		expect(screen.getAllByRole('listitem')).toHaveLength(2);
		expect(screen.getByRole('alert').textContent).toContain('Maximum 2 posts per thread');
	});

	it('should remove a post', async () => {
		render(ThreadComposer);

		// Add a second post
		const addButton = screen.getByText('Add post to thread');
		await fireEvent.click(addButton);

		expect(screen.getAllByRole('listitem')).toHaveLength(2);

		// Remove the first post
		const removeButtons = screen.getAllByLabelText('Remove post');
		await fireEvent.click(removeButtons[0]);

		expect(screen.getAllByRole('listitem')).toHaveLength(1);
	});

	it('should prevent removing the last post', async () => {
		render(ThreadComposer);

		const removeButton = screen.getByLabelText('Remove post');
		await fireEvent.click(removeButton);

		expect(screen.getAllByRole('listitem')).toHaveLength(1);
		expect(screen.getByRole('alert').textContent).toContain('Thread must have at least one post');
	});

	it('should update character count and validate limit', async () => {
		render(ThreadComposer, { characterLimit: 10 });

		const textarea = screen.getByRole('textbox');

		// Type within limit
		await fireEvent.input(textarea, { target: { value: '12345' } });
		expect(screen.getByText('5 / 10')).toBeTruthy();

		// Type over limit
		await fireEvent.input(textarea, { target: { value: '12345678901' } }); // 11 chars
		expect(screen.getByText('11 / 10')).toBeTruthy();
		// Verify over-limit class or attribute if possible, but text update confirms logic ran
	});

	it('should move posts up and down', async () => {
		render(ThreadComposer);

		// Add post 2
		const addButton = screen.getByText('Add post to thread');
		await fireEvent.click(addButton);

		const textareas = screen.getAllByRole('textbox');
		await fireEvent.input(textareas[0], { target: { value: 'Post 1' } });
		await fireEvent.input(textareas[1], { target: { value: 'Post 2' } });

		// Move Post 2 up
		const moveUpButtons = screen.getAllByLabelText('Move post up');
		await fireEvent.click(moveUpButtons[1]); // Click 'up' on second post

		const newTextareas = screen.getAllByRole('textbox') as HTMLTextAreaElement[];
		expect(newTextareas[0].value).toBe('Post 2');
		expect(newTextareas[1].value).toBe('Post 1');

		// Move Post 2 (now at index 0) down
		const moveDownButtons = screen.getAllByLabelText('Move post down');
		await fireEvent.click(moveDownButtons[0]); // Click 'down' on first post

		const finalTextareas = screen.getAllByRole('textbox') as HTMLTextAreaElement[];
		expect(finalTextareas[0].value).toBe('Post 1');
		expect(finalTextareas[1].value).toBe('Post 2');
	});

	it('should submit valid thread', async () => {
		const onSubmitThread = vi.fn().mockResolvedValue(undefined);
		render(ThreadComposer, { onSubmitThread });

		const textarea = screen.getByRole('textbox');
		await fireEvent.input(textarea, { target: { value: 'Hello world' } });

		const submitButton = screen.getByText(/Post thread/);
		await fireEvent.click(submitButton);

		await waitFor(() => {
			expect(onSubmitThread).toHaveBeenCalledTimes(1);
			expect(onSubmitThread).toHaveBeenCalledWith([
				expect.objectContaining({ content: 'Hello world' }),
			]);
		});
	});

	it('should handle submit error', async () => {
		const onSubmitThread = vi.fn().mockRejectedValue(new Error('API Error'));
		render(ThreadComposer, { onSubmitThread });

		const textarea = screen.getByRole('textbox');
		await fireEvent.input(textarea, { target: { value: 'Hello world' } });

		const submitButton = screen.getByText(/Post thread/);
		await fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByRole('alert').textContent).toContain('API Error');
		});
	});

	it('should validate before submit', async () => {
		const onSubmitThread = vi.fn();
		render(ThreadComposer, { onSubmitThread, characterLimit: 5 });

		const textarea = screen.getByRole('textbox');
		// Over limit
		await fireEvent.input(textarea, { target: { value: 'Too long' } }); // 8 chars

		const submitButton = screen.getByText(/Post thread/) as HTMLButtonElement;

		// Button should be disabled via CSS/logic
		expect(submitButton.disabled).toBe(true);
	});

	it('should prevent submitting empty thread', async () => {
		const onSubmitThread = vi.fn();
		render(ThreadComposer, { onSubmitThread });

		const submitButton = screen.getByText(/Post thread/) as HTMLButtonElement;
		expect(submitButton.disabled).toBe(true); // 0 posts with content
	});

	it('should handle cancel', async () => {
		const onCancel = vi.fn();
		render(ThreadComposer, { onCancel });

		const cancelButton = screen.getByText('Cancel');
		await fireEvent.click(cancelButton);

		expect(onCancel).toHaveBeenCalled();
	});

	it('should reset on cancel if no handler', async () => {
		render(ThreadComposer);

		// Add content and post
		const addButton = screen.getByText('Add post to thread');
		await fireEvent.click(addButton);
		const textareas = screen.getAllByRole('textbox');
		await fireEvent.input(textareas[0], { target: { value: 'Draft' } });

		const cancelButton = screen.getByText('Cancel');
		await fireEvent.click(cancelButton);

		// Should reset to 1 empty post
		expect(screen.getAllByRole('listitem')).toHaveLength(1);
		const newTextarea = screen.getByRole('textbox') as HTMLTextAreaElement;
		expect(newTextarea.value).toBe('');
	});
});
