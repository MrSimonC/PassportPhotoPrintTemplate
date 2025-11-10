/**
 * Real HEIC conversion test using actual heic2any library (not mocked)
 * This test verifies that heic2any can actually load and convert HEIC files
 *
 * NOTE: These tests will fail in jsdom because heic2any requires real browser APIs
 * (Canvas, Web Workers, WebAssembly) that jsdom doesn't provide.
 * These tests are here to verify the component behavior, but heic2any functionality
 * must be tested in a real browser or with tools like Playwright/Cypress.
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadStep from '@/app/components/UploadStep';
import { readFileSync } from 'fs';
import { join } from 'path';

// DO NOT MOCK heic2any - we want to test the real library
describe('HEIC Real Conversion Tests (No Mocks)', () => {
  let mockOnUpload: jest.Mock;
  const fixturesPath = join(__dirname, '../fixtures');

  beforeEach(() => {
    mockOnUpload = jest.fn();
  });

  it('should actually convert a real HEIC file using heic2any library', async () => {
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

    const { container } = render(<UploadStep onUpload={mockOnUpload} />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    // Upload the real HEIC file
    await userEvent.upload(fileInput, heicFile);

    // Verify converting state appears
    expect(screen.getByText('Converting HEIC image...')).toBeInTheDocument();

    // Wait for conversion to complete (this uses the REAL heic2any library)
    await waitFor(
      () => {
        expect(mockOnUpload).toHaveBeenCalled();
      },
      { timeout: 15000 } // Longer timeout for real conversion
    );

    // Verify the result is a valid data URL
    const dataUrl = mockOnUpload.mock.calls[0][0];
    expect(dataUrl).toMatch(/^data:image\/(jpeg|jpg);base64,/);
    expect(dataUrl.length).toBeGreaterThan(100);

    // Verify converting state is gone
    expect(screen.queryByText('Converting HEIC image...')).not.toBeInTheDocument();
  }, 20000); // 20 second timeout for the whole test

  it('should convert IMG_5671.heic if it exists in fixtures', async () => {
    const heicFilePath = join(fixturesPath, 'IMG_5671.heic');
    let heicBuffer: Buffer;

    try {
      heicBuffer = readFileSync(heicFilePath);
    } catch (error) {
      console.warn('IMG_5671.heic not found in fixtures, skipping test');
      return;
    }

    const heicFile = new File([heicBuffer], 'IMG_5671.heic', {
      type: 'image/heic',
    });

    const { container } = render(<UploadStep onUpload={mockOnUpload} />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(fileInput, heicFile);

    // Wait for conversion to complete
    await waitFor(
      () => {
        expect(mockOnUpload).toHaveBeenCalled();
      },
      { timeout: 15000 }
    );

    // Verify the result is valid
    const dataUrl = mockOnUpload.mock.calls[0][0];
    expect(dataUrl).toMatch(/^data:image\/(jpeg|jpg);base64,/);
    expect(dataUrl.length).toBeGreaterThan(100);
  }, 20000);

  it('should handle HEIC files without MIME type using real conversion', async () => {
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
      type: '', // No MIME type - should be detected by extension
    });

    const { container } = render(<UploadStep onUpload={mockOnUpload} />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(fileInput, heicFile);

    // Wait for conversion to complete
    await waitFor(
      () => {
        expect(mockOnUpload).toHaveBeenCalled();
      },
      { timeout: 15000 }
    );

    // Verify the result is valid
    const dataUrl = mockOnUpload.mock.calls[0][0];
    expect(dataUrl).toMatch(/^data:image\/(jpeg|jpg);base64,/);
  }, 20000);
});
