import { describe, it, expect, vi } from 'vitest';
import {
	createUploadPattern,
	getUploadStepDisplayName,
	COMMON_AI_TOOLS,
} from '../../src/patterns/upload.js';
import type { UploadPatternConfig } from '../../src/patterns/types.js';

describe('Upload Pattern Coverage', () => {
	const createFile = (name: string, type: string, size: number) => {
		return {
			name,
			type,
			size,
		} as unknown as File;
	};

	const defaultConfig: UploadPatternConfig = {
		maxFiles: 3,
		acceptedTypes: ['image/jpeg'],
		onUpload: vi.fn().mockResolvedValue([]),
		requireMetadata: true,
		requireAIDisclosure: true,
	};

	describe('Helpers', () => {
		it('getUploadStepDisplayName returns correct names', () => {
			expect(getUploadStepDisplayName('select')).toBe('Select Files');
			expect(getUploadStepDisplayName('metadata')).toBe('Add Details');
			expect(getUploadStepDisplayName('ai-disclosure')).toBe('AI Disclosure');
			expect(getUploadStepDisplayName('uploading')).toBe('Uploading');
			expect(getUploadStepDisplayName('complete')).toBe('Complete');
		});

		it('COMMON_AI_TOOLS is defined', () => {
			expect(COMMON_AI_TOOLS).toContain('Midjourney');
			expect(COMMON_AI_TOOLS.length).toBeGreaterThan(0);
		});
	});

	describe('State Management & Edge Cases', () => {
		it('clearFiles resets state completely', () => {
			const pattern = createUploadPattern(defaultConfig);
			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
			pattern.state.updateMetadata('t.jpg', { title: 'Test' });

			expect(pattern.state.files.length).toBe(1);
			expect(pattern.state.metadata.size).toBe(1);

			pattern.state.clearFiles();

			expect(pattern.state.files.length).toBe(0);
			expect(pattern.state.metadata.size).toBe(0);
			expect(pattern.state.currentStep).toBe('select');
		});

		it('removeFile handles invalid index gracefully', () => {
			const pattern = createUploadPattern(defaultConfig);
			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);

			// Should not throw or change state
			pattern.state.removeFile(5);
			expect(pattern.state.files.length).toBe(1);
		});

		it('updateAIDisclosure updates state', () => {
			const pattern = createUploadPattern(defaultConfig);
			expect(pattern.state.aiDisclosure.aiUsed).toBe(false);

			pattern.state.updateAIDisclosure({ aiUsed: true, tools: ['Midjourney'] });

			expect(pattern.state.aiDisclosure.aiUsed).toBe(true);
			expect(pattern.state.aiDisclosure.tools).toEqual(['Midjourney']);
		});

		it('cancelUpload calls handler', () => {
			const onCancel = vi.fn();
			const pattern = createUploadPattern(defaultConfig, { onCancel });

			pattern.state.cancelUpload(0);
			expect(onCancel).toHaveBeenCalledWith(0);
		});

		it('addFiles respects maxFiles limit', () => {
			const pattern = createUploadPattern({ ...defaultConfig, maxFiles: 1 });
			const file1 = createFile('1.jpg', 'image/jpeg', 100);
			const file2 = createFile('2.jpg', 'image/jpeg', 100);

			pattern.state.addFiles([file1, file2]);

			expect(pattern.state.files.length).toBe(1);
			expect(pattern.state.files[0].name).toBe('1.jpg');
		});
	});

	describe('Navigation & Validation', () => {
		it('handles navigation skipping metadata step', () => {
			const pattern = createUploadPattern({
				...defaultConfig,
				requireMetadata: false,
				requireAIDisclosure: true,
			});
			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);

			pattern.state.nextStep(); // Select -> AI Disclosure
			expect(pattern.state.currentStep).toBe('ai-disclosure');

			pattern.state.prevStep(); // AI Disclosure -> Select
			expect(pattern.state.currentStep).toBe('select');
		});

		it('handles navigation skipping ai-disclosure step', () => {
			const pattern = createUploadPattern({
				...defaultConfig,
				requireMetadata: true,
				requireAIDisclosure: false,
			});
			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);

			// Fix metadata so we can proceed (though default is valid, be explicit)
			pattern.state.updateMetadata('t.jpg', { title: 'T', medium: 'M', year: 2024 });

			pattern.state.nextStep(); // Select -> Metadata
			expect(pattern.state.currentStep).toBe('metadata');

			// Start upload mocking
			pattern.state.nextStep(); // Metadata -> Uploading
			expect(pattern.state.currentStep).toBe('uploading');
		});

		it('validateMetadata catches invalid years', () => {
			const pattern = createUploadPattern(defaultConfig);
			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
			pattern.state.nextStep(); // Go to metadata step

			// Missing medium and invalid year
			pattern.state.updateMetadata('t.jpg', { title: 'T', medium: '', year: 1800 });

			expect(pattern.state.nextStep()).toBe(false);
			const errors = pattern.state.validationErrors.get('t.jpg');
			expect(errors).toContain('Medium is required');
			expect(errors).toContain('Valid year is required');
		});

		it('validateMetadata catches future years', () => {
			const pattern = createUploadPattern(defaultConfig);
			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
			pattern.state.nextStep(); // Go to metadata step

			const futureYear = new Date().getFullYear() + 5;
			pattern.state.updateMetadata('t.jpg', { title: 'T', medium: 'M', year: futureYear });

			expect(pattern.state.nextStep()).toBe(false);
			const errors = pattern.state.validationErrors.get('t.jpg');
			expect(errors).toContain('Valid year is required');
		});

		it('canProceed checks correctly', async () => {
			const pattern = createUploadPattern(defaultConfig);

			// Select step - no files
			expect(pattern.state.canProceed()).toBe(false);

			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
			expect(pattern.state.canProceed()).toBe(true);

			pattern.state.nextStep(); // Go to metadata

			// Invalid metadata
			pattern.state.updateMetadata('t.jpg', { title: '' });
			expect(pattern.state.canProceed()).toBe(false);

			pattern.state.updateMetadata('t.jpg', { title: 'T', medium: 'M', year: 2024 });
			expect(pattern.state.canProceed()).toBe(true);

			pattern.state.nextStep(); // Go to AI Disclosure
			expect(pattern.state.currentStep).toBe('ai-disclosure');
			expect(pattern.state.canProceed()).toBe(true);

			pattern.state.nextStep(); // Go to uploading
			expect(pattern.state.currentStep).toBe('uploading');
			expect(pattern.state.canProceed()).toBe(false);

			// Wait for upload to complete
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(pattern.state.currentStep).toBe('complete');
			expect(pattern.state.canProceed()).toBe(false);
		});

		it('getStepNumber and getTotalSteps', () => {
			const pattern = createUploadPattern(defaultConfig);
			// Select, Metadata, AI, Uploading, Complete = 5 steps
			expect(pattern.state.getTotalSteps()).toBe(5);
			expect(pattern.state.getStepNumber()).toBe(1); // Select

			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
			pattern.state.nextStep(); // Go to metadata
			expect(pattern.state.getStepNumber()).toBe(2);
		});

		it('getTotalSteps varies by config', () => {
			const pattern = createUploadPattern({
				...defaultConfig,
				requireMetadata: false,
				requireAIDisclosure: false,
			});
			// Select, Uploading, Complete = 3 steps
			expect(pattern.state.getTotalSteps()).toBe(3);
		});
	});

	describe('Upload Process Error Handling', () => {
		it('handles upload errors', async () => {
			const error = new Error('Upload failed');
			const onUpload = vi.fn().mockRejectedValue(error);
			const pattern = createUploadPattern({
				...defaultConfig,
				requireMetadata: false,
				requireAIDisclosure: false,
				onUpload,
			});

			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
			pattern.state.nextStep(); // Triggers startUpload

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(pattern.state.uploadState.error).toEqual(error);
			expect(pattern.state.progress[0].status).toBe('error');
			expect(pattern.state.progress[0].error).toBe('Upload failed');
		});

		it('getTotalProgress calculates average', async () => {
			const onUpload = vi.fn().mockImplementation(async () => {
				// Simulate some delay if we were testing polling, but startUpload sets initial progress to 0
				return [];
			});
			const pattern = createUploadPattern({
				...defaultConfig,
				onUpload,
				requireMetadata: false,
				requireAIDisclosure: false,
			});

			pattern.state.addFiles([createFile('t1.jpg', 'image/jpeg', 100)]);
			pattern.state.addFiles([createFile('t2.jpg', 'image/jpeg', 100)]);

			// Initially 0
			expect(pattern.state.getTotalProgress()).toBe(0);

			pattern.state.nextStep(); // startUpload
			await new Promise((resolve) => setTimeout(resolve, 0));

			// After completion, progress is 100%
			expect(pattern.state.getTotalProgress()).toBe(100);
		});

		it('getTotalProgress returns 0 for empty', () => {
			const pattern = createUploadPattern(defaultConfig);
			expect(pattern.state.getTotalProgress()).toBe(0);
		});
	});

	describe('Handlers & Lifecycle', () => {
		it('calls onFilesSelect when files are added', () => {
			const onFilesSelect = vi.fn();
			const pattern = createUploadPattern(defaultConfig, { onFilesSelect });
			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
			expect(onFilesSelect).toHaveBeenCalled();
		});

		it('calls onMetadataSubmit', () => {
			const onMetadataSubmit = vi.fn();
			const pattern = createUploadPattern(defaultConfig, { onMetadataSubmit });
			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
			pattern.state.updateMetadata('t.jpg', { title: 'T', medium: 'M', year: 2024 });

			pattern.state.nextStep(); // to metadata
			pattern.state.nextStep(); // submit metadata
			expect(onMetadataSubmit).toHaveBeenCalled();
		});

		it('calls onAIDisclosureSubmit', () => {
			const onAIDisclosureSubmit = vi.fn();
			const pattern = createUploadPattern(defaultConfig, { onAIDisclosureSubmit });
			pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
			pattern.state.updateMetadata('t.jpg', { title: 'T', medium: 'M', year: 2024 });

			pattern.state.nextStep(); // to metadata
			pattern.state.nextStep(); // to ai
			pattern.state.nextStep(); // submit ai
			expect(onAIDisclosureSubmit).toHaveBeenCalled();
		});

		it('destroy method works', () => {
			const pattern = createUploadPattern(defaultConfig);
			expect(() => pattern.destroy()).not.toThrow();
		});
	});

	describe('Drag and Drop', () => {
		it('updates drag state', () => {
			const pattern = createUploadPattern(defaultConfig);

			expect(pattern.state.dragState.isDragging).toBe(false);
			expect(pattern.state.dragState.isOver).toBe(false);

			pattern.state.handleDragEnter();
			expect(pattern.state.dragState.isDragging).toBe(true);
			expect(pattern.state.dragState.isOver).toBe(true);

			pattern.state.handleDragLeave();
			expect(pattern.state.dragState.isOver).toBe(false);
			expect(pattern.state.dragState.isDragging).toBe(true); // Still dragging, just left target

			pattern.state.handleDragEnd();
			expect(pattern.state.dragState.isDragging).toBe(false);
			expect(pattern.state.dragState.isOver).toBe(false);
		});

		it('handleDrop adds files and ends drag', () => {
			const pattern = createUploadPattern(defaultConfig);
			const fileList = [createFile('t.jpg', 'image/jpeg', 100)];

			pattern.state.handleDragEnter();
			pattern.state.handleDrop(fileList as unknown as FileList);

			expect(pattern.state.dragState.isDragging).toBe(false);
			expect(pattern.state.files.length).toBe(1);
		});
	});
});
