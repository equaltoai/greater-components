import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ImageEditor from '../src/ImageEditor.svelte';

describe('ImageEditor', () => {
	const mockImage = {
		url: 'https://example.com/image.jpg',
		description: 'Test image',
		focalPoint: { x: 0, y: 0 },
		width: 800,
		height: 600
	};

	it('should render image and description input', () => {
		render(ImageEditor, { image: mockImage });
		expect(screen.getByRole('img')).toBeTruthy();
		expect(screen.getByPlaceholderText(/Describe this image/)).toBeTruthy();
		expect((screen.getByPlaceholderText(/Describe this image/) as HTMLTextAreaElement).value).toBe('Test image');
	});

	it('should update description', async () => {
		render(ImageEditor, { image: mockImage });
		const textarea = screen.getByPlaceholderText(/Describe this image/);
		await fireEvent.input(textarea, { target: { value: 'New description' } });
		expect((textarea as HTMLTextAreaElement).value).toBe('New description');
	});

	it('should handle focal point reset', async () => {
		const imageWithFocal = { ...mockImage, focalPoint: { x: 0.5, y: 0.5 } };
		render(ImageEditor, { image: imageWithFocal });
		
		expect(screen.getByText(/x: 0.50, y: 0.50/)).toBeTruthy();
		
		const resetBtn = screen.getByText('Reset to center');
		await fireEvent.click(resetBtn);
		
		expect(screen.getByText(/x: 0.00, y: 0.00/)).toBeTruthy();
	});

	it('should handle dragging focal point', async () => {
		render(ImageEditor, { image: mockImage });
		
		const container = screen.getByLabelText('Click to set focal point');
		// Mock getBoundingClientRect
		vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
			left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200, x: 0, y: 0, toJSON: () => {}
		});
		
		await fireEvent.mouseDown(container, { clientX: 0, clientY: 0 }); // Center if rect is at 0,0? No, 0,0 is top left.
		// Rect: 0,0 to 200,200.
		// Click at 0,0: normalized = (0/200)*2 - 1 = -1. (-1,-1) top left.
		
		// Wait, updateFocalPoint uses event.clientX.
		
		expect(screen.getByText(/x: -1.00, y: -1.00/)).toBeTruthy();
		
		// Move
		await fireEvent.mouseMove(document, { clientX: 200, clientY: 200 }); // Bottom right
		// (200/200)*2 - 1 = 1. (1,1).
		
		expect(screen.getByText(/x: 1.00, y: 1.00/)).toBeTruthy();
		
		await fireEvent.mouseUp(document);
	});

	it('should save changes', async () => {
		const onSave = vi.fn();
		render(ImageEditor, { image: mockImage, onSave });
		
		const textarea = screen.getByPlaceholderText(/Describe this image/);
		await fireEvent.input(textarea, { target: { value: 'Updated' } });
		
		const saveBtn = screen.getByText('Save');
		await fireEvent.click(saveBtn);
		
		expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
			description: 'Updated'
		}));
	});

	it('should cancel changes', async () => {
		const onCancel = vi.fn();
		render(ImageEditor, { image: mockImage, onCancel });
		
		const textarea = screen.getByPlaceholderText(/Describe this image/);
		await fireEvent.input(textarea, { target: { value: 'Updated' } });
		
		const cancelBtn = screen.getByText('Cancel');
		await fireEvent.click(cancelBtn);
		
		expect(onCancel).toHaveBeenCalled();
		// Should reset local state if bindable was updated?
		// Since we mock onCancel, we check call.
		// If we don't pass onCancel, it should revert.
	});
});
