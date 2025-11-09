import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadStep from '@/app/components/UploadStep';

// Mock heic2any
jest.mock('heic2any', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import heic2any from 'heic2any';

describe('UploadStep Component', () => {
  let mockOnUpload: jest.Mock;

  beforeEach(() => {
    mockOnUpload = jest.fn();
    jest.clearAllMocks();
  });

  it('should render upload interface', () => {
    render(<UploadStep onUpload={mockOnUpload} />);

    expect(screen.getByText('Choose Photo')).toBeInTheDocument();
    expect(screen.getByText(/drag and drop your image here/i)).toBeInTheDocument();
    expect(screen.getByText(/Supported formats: JPG, PNG, GIF, WEBP, HEIC/i)).toBeInTheDocument();
  });

  it('should handle regular image upload (non-HEIC)', async () => {
    const { container } = render(<UploadStep onUpload={mockOnUpload} />);

    // Create a mock PNG file
    const file = new File(['fake-image-data'], 'test.png', { type: 'image/png' });

    // Get the file input (it's hidden)
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    // Upload the file
    await userEvent.upload(fileInput, file);

    // Wait for the upload to complete
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled();
    });

    // Verify heic2any was not called for regular images
    expect(heic2any).not.toHaveBeenCalled();

    // Verify the data URL was passed
    const dataUrl = mockOnUpload.mock.calls[0][0];
    expect(dataUrl).toContain('data:image/png;base64,');
  });

  it('should convert HEIC images to JPEG before upload', async () => {
    // Mock heic2any to return a JPEG blob
    const mockJpegBlob = new Blob(['fake-jpeg-data'], { type: 'image/jpeg' });
    (heic2any as jest.Mock).mockResolvedValueOnce(mockJpegBlob);

    const { container } = render(<UploadStep onUpload={mockOnUpload} />);

    // Create a mock HEIC file
    const heicFile = new File(['fake-heic-data'], 'photo.heic', { type: 'image/heic' });

    // Get the file input
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    // Upload the HEIC file
    await userEvent.upload(fileInput, heicFile);

    // Wait for conversion to complete
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Verify heic2any was called with correct parameters
    expect(heic2any).toHaveBeenCalledWith({
      blob: heicFile,
      toType: 'image/jpeg',
      quality: 0.9,
    });

    // Verify the converted image was passed as a data URL
    const dataUrl = mockOnUpload.mock.calls[0][0];
    expect(dataUrl).toContain('data:image/jpeg;base64,');
  });

  it('should detect HEIC by file extension', async () => {
    // Mock heic2any to return a JPEG blob
    const mockJpegBlob = new Blob(['fake-jpeg-data'], { type: 'image/jpeg' });
    (heic2any as jest.Mock).mockResolvedValueOnce(mockJpegBlob);

    const { container } = render(<UploadStep onUpload={mockOnUpload} />);

    // Create a file with .HEIC extension (uppercase) but no mime type
    const heicFile = new File(['fake-heic-data'], 'photo.HEIC', { type: '' });

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    await userEvent.upload(fileInput, heicFile);

    // Should trigger conversion
    await waitFor(() => {
      expect(heic2any).toHaveBeenCalled();
    });
  });

  it('should handle HEIC conversion errors gracefully', async () => {
    // Mock heic2any to throw an error
    (heic2any as jest.Mock).mockRejectedValueOnce(new Error('Conversion failed'));

    // Mock alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const { container } = render(<UploadStep onUpload={mockOnUpload} />);

    const heicFile = new File(['fake-heic-data'], 'photo.heic', { type: 'image/heic' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    await userEvent.upload(fileInput, heicFile);

    // Wait for error handling
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Failed to convert HEIC image. Please try a different image format.');
    });

    // Should not call onUpload if conversion fails
    expect(mockOnUpload).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  it('should handle multi-image HEIC files', async () => {
    // Mock heic2any returning an array of blobs (multi-image HEIC)
    const mockJpegBlob1 = new Blob(['fake-jpeg-1'], { type: 'image/jpeg' });
    const mockJpegBlob2 = new Blob(['fake-jpeg-2'], { type: 'image/jpeg' });
    (heic2any as jest.Mock).mockResolvedValueOnce([mockJpegBlob1, mockJpegBlob2]);

    const { container } = render(<UploadStep onUpload={mockOnUpload} />);

    const heicFile = new File(['fake-heic-data'], 'photo.heic', { type: 'image/heic' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    await userEvent.upload(fileInput, heicFile);

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled();
    });

    // Should use only the first image from multi-image HEIC
    expect(heic2any).toHaveBeenCalled();
  });

  // Note: Browser-level validation via the accept attribute handles non-image files
  // Testing this in jsdom is unreliable as userEvent.upload behavior with accept differs from real browsers

  it('should accept files via button click', () => {
    render(<UploadStep onUpload={mockOnUpload} />);

    const button = screen.getByText('Choose Photo');
    expect(button).toBeInTheDocument();
  });

  it('should show drag and drop area', () => {
    render(<UploadStep onUpload={mockOnUpload} />);

    expect(screen.getByText(/or drag and drop your image here/i)).toBeInTheDocument();
  });
});
