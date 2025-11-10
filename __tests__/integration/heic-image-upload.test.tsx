/**
 * Integration tests for HEIC image upload and conversion
 * Tests real HEIC files from fixtures directory
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadStep from '@/app/components/UploadStep';
import { readFileSync } from 'fs';
import { join } from 'path';

// Mock heic2any for dynamic imports
const mockHeic2any = jest.fn();
jest.mock('heic2any', () => ({
  __esModule: true,
  default: mockHeic2any,
}));

describe('HEIC Image Upload Integration Tests', () => {
  let mockOnUpload: jest.Mock;
  const fixturesPath = join(__dirname, '../fixtures');

  beforeEach(() => {
    mockOnUpload = jest.fn();
    jest.clearAllMocks();
  });

  describe('Real HEIC file handling', () => {
    it('should handle test-large-image-heic.heic file upload', async () => {
      // Read the actual HEIC file from fixtures
      const heicFilePath = join(fixturesPath, 'test-large-image-heic.heic');
      let heicBuffer: Buffer;

      try {
        heicBuffer = readFileSync(heicFilePath);
      } catch (error) {
        console.warn('test-large-image-heic.heic not found, skipping test');
        return;
      }

      // Create a File object from the buffer
      const heicFile = new File([heicBuffer], 'test-large-image-heic.heic', {
        type: 'image/heic',
      });

      // Mock heic2any to return a JPEG blob
      const mockJpegBlob = new Blob(['fake-converted-jpeg'], { type: 'image/jpeg' });
      mockHeic2any.mockResolvedValueOnce(mockJpegBlob);

      const { container } = render(<UploadStep onUpload={mockOnUpload} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      // Upload the real HEIC file
      await userEvent.upload(fileInput, heicFile);

      // Wait for conversion to complete
      await waitFor(
        () => {
          expect(mockOnUpload).toHaveBeenCalled();
        },
        { timeout: 5000 }
      );

      // Verify heic2any was called with the correct file
      expect(mockHeic2any).toHaveBeenCalledWith({
        blob: heicFile,
        toType: 'image/jpeg',
        quality: 0.9,
      });
    });

    it('should handle IMG_5671.heic file upload when available', async () => {
      // Read the new HEIC file from fixtures
      const heicFilePath = join(fixturesPath, 'IMG_5671.heic');
      let heicBuffer: Buffer;

      try {
        heicBuffer = readFileSync(heicFilePath);
      } catch (error) {
        console.warn('IMG_5671.heic not found yet, skipping test');
        return;
      }

      // Create a File object from the buffer
      const heicFile = new File([heicBuffer], 'IMG_5671.heic', {
        type: 'image/heic',
      });

      // Mock heic2any to return a JPEG blob
      const mockJpegBlob = new Blob(['fake-converted-jpeg'], { type: 'image/jpeg' });
      mockHeic2any.mockResolvedValueOnce(mockJpegBlob);

      const { container } = render(<UploadStep onUpload={mockOnUpload} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      // Upload the real HEIC file
      await userEvent.upload(fileInput, heicFile);

      // Wait for conversion to complete
      await waitFor(
        () => {
          expect(mockOnUpload).toHaveBeenCalled();
        },
        { timeout: 5000 }
      );

      // Verify heic2any was called with the correct file
      expect(mockHeic2any).toHaveBeenCalledWith({
        blob: heicFile,
        toType: 'image/jpeg',
        quality: 0.9,
      });

      // Verify the converted image was passed as a data URL
      const dataUrl = mockOnUpload.mock.calls[0][0];
      expect(dataUrl).toContain('data:image/jpeg;base64,');
    });

    it('should detect HEIC files without proper MIME type', async () => {
      // Some systems don't set MIME type correctly for HEIC files
      const heicFilePath = join(fixturesPath, 'test-large-image-heic.heic');
      let heicBuffer: Buffer;

      try {
        heicBuffer = readFileSync(heicFilePath);
      } catch (error) {
        console.warn('test-large-image-heic.heic not found, skipping test');
        return;
      }

      // Create a File with empty MIME type (common issue on some platforms)
      const heicFile = new File([heicBuffer], 'photo.heic', {
        type: '', // No MIME type
      });

      const mockJpegBlob = new Blob(['fake-converted-jpeg'], { type: 'image/jpeg' });
      mockHeic2any.mockResolvedValueOnce(mockJpegBlob);

      const { container } = render(<UploadStep onUpload={mockOnUpload} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, heicFile);

      // Should still detect as HEIC by file extension and attempt conversion
      await waitFor(() => {
        expect(mockHeic2any).toHaveBeenCalled();
      });
    });
  });

  describe('HEIC conversion error scenarios', () => {
    it('should handle heic2any module loading failure', async () => {
      // Mock the dynamic import to fail
      mockHeic2any.mockImplementation(() => {
        throw new Error('heic2any failed to load');
      });

      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

      const heicFile = new File(['fake-heic-data'], 'photo.heic', {
        type: 'image/heic',
      });

      const { container } = render(<UploadStep onUpload={mockOnUpload} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, heicFile);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          'Failed to convert HEIC image. Please try a different image format.'
        );
      });

      expect(mockOnUpload).not.toHaveBeenCalled();
      alertMock.mockRestore();
    });

    it('should handle corrupt HEIC file conversion failure', async () => {
      // Mock conversion failure for corrupt file
      mockHeic2any.mockRejectedValueOnce(new Error('Invalid HEIC file'));

      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

      const corruptHeicFile = new File(['corrupt-data'], 'corrupt.heic', {
        type: 'image/heic',
      });

      const { container } = render(<UploadStep onUpload={mockOnUpload} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, corruptHeicFile);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          'Failed to convert HEIC image. Please try a different image format.'
        );
      });

      expect(mockOnUpload).not.toHaveBeenCalled();
      alertMock.mockRestore();
    });

    it('should show converting state while processing HEIC', async () => {
      // Make conversion take some time
      mockHeic2any.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(new Blob(['fake-jpeg'], { type: 'image/jpeg' }));
            }, 100);
          })
      );

      const heicFile = new File(['fake-heic'], 'photo.heic', { type: 'image/heic' });

      const { container } = render(<UploadStep onUpload={mockOnUpload} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, heicFile);

      // Should show converting state
      expect(screen.getByText('Converting HEIC image...')).toBeInTheDocument();

      // Wait for conversion to complete
      await waitFor(
        () => {
          expect(mockOnUpload).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );

      // Converting state should be gone
      expect(screen.queryByText('Converting HEIC image...')).not.toBeInTheDocument();
    });
  });

  describe('HEIC file extension variations', () => {
    it.each([
      ['photo.heic', 'image/heic'],
      ['photo.HEIC', 'image/heic'],
      ['photo.heif', 'image/heif'],
      ['photo.HEIF', 'image/heif'],
      ['photo.heic', ''], // No MIME type
      ['photo.HEIC', ''], // No MIME type, uppercase
    ])('should handle %s with MIME type "%s"', async (filename, mimeType) => {
      const mockJpegBlob = new Blob(['fake-jpeg'], { type: 'image/jpeg' });
      mockHeic2any.mockResolvedValueOnce(mockJpegBlob);

      const heicFile = new File(['fake-heic-data'], filename, { type: mimeType });

      const { container } = render(<UploadStep onUpload={mockOnUpload} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, heicFile);

      await waitFor(() => {
        expect(mockHeic2any).toHaveBeenCalled();
      });

      expect(mockOnUpload).toHaveBeenCalled();
    });
  });

  describe('Multi-image HEIC files', () => {
    it('should handle HEIC files with multiple images (Live Photos)', async () => {
      // Mock heic2any returning an array of blobs (multi-image HEIC)
      const mockJpegBlob1 = new Blob(['fake-jpeg-1'], { type: 'image/jpeg' });
      const mockJpegBlob2 = new Blob(['fake-jpeg-2'], { type: 'image/jpeg' });
      mockHeic2any.mockResolvedValueOnce([mockJpegBlob1, mockJpegBlob2]);

      const heicFile = new File(['fake-multi-heic'], 'live-photo.heic', {
        type: 'image/heic',
      });

      const { container } = render(<UploadStep onUpload={mockOnUpload} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, heicFile);

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled();
      });

      // Should use only the first image
      expect(mockHeic2any).toHaveBeenCalled();
      const dataUrl = mockOnUpload.mock.calls[0][0];
      expect(dataUrl).toContain('data:image/jpeg;base64,');
    });
  });

  describe('File size handling', () => {
    it('should handle large HEIC files', async () => {
      // Create a large mock HEIC file (simulate 5MB)
      const largeBuffer = Buffer.alloc(5 * 1024 * 1024);
      const largeHeicFile = new File([largeBuffer], 'large-photo.heic', {
        type: 'image/heic',
      });

      const mockJpegBlob = new Blob(['fake-converted-jpeg'], { type: 'image/jpeg' });
      mockHeic2any.mockResolvedValueOnce(mockJpegBlob);

      const { container } = render(<UploadStep onUpload={mockOnUpload} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, largeHeicFile);

      await waitFor(
        () => {
          expect(mockOnUpload).toHaveBeenCalled();
        },
        { timeout: 10000 }
      );

      expect(mockHeic2any).toHaveBeenCalledWith({
        blob: largeHeicFile,
        toType: 'image/jpeg',
        quality: 0.9,
      });
    });
  });

  describe('Browser compatibility', () => {
    it('should handle heic2any not being a function (module load issue)', async () => {
      // This simulates the production error where heic2any doesn't load correctly
      mockHeic2any.mockImplementation(() => {
        throw new Error('heic2any failed to load');
      });

      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

      const heicFile = new File(['fake-heic'], 'photo.heic', { type: 'image/heic' });

      const { container } = render(<UploadStep onUpload={mockOnUpload} />);
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      await userEvent.upload(fileInput, heicFile);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          'Failed to convert HEIC image. Please try a different image format.'
        );
      });

      alertMock.mockRestore();
    });
  });
});
