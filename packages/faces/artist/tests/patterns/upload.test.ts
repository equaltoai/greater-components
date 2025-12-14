
import { describe, it, expect, vi } from 'vitest';
import {
  createUploadPattern,
  formatFileSize,
  getAcceptedTypesDisplay,
} from '../../src/patterns/upload.js';

describe('Upload Pattern', () => {
  const createFile = (name: string, type: string, size: number) => {
    return {
      name,
      type,
      size,
      // Helper to match File interface partially if needed
    } as unknown as File;
  };

  const defaultConfig = {
    maxFiles: 5,
    acceptedTypes: ['image/jpeg'],
    onUpload: vi.fn(),
    requireMetadata: true,
    requireAIDisclosure: true,
  };

  describe('File Selection', () => {
    it('adds valid files', () => {
      const pattern = createUploadPattern(defaultConfig);
      const file = createFile('test.jpg', 'image/jpeg', 1000);
      
      pattern.state.addFiles([file]);
      
      expect(pattern.state.files).toHaveLength(1);
      expect(pattern.state.metadata.has('test.jpg')).toBe(true);
    });

    it('validates file type', () => {
      const pattern = createUploadPattern(defaultConfig);
      const file = createFile('test.png', 'image/png', 1000);
      
      pattern.state.addFiles([file]);
      
      // Should add file but with validation error (implementation detail check)
      // Actually implementation adds file but sets validation error
      expect(pattern.state.validationErrors.has('test.png')).toBe(true);
      // Wait, addFiles logic:
      // if (errors.length > 0) state.validationErrors.set... 
      // else validFiles.push(file)
      // So invalid files are NOT added to state.files?
      // Let's check logic:
      // state.files.push(...validFiles);
      
      expect(pattern.state.files).toHaveLength(0);
      expect(pattern.state.validationErrors.get('test.png')).toContain('File type image/png is not accepted');
    });

    it('validates file size', () => {
      const pattern = createUploadPattern(defaultConfig);
      const file = createFile('big.jpg', 'image/jpeg', 51 * 1024 * 1024);
      
      pattern.state.addFiles([file]);
      
      expect(pattern.state.files).toHaveLength(0);
      expect(pattern.state.validationErrors.get('big.jpg')).toContain('File size exceeds 50MB limit');
    });

    it('removes file', () => {
      const pattern = createUploadPattern(defaultConfig);
      const file = createFile('test.jpg', 'image/jpeg', 1000);
      pattern.state.addFiles([file]);
      
      pattern.state.removeFile(0);
      expect(pattern.state.files).toHaveLength(0);
      expect(pattern.state.metadata.has('test.jpg')).toBe(false);
    });
  });

  describe('Workflow & Navigation', () => {
    it('moves through steps', () => {
      const pattern = createUploadPattern({
        ...defaultConfig,
        requireMetadata: true,
        requireAIDisclosure: false,
      });

      // Select
      expect(pattern.state.currentStep).toBe('select');
      expect(pattern.state.nextStep()).toBe(false); // No files

      pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
      pattern.state.nextStep(); // To metadata
      expect(pattern.state.currentStep).toBe('metadata');
    });

    it('validates metadata before proceeding', () => {
      const pattern = createUploadPattern({
        ...defaultConfig,
        requireMetadata: true,
      });
      pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
      pattern.state.nextStep(); // To metadata

      // Clear metadata to force error
      pattern.state.updateMetadata('t.jpg', { title: '' });
      
      expect(pattern.state.nextStep()).toBe(false); // Should stay
      expect(pattern.state.validationErrors.has('t.jpg')).toBe(true);

      // Fix metadata
      pattern.state.updateMetadata('t.jpg', { title: 'Title', medium: 'Oil', year: 2023 });
      pattern.state.nextStep(); // Proceed
      expect(pattern.state.currentStep).not.toBe('metadata');
    });

    it('handles previous step', () => {
        const pattern = createUploadPattern({
            ...defaultConfig,
            requireMetadata: true,
        });
        pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
        pattern.state.nextStep(); // metadata
        pattern.state.prevStep(); // select
        expect(pattern.state.currentStep).toBe('select');
    });
  });

  describe('Upload Process', () => {
      it('executes upload', async () => {
          const onUpload = vi.fn().mockResolvedValue([{ id: '1' }]);
          const pattern = createUploadPattern({
              ...defaultConfig,
              requireMetadata: false,
              requireAIDisclosure: false,
              onUpload,
          });

          pattern.state.addFiles([createFile('t.jpg', 'image/jpeg', 100)]);
          
          // Trigger next step from select -> uploading (since others skipped)
          pattern.state.nextStep(); 
          // Note: nextStep calls startUpload() if destination is uploading?
          // Check logic: state.currentStep = 'uploading'; startUpload();
          // So no need to call startUpload manually if navigating naturally.
          
          // Wait for async
          await new Promise(resolve => setTimeout(resolve, 0));

          expect(onUpload).toHaveBeenCalled();
          expect(pattern.state.currentStep).toBe('complete');
          expect(pattern.state.completedArtworks).toHaveLength(1);
      });
  });

  describe('Helpers', () => {
      it('formats file size', () => {
          expect(formatFileSize(500)).toBe('500 B');
          expect(formatFileSize(1024)).toBe('1.0 KB');
          expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      });

      it('displays accepted types', () => {
          expect(getAcceptedTypesDisplay(['image/jpeg', 'image/png'])).toBe('JPEG, PNG');
      });
  });
});
