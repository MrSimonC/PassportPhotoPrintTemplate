import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenerateStep from '@/app/components/GenerateStep';
import { createPassportCroppedImage } from '../utils/imageHelpers';

// Mock fetch for the component tests
global.fetch = jest.fn();

describe('User Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GenerateStep Component', () => {
    it('should automatically generate print layout on mount', async () => {
      const croppedImage = await createPassportCroppedImage();
      const mockBlob = new Blob(['fake-image-data'], { type: 'image/png' });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const mockOnBack = jest.fn();
      const mockOnStartOver = jest.fn();

      render(
        <GenerateStep
          croppedImage={croppedImage}
          onBack={mockOnBack}
          onStartOver={mockOnStartOver}
        />
      );

      // Should show loading state initially
      expect(screen.getByText('Generating your print layout...')).toBeInTheDocument();

      // Wait for generation to complete
      await waitFor(() => {
        expect(screen.queryByText('Generating your print layout...')).not.toBeInTheDocument();
      });

      // Should show success message
      expect(screen.getByText('Ready to print!')).toBeInTheDocument();

      // Should have called the API with correct data
      expect(global.fetch).toHaveBeenCalledWith('/api/generate-print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          croppedImage: croppedImage,
        }),
      });
    });

    it('should display error message when generation fails', async () => {
      const croppedImage = await createPassportCroppedImage();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const mockOnBack = jest.fn();
      const mockOnStartOver = jest.fn();

      render(
        <GenerateStep
          croppedImage={croppedImage}
          onBack={mockOnBack}
          onStartOver={mockOnStartOver}
        />
      );

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Failed to generate print layout. Please try again.')).toBeInTheDocument();
      });

      // Should show retry button
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should allow user to retry after error', async () => {
      const croppedImage = await createPassportCroppedImage();
      const mockBlob = new Blob(['fake-image-data'], { type: 'image/png' });

      // First call fails
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const mockOnBack = jest.fn();
      const mockOnStartOver = jest.fn();

      const { rerender } = render(
        <GenerateStep
          croppedImage={croppedImage}
          onBack={mockOnBack}
          onStartOver={mockOnStartOver}
        />
      );

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText('Failed to generate print layout. Please try again.')).toBeInTheDocument();
      });

      // Mock success for retry
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      // Click retry button
      const retryButton = screen.getByText('Try Again');
      await userEvent.click(retryButton);

      // Wait for success (skip checking for loading state as it may be too fast)
      await waitFor(() => {
        expect(screen.getByText('Ready to print!')).toBeInTheDocument();
      });

      // Should have called fetch twice
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle network errors gracefully', async () => {
      const croppedImage = await createPassportCroppedImage();

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const mockOnBack = jest.fn();
      const mockOnStartOver = jest.fn();

      render(
        <GenerateStep
          croppedImage={croppedImage}
          onBack={mockOnBack}
          onStartOver={mockOnStartOver}
        />
      );

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText('Failed to generate print layout. Please try again.')).toBeInTheDocument();
      });
    });

    it('should call onBack when Back button is clicked', async () => {
      const croppedImage = await createPassportCroppedImage();
      const mockBlob = new Blob(['fake-image-data'], { type: 'image/png' });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const mockOnBack = jest.fn();
      const mockOnStartOver = jest.fn();

      render(
        <GenerateStep
          croppedImage={croppedImage}
          onBack={mockOnBack}
          onStartOver={mockOnStartOver}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Ready to print!')).toBeInTheDocument();
      });

      const backButton = screen.getByText('Back');
      await userEvent.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('should call onStartOver when Start Over button is clicked', async () => {
      const croppedImage = await createPassportCroppedImage();
      const mockBlob = new Blob(['fake-image-data'], { type: 'image/png' });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const mockOnBack = jest.fn();
      const mockOnStartOver = jest.fn();

      render(
        <GenerateStep
          croppedImage={croppedImage}
          onBack={mockOnBack}
          onStartOver={mockOnStartOver}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Ready to print!')).toBeInTheDocument();
      });

      const startOverButton = screen.getByText('Start Over');
      await userEvent.click(startOverButton);

      expect(mockOnStartOver).toHaveBeenCalledTimes(1);
    });

    it('should enable download button after successful generation', async () => {
      const croppedImage = await createPassportCroppedImage();
      const mockBlob = new Blob(['fake-image-data'], { type: 'image/png' });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const mockOnBack = jest.fn();
      const mockOnStartOver = jest.fn();

      render(
        <GenerateStep
          croppedImage={croppedImage}
          onBack={mockOnBack}
          onStartOver={mockOnStartOver}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Ready to print!')).toBeInTheDocument();
      });

      const downloadButton = screen.getByText('Download Print');
      expect(downloadButton).toBeInTheDocument();
      expect(downloadButton).not.toBeDisabled();
    });

    it('should disable action buttons during generation', async () => {
      const croppedImage = await createPassportCroppedImage();

      // Make fetch hang to keep loading state
      (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

      const mockOnBack = jest.fn();
      const mockOnStartOver = jest.fn();

      render(
        <GenerateStep
          croppedImage={croppedImage}
          onBack={mockOnBack}
          onStartOver={mockOnStartOver}
        />
      );

      // Buttons should be disabled during generation
      const backButton = screen.getByText('Back');
      const startOverButton = screen.getByText('Start Over');

      expect(backButton).toBeDisabled();
      expect(startOverButton).toBeDisabled();
    });

    it('should display all informational sections after successful generation', async () => {
      const croppedImage = await createPassportCroppedImage();
      const mockBlob = new Blob(['fake-image-data'], { type: 'image/png' });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const mockOnBack = jest.fn();
      const mockOnStartOver = jest.fn();

      const { container } = render(
        <GenerateStep
          croppedImage={croppedImage}
          onBack={mockOnBack}
          onStartOver={mockOnStartOver}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Ready to print!')).toBeInTheDocument();
      });

      // Check for key information sections
      expect(screen.getByText('Ready to print!')).toBeInTheDocument();
      expect(screen.getByText('Printing tips:')).toBeInTheDocument();

      // Verify important details are present in the document
      const fullText = container.textContent || '';
      expect(fullText).toMatch(/1800.*1200/);
      expect(fullText).toContain('300 DPI');
      expect(fullText).toContain('photo paper');
    });
  });
});
