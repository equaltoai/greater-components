import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Editor from '../src/Editor.svelte';
import { getComposeContext } from '../src/context.js';

// Mock context
vi.mock('../src/context.js', () => ({
	getComposeContext: vi.fn(),
}));

describe('Editor', () => {
	const mockUpdateState = vi.fn();
	const mockContext = {
		state: {
			content: '',
			submitting: false,
		},
		config: {
			placeholder: 'What is on your mind?',
		},
		updateState: mockUpdateState,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getComposeContext).mockReturnValue(mockContext as any);
		mockContext.state.content = '';
		mockContext.state.submitting = false;
	});

	it('should render textarea with placeholder', () => {
		render(Editor);

		const textarea = screen.getByRole('textbox');
		expect(textarea).toBeTruthy();
		expect(textarea.getAttribute('placeholder')).toBe('What is on your mind?');
	});

	it('should update context on input', async () => {
		render(Editor);

		const textarea = screen.getByRole('textbox');
		await fireEvent.input(textarea, { target: { value: 'Hello' } });

		expect(mockUpdateState).toHaveBeenCalledWith({ content: 'Hello' });
	});

	it('should be disabled when submitting', () => {
		mockContext.state.submitting = true;
		render(Editor);

		const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea.disabled).toBe(true);
	});

	it('should autofocus if prop is set', async () => {
		render(Editor, { autofocus: true });

		const textarea = screen.getByRole('textbox');
		await waitFor(() => {
			expect(document.activeElement).toBe(textarea);
		});
	});

	it('should handle Ctrl+Enter to submit', async () => {
		const requestSubmit = vi.fn();
		// Mock form requestSubmit
		HTMLFormElement.prototype.requestSubmit = requestSubmit;

		const { container } = render(Editor);

		// Wrap in form since Editor looks for closest form
		// const form = document.createElement('form');
		// This is tricky with Testing Library as it renders into a container.
		// We can append the container to a form manually?
		// Or just mock `closest` on the element.

		const textarea = screen.getByRole('textbox');

		// We need the textarea to be inside a form for the code to work:
		// const form = textareaEl.closest('form');

		// Let's re-render inside a wrapper that includes a form if possible,
		// but `render` renders Component.
		// We can't easily wrap it in a real form element with `render`.
		// But we can verify event.preventDefault is called.

		const keyDownEvent = new KeyboardEvent('keydown', {
			key: 'Enter',
			ctrlKey: true,
			bubbles: true,
			cancelable: true,
		});

		const preventDefaultSpy = vi.spyOn(keyDownEvent, 'preventDefault');

		// To test form submission, we might need to mock `closest`
		// const closestMock = vi.fn().mockReturnValue({ requestSubmit });

		// We can't easily replace `closest` on the element created by Svelte inside `render`.
		// However, we can append the rendered component to a form in the document.
		const formEl = document.createElement('form');
		formEl.requestSubmit = requestSubmit;
		document.body.appendChild(formEl);

		// Move the rendered container into the form
		formEl.appendChild(container);

		await fireEvent(textarea, keyDownEvent);

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(requestSubmit).toHaveBeenCalled();

		document.body.removeChild(formEl);
	});

	it('should not write inline styles for autosize (CSP-safe)', async () => {
		render(Editor);
		const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
		const wrapper = textarea.parentElement;

		await fireEvent.input(textarea, { target: { value: 'Line 1\nLine 2' } });

		expect(textarea.style.height).toBe('');
		expect(wrapper?.classList.contains('gr-autosize-textarea')).toBe(true);
		expect(wrapper?.getAttribute('data-gr-value')).toBeDefined();
	});
});
