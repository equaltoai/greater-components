/**
 * Compose Compound Component Tests
 * 
 * Comprehensive tests for Compose components including:
 * - Context creation and management
 * - Character counting and limits
 * - Media attachment handling
 * - Visibility settings
 * - Content warnings
 * - State management
 * - Event handlers (onSubmit, onMediaUpload, onMediaRemove, onSaveDraft, onCancel)
 * - Reset functionality
 * - Edge cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	createComposeContext,
	getComposeContext,
	hasComposeContext,
	type ComposeContext,
	type ComposeConfig,
	type ComposeHandlers,
	type ComposeState,
	type PostVisibility,
	type ComposeAttachment,
} from '../src/components/Compose/context';

// Mock Svelte context
const contexts = new Map();
vi.mock('svelte', () => ({
	getContext: (key: symbol) => contexts.get(key),
	setContext: (key: symbol, value: any) => contexts.set(key, value),
}));

// Helper to create mock file
function createMockFile(name: string, size: number = 1024): File {
	return new File(['x'.repeat(size)], name, { type: 'image/jpeg' });
}

// Helper to create mock attachment
function createMockAttachment(id: string): ComposeAttachment {
	return {
		id,
		file: createMockFile(`image${id}.jpg`),
		progress: 100,
		description: `Alt text for image ${id}`,
		url: `https://example.com/media/${id}.jpg`,
		type: 'image',
	};
}

describe('Compose Context', () => {
	beforeEach(() => {
		contexts.clear();
	});

	describe('createComposeContext', () => {
		it('should create context with default configuration', () => {
			const context = createComposeContext();

			expect(context.config.characterLimit).toBe(500);
			expect(context.config.allowMedia).toBe(true);
			expect(context.config.maxMediaAttachments).toBe(4);
			expect(context.config.allowPolls).toBe(true);
			expect(context.config.allowContentWarnings).toBe(true);
			expect(context.config.defaultVisibility).toBe('public');
			expect(context.config.enableMarkdown).toBe(false);
			expect(context.config.placeholder).toBe("What's on your mind?");
			expect(context.config.class).toBe('');
		});

		it('should create context with custom configuration', () => {
			const config: ComposeConfig = {
				characterLimit: 280,
				allowMedia: false,
				maxMediaAttachments: 2,
				allowPolls: false,
				allowContentWarnings: false,
				defaultVisibility: 'unlisted',
				enableMarkdown: true,
				placeholder: 'Write something...',
				class: 'custom-compose',
			};

			const context = createComposeContext(config);

			expect(context.config.characterLimit).toBe(280);
			expect(context.config.allowMedia).toBe(false);
			expect(context.config.maxMediaAttachments).toBe(2);
			expect(context.config.allowPolls).toBe(false);
			expect(context.config.allowContentWarnings).toBe(false);
			expect(context.config.defaultVisibility).toBe('unlisted');
			expect(context.config.enableMarkdown).toBe(true);
			expect(context.config.placeholder).toBe('Write something...');
			expect(context.config.class).toBe('custom-compose');
		});

		it('should create context with default state', () => {
			const context = createComposeContext();

			expect(context.state.content).toBe('');
			expect(context.state.contentWarning).toBe('');
			expect(context.state.visibility).toBe('public');
			expect(context.state.mediaAttachments).toEqual([]);
			expect(context.state.submitting).toBe(false);
			expect(context.state.error).toBe(null);
			expect(context.state.characterCount).toBe(0);
			expect(context.state.overLimit).toBe(false);
			expect(context.state.inReplyTo).toBeUndefined();
			expect(context.state.contentWarningEnabled).toBe(false);
		});

		it('should create context with custom initial state', () => {
			const initialState: Partial<ComposeState> = {
				content: 'Initial content',
				contentWarning: 'Warning',
				visibility: 'unlisted',
				mediaAttachments: [createMockAttachment('1')],
				submitting: false,
				error: null,
				inReplyTo: 'status-123',
				contentWarningEnabled: true,
			};

			const context = createComposeContext({}, {}, initialState);

			expect(context.state.content).toBe('Initial content');
			expect(context.state.contentWarning).toBe('Warning');
			expect(context.state.visibility).toBe('unlisted');
			expect(context.state.mediaAttachments).toHaveLength(1);
			expect(context.state.inReplyTo).toBe('status-123');
			expect(context.state.contentWarningEnabled).toBe(true);
		});

		it('should register event handlers', () => {
			const handlers: ComposeHandlers = {
				onSubmit: vi.fn(),
				onMediaUpload: vi.fn(),
				onMediaRemove: vi.fn(),
				onSaveDraft: vi.fn(),
				onCancel: vi.fn(),
			};

			const context = createComposeContext({}, handlers);

			expect(context.handlers.onSubmit).toBe(handlers.onSubmit);
			expect(context.handlers.onMediaUpload).toBe(handlers.onMediaUpload);
			expect(context.handlers.onMediaRemove).toBe(handlers.onMediaRemove);
			expect(context.handlers.onSaveDraft).toBe(handlers.onSaveDraft);
			expect(context.handlers.onCancel).toBe(handlers.onCancel);
		});

		it('should calculate character count from initial state', () => {
			const initialState: Partial<ComposeState> = {
				content: 'Hello world',
				contentWarning: 'CW',
			};

			const context = createComposeContext({}, {}, initialState);

			// "Hello world" (11) + "CW" (2) = 13
			expect(context.state.characterCount).toBe(13);
			expect(context.state.overLimit).toBe(false);
		});

		it('should detect over limit from initial state', () => {
			const initialState: Partial<ComposeState> = {
				content: 'x'.repeat(501),
			};

			const context = createComposeContext({ characterLimit: 500 }, {}, initialState);

			expect(context.state.characterCount).toBe(501);
			expect(context.state.overLimit).toBe(true);
		});
	});

	describe('Character Counting', () => {
		it('should update character count when content changes', () => {
			const context = createComposeContext();

			expect(context.state.characterCount).toBe(0);

			context.state.content = 'Hello';
			expect(context.state.characterCount).toBe(5);

			context.state.content = 'Hello world';
			expect(context.state.characterCount).toBe(11);
		});

		it('should update character count when contentWarning changes', () => {
			const context = createComposeContext();

			context.state.contentWarning = 'CW: Spoilers';
			// "CW: Spoilers" = 12
			expect(context.state.characterCount).toBe(12);
		});

		it('should count both content and contentWarning', () => {
			const context = createComposeContext();

			context.state.content = 'Hello'; // 5
			context.state.contentWarning = 'CW'; // 2
			// Total: 7
			expect(context.state.characterCount).toBe(7);
		});

		it('should set overLimit when exceeding character limit', () => {
			const context = createComposeContext({ characterLimit: 10 });

			expect(context.state.overLimit).toBe(false);

			context.state.content = 'Short';
			expect(context.state.overLimit).toBe(false);

			context.state.content = 'This is a long message';
			expect(context.state.overLimit).toBe(true);
		});

		it('should clear overLimit when under limit', () => {
			const context = createComposeContext({ characterLimit: 10 });

			context.state.content = 'Very long message';
			expect(context.state.overLimit).toBe(true);

			context.state.content = 'Short';
			expect(context.state.overLimit).toBe(false);
		});

		it('should update character count via updateState', () => {
			const context = createComposeContext();

			context.updateState({ content: 'Test' });
			expect(context.state.characterCount).toBe(4);

			context.updateState({ content: 'Longer test' });
			expect(context.state.characterCount).toBe(11);
		});

		it('should handle empty content', () => {
			const context = createComposeContext();

			context.state.content = 'Something';
			expect(context.state.characterCount).toBe(9);

			context.state.content = '';
			expect(context.state.characterCount).toBe(0);
		});
	});

	describe('updateState', () => {
		it('should update state with partial updates', () => {
			const context = createComposeContext();

			context.updateState({ content: 'Hello' });
			expect(context.state.content).toBe('Hello');

			context.updateState({ visibility: 'private' });
			expect(context.state.visibility).toBe('private');
			expect(context.state.content).toBe('Hello'); // Previous state preserved
		});

		it('should update submitting state', () => {
			const context = createComposeContext();

			expect(context.state.submitting).toBe(false);

			context.updateState({ submitting: true });
			expect(context.state.submitting).toBe(true);

			context.updateState({ submitting: false });
			expect(context.state.submitting).toBe(false);
		});

		it('should update error state', () => {
			const context = createComposeContext();

			const error = new Error('Submit failed');
			context.updateState({ error });

			expect(context.state.error).toBe(error);
			expect(context.state.error?.message).toBe('Submit failed');
		});

		it('should clear error state', () => {
			const context = createComposeContext({}, {}, { error: new Error('Initial') });

			expect(context.state.error).toBeInstanceOf(Error);

			context.updateState({ error: null });

			expect(context.state.error).toBe(null);
		});

		it('should update media attachments', () => {
			const context = createComposeContext();

			const attachment = createMockAttachment('1');
			context.updateState({ mediaAttachments: [attachment] });

			expect(context.state.mediaAttachments).toHaveLength(1);
			expect(context.state.mediaAttachments[0].id).toBe('1');
		});

		it('should update content warning enabled state', () => {
			const context = createComposeContext();

			expect(context.state.contentWarningEnabled).toBe(false);

			context.updateState({ contentWarningEnabled: true });
			expect(context.state.contentWarningEnabled).toBe(true);
		});
	});

	describe('reset', () => {
		it('should reset to default state', () => {
			const context = createComposeContext();

			// Modify state
			context.state.content = 'Test content';
			context.state.visibility = 'private';
			context.state.mediaAttachments = [createMockAttachment('1')];
			context.state.submitting = true;

			// Reset
			context.reset();

			expect(context.state.content).toBe('');
			expect(context.state.visibility).toBe('public');
			expect(context.state.mediaAttachments).toEqual([]);
			expect(context.state.submitting).toBe(false);
			expect(context.state.characterCount).toBe(0);
			expect(context.state.overLimit).toBe(false);
		});

		it('should reset character count', () => {
			const context = createComposeContext();

			context.state.content = 'Long message';
			expect(context.state.characterCount).toBe(12);

			context.reset();

			expect(context.state.characterCount).toBe(0);
			expect(context.state.overLimit).toBe(false);
		});

		it('should reset with custom default visibility', () => {
			const context = createComposeContext({ defaultVisibility: 'unlisted' });

			context.state.visibility = 'private';
			context.reset();

			expect(context.state.visibility).toBe('unlisted');
		});
	});

	describe('getComposeContext', () => {
		it('should retrieve existing context', () => {
			const created = createComposeContext();

			const retrieved = getComposeContext();

			expect(retrieved).toBe(created);
		});

		it('should throw error if context does not exist', () => {
			contexts.clear();

			expect(() => getComposeContext()).toThrow(
				'Compose context not found. Make sure you are using Compose components inside <Compose.Root>.'
			);
		});
	});

	describe('hasComposeContext', () => {
		it('should return true when context exists', () => {
			createComposeContext();

			expect(hasComposeContext()).toBe(true);
		});

		it('should return false when context does not exist', () => {
			contexts.clear();

			expect(hasComposeContext()).toBe(false);
		});
	});
});

describe('Compose Visibility Options', () => {
	beforeEach(() => {
		contexts.clear();
	});

	const visibilities: PostVisibility[] = ['public', 'unlisted', 'private', 'direct'];

	visibilities.forEach((visibility) => {
		it(`should support ${visibility} visibility`, () => {
			const context = createComposeContext({ defaultVisibility: visibility });
			expect(context.state.visibility).toBe(visibility);
		});
	});

	it('should allow changing visibility', () => {
		const context = createComposeContext();

		context.state.visibility = 'unlisted';
		expect(context.state.visibility).toBe('unlisted');

		context.state.visibility = 'private';
		expect(context.state.visibility).toBe('private');
	});
});

describe('Compose Event Handlers', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should call onSubmit handler', async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined);
		const context = createComposeContext({}, { onSubmit });

		context.state.content = 'Test post';
		context.state.visibility = 'public';

		const submitData = {
			content: context.state.content,
			visibility: context.state.visibility,
			contentWarning: context.state.contentWarning,
			mediaAttachments: context.state.mediaAttachments,
			inReplyTo: context.state.inReplyTo,
		};

		await context.handlers.onSubmit?.(submitData);

		expect(onSubmit).toHaveBeenCalledWith(submitData);
	});

	it('should call onMediaUpload handler', async () => {
		const mockAttachment = createMockAttachment('1');
		const onMediaUpload = vi.fn().mockResolvedValue(mockAttachment);
		const context = createComposeContext({}, { onMediaUpload });

		const file = createMockFile('test.jpg');
		const result = await context.handlers.onMediaUpload?.(file);

		expect(onMediaUpload).toHaveBeenCalledWith(file);
		expect(result?.id).toBe('1');
	});

	it('should call onMediaRemove handler', () => {
		const onMediaRemove = vi.fn();
		const context = createComposeContext({}, { onMediaRemove });

		context.handlers.onMediaRemove?.('attachment-1');

		expect(onMediaRemove).toHaveBeenCalledWith('attachment-1');
	});

	it('should call onSaveDraft handler', () => {
		const onSaveDraft = vi.fn();
		const context = createComposeContext({}, { onSaveDraft });

		context.state.content = 'Draft content';
		context.handlers.onSaveDraft?.(context.state.content);

		expect(onSaveDraft).toHaveBeenCalledWith('Draft content');
	});

	it('should call onCancel handler', () => {
		const onCancel = vi.fn();
		const context = createComposeContext({}, { onCancel });

		context.handlers.onCancel?.();

		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('should support sync onSubmit', () => {
		const onSubmit = vi.fn(); // Sync version
		const context = createComposeContext({}, { onSubmit });

		const submitData = {
			content: 'Test',
			visibility: 'public' as PostVisibility,
		};

		context.handlers.onSubmit?.(submitData);

		expect(onSubmit).toHaveBeenCalledWith(submitData);
	});

	it('should support async onSubmit', async () => {
		const onSubmit = vi.fn().mockImplementation(() =>
			new Promise((resolve) => setTimeout(resolve, 100))
		);
		const context = createComposeContext({}, { onSubmit });

		const submitData = {
			content: 'Test',
			visibility: 'public' as PostVisibility,
		};

		const promise = context.handlers.onSubmit?.(submitData);
		expect(promise).toBeInstanceOf(Promise);

		await promise;

		expect(onSubmit).toHaveBeenCalledWith(submitData);
	});
});

describe('Media Attachments', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should handle empty media attachments', () => {
		const context = createComposeContext();

		expect(context.state.mediaAttachments).toEqual([]);
	});

	it('should handle single media attachment', () => {
		const attachment = createMockAttachment('1');
		const context = createComposeContext({}, {}, { mediaAttachments: [attachment] });

		expect(context.state.mediaAttachments).toHaveLength(1);
		expect(context.state.mediaAttachments[0].id).toBe('1');
	});

	it('should handle multiple media attachments', () => {
		const attachments = [
			createMockAttachment('1'),
			createMockAttachment('2'),
			createMockAttachment('3'),
		];
		const context = createComposeContext({}, {}, { mediaAttachments: attachments });

		expect(context.state.mediaAttachments).toHaveLength(3);
		expect(context.state.mediaAttachments.map(a => a.id)).toEqual(['1', '2', '3']);
	});

	it('should respect maxMediaAttachments config', () => {
		const context = createComposeContext({ maxMediaAttachments: 2 });

		expect(context.config.maxMediaAttachments).toBe(2);
	});

	it('should support disabling media', () => {
		const context = createComposeContext({ allowMedia: false });

		expect(context.config.allowMedia).toBe(false);
	});

	it('should track upload progress', () => {
		const attachment: ComposeAttachment = {
			id: '1',
			file: createMockFile('test.jpg'),
			progress: 50,
		};
		const context = createComposeContext({}, {}, { mediaAttachments: [attachment] });

		expect(context.state.mediaAttachments[0].progress).toBe(50);
	});

	it('should track upload errors', () => {
		const attachment: ComposeAttachment = {
			id: '1',
			file: createMockFile('test.jpg'),
			error: 'Upload failed',
		};
		const context = createComposeContext({}, {}, { mediaAttachments: [attachment] });

		expect(context.state.mediaAttachments[0].error).toBe('Upload failed');
	});

	it('should handle attachment descriptions (alt text)', () => {
		const attachment = createMockAttachment('1');
		attachment.description = 'A beautiful sunset';
		const context = createComposeContext({}, {}, { mediaAttachments: [attachment] });

		expect(context.state.mediaAttachments[0].description).toBe('A beautiful sunset');
	});
});

describe('Content Warnings', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should support content warning text', () => {
		const context = createComposeContext({}, {}, { contentWarning: 'Spoilers ahead' });

		expect(context.state.contentWarning).toBe('Spoilers ahead');
	});

	it('should track content warning enabled state', () => {
		const context = createComposeContext();

		expect(context.state.contentWarningEnabled).toBe(false);

		context.state.contentWarningEnabled = true;
		expect(context.state.contentWarningEnabled).toBe(true);
	});

	it('should support disabling content warnings', () => {
		const context = createComposeContext({ allowContentWarnings: false });

		expect(context.config.allowContentWarnings).toBe(false);
	});

	it('should include content warning in character count', () => {
		const context = createComposeContext();

		context.state.contentWarning = 'CW: Test';
		// "CW: Test" = 8
		expect(context.state.characterCount).toBe(8);
	});
});

describe('Reply Context', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should handle reply to status', () => {
		const context = createComposeContext({}, {}, { inReplyTo: 'status-123' });

		expect(context.state.inReplyTo).toBe('status-123');
	});

	it('should allow clearing reply context', () => {
		const context = createComposeContext({}, {}, { inReplyTo: 'status-123' });

		expect(context.state.inReplyTo).toBe('status-123');

		context.state.inReplyTo = undefined;
		expect(context.state.inReplyTo).toBeUndefined();
	});

	it('should preserve reply context across updates', () => {
		const context = createComposeContext({}, {}, { inReplyTo: 'status-123' });

		context.state.content = 'Reply text';
		expect(context.state.inReplyTo).toBe('status-123');
	});
});

describe('Compose Edge Cases', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should handle empty compose', () => {
		const context = createComposeContext();

		expect(context.state.content).toBe('');
		expect(context.state.characterCount).toBe(0);
		expect(context.state.overLimit).toBe(false);
	});

	it('should handle very long content', () => {
		const context = createComposeContext({ characterLimit: 500 });

		context.state.content = 'x'.repeat(10000);
		expect(context.state.characterCount).toBe(10000);
		expect(context.state.overLimit).toBe(true);
	});

	it('should handle missing optional handlers', () => {
		const context = createComposeContext({}, {});

		expect(context.handlers.onSubmit).toBeUndefined();
		expect(context.handlers.onMediaUpload).toBeUndefined();
		expect(context.handlers.onMediaRemove).toBeUndefined();
		expect(context.handlers.onSaveDraft).toBeUndefined();
		expect(context.handlers.onCancel).toBeUndefined();
	});

	it('should handle partial config', () => {
		const context = createComposeContext({ characterLimit: 280 });

		expect(context.config.characterLimit).toBe(280);
		expect(context.config.allowMedia).toBe(true); // Default
		expect(context.config.maxMediaAttachments).toBe(4); // Default
	});

	it('should handle markdown config', () => {
		const context = createComposeContext({ enableMarkdown: true });

		expect(context.config.enableMarkdown).toBe(true);
	});

	it('should handle custom placeholder', () => {
		const context = createComposeContext({ placeholder: 'Share your thoughts...' });

		expect(context.config.placeholder).toBe('Share your thoughts...');
	});

	it('should handle custom CSS class', () => {
		const context = createComposeContext({ class: 'my-compose' });

		expect(context.config.class).toBe('my-compose');
	});

	it('should support polls config', () => {
		const context = createComposeContext({ allowPolls: false });

		expect(context.config.allowPolls).toBe(false);
	});

	it('should handle simultaneous content and CW changes', () => {
		const context = createComposeContext();

		context.updateState({
			content: 'Test',
			contentWarning: 'CW',
		});

		// "Test" (4) + "CW" (2) = 6
		expect(context.state.characterCount).toBe(6);
	});

	it('should handle reset after error', () => {
		const context = createComposeContext({}, {}, { error: new Error('Failed') });

		expect(context.state.error).toBeInstanceOf(Error);

		context.reset();

		expect(context.state.error).toBe(null);
	});
});

describe('Compose Type Safety', () => {
	beforeEach(() => {
		contexts.clear();
	});

	it('should enforce PostVisibility type', () => {
		const visibilities: PostVisibility[] = ['public', 'unlisted', 'private', 'direct'];

		visibilities.forEach((visibility) => {
			const context = createComposeContext({ defaultVisibility: visibility });
			expect(context.state.visibility).toBe(visibility);
		});
	});

	it('should enforce ComposeAttachment structure', () => {
		const attachment = createMockAttachment('test');

		expect(attachment).toHaveProperty('id');
		expect(attachment).toHaveProperty('file');
		expect(attachment).toHaveProperty('progress');
		expect(attachment).toHaveProperty('description');
	});

	it('should enforce ComposeState structure', () => {
		const context = createComposeContext();

		expect(context.state).toHaveProperty('content');
		expect(context.state).toHaveProperty('contentWarning');
		expect(context.state).toHaveProperty('visibility');
		expect(context.state).toHaveProperty('mediaAttachments');
		expect(context.state).toHaveProperty('submitting');
		expect(context.state).toHaveProperty('error');
		expect(context.state).toHaveProperty('characterCount');
		expect(context.state).toHaveProperty('overLimit');
		expect(context.state).toHaveProperty('inReplyTo');
		expect(context.state).toHaveProperty('contentWarningEnabled');
	});
});

