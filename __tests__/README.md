# Test Suite Documentation

This directory contains comprehensive tests for the Passport Photo Print Template application.

## Overview

The test suite includes:
- **API Route Tests**: Tests for the `/api/generate-print` endpoint
- **Integration Tests**: End-to-end tests for user workflows
- **Test Utilities**: Helper functions for creating test images
- **Test Fixtures**: Sample images for testing

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only API tests
npm run test:api

# Run only integration tests
npm run test:integration
```

## Test Structure

```
__tests__/
├── api/
│   └── generate-print.test.ts    # API endpoint tests
├── integration/
│   └── user-flow.test.tsx        # User journey tests
├── utils/
│   └── imageHelpers.ts           # Test utility functions
├── fixtures/
│   ├── generateFixtures.ts       # Script to generate test images
│   ├── test-passport-photo.png   # Sample passport photo
│   ├── test-small-image.png      # Small test image
│   └── test-large-image.png      # Large test image
└── README.md                     # This file
```

## API Route Tests (`api/generate-print.test.ts`)

Tests the core image processing logic of the `/api/generate-print` endpoint:

### What's Tested:
- ✅ Processing valid passport photos
- ✅ Handling various image sizes (small, large, square, wide)
- ✅ Creating correct canvas dimensions (1800x1200px)
- ✅ Adding white borders to photos
- ✅ Maintaining 300 DPI metadata
- ✅ Creating valid PNG output
- ✅ Handling base64 data with/without data URL prefix
- ✅ Error handling for invalid image data

### Key Test Scenarios:

```typescript
// Valid passport photo processing
it('should successfully process a valid passport photo', async () => {
  const croppedImage = await createPassportCroppedImage();
  const result = await processImageToLayout(imageBuffer);
  expect(result.width).toBe(1800);
  expect(result.height).toBe(1200);
});

// Various image sizes
it('should handle various image sizes', async () => {
  // Tests tiny, large, square, and wide images
});

// DPI metadata
it('should maintain 300 DPI metadata', async () => {
  const metadata = await sharp(result.buffer).metadata();
  expect(metadata.density).toBe(300);
});
```

## Integration Tests (`integration/user-flow.test.tsx`)

Tests the complete user journey through the GenerateStep component:

### What's Tested:
- ✅ Automatic generation on component mount
- ✅ Error display when generation fails
- ✅ Retry functionality after errors
- ✅ Network error handling
- ✅ Navigation buttons (Back, Start Over)
- ✅ Download button availability
- ✅ Button states during loading
- ✅ Informational content display

### Key Test Scenarios:

```typescript
// Auto-generation on mount
it('should automatically generate print layout on mount', async () => {
  render(<GenerateStep croppedImage={croppedImage} ... />);
  await waitFor(() => {
    expect(screen.getByText('Ready to print!')).toBeInTheDocument();
  });
});

// Error handling
it('should display error message when generation fails', async () => {
  // Mock failed fetch
  await waitFor(() => {
    expect(screen.getByText('Failed to generate print layout. Please try again.'))
      .toBeInTheDocument();
  });
});

// Retry functionality
it('should allow user to retry after error', async () => {
  // Test retry button and successful second attempt
});
```

## Test Utilities (`utils/imageHelpers.ts`)

Provides helper functions for creating and validating test images:

### Available Functions:

```typescript
// Create a test image
await createTestImage(width, height, color);

// Convert buffer to data URL
bufferToDataURL(buffer, 'image/png');

// Get image dimensions
await getImageDimensions(buffer);

// Validate PNG
await isValidPNG(buffer);

// Create passport-sized image
await createPassportCroppedImage();

// Test scenarios
await testImageScenarios.validPassportPhoto();
await testImageScenarios.tinyImage();
await testImageScenarios.largeImage();
await testImageScenarios.squareImage();
await testImageScenarios.wideImage();
```

## Test Fixtures

Sample images for testing are located in `__tests__/fixtures/`:

- `test-passport-photo.png` - Standard passport photo size (500x700px)
- `test-small-image.png` - Small image (100x150px)
- `test-large-image.png` - Large image (3000x4000px)

### Regenerating Fixtures

```bash
npx ts-node __tests__/fixtures/generateFixtures.ts
```

## Coverage

Run tests with coverage to see how much of the codebase is tested:

```bash
npm run test:coverage
```

This will generate a coverage report showing:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

## Debugging Tests

### Run a Specific Test

```bash
npm test -- -t "should automatically generate print layout"
```

### Enable Verbose Output

```bash
npm test -- --verbose
```

### Debug in VS Code

Add this configuration to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Common Issues

### Tests Timing Out

If tests are timing out, increase the timeout:

```typescript
it('should process large image', async () => {
  // Test code
}, 30000); // 30 second timeout
```

### Mock Data Not Working

Ensure mocks are cleared between tests:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### Image Processing Errors

Check that Sharp is properly installed:

```bash
npm rebuild sharp
```

## CI/CD Integration

These tests are designed to run in CI/CD pipelines. Example GitHub Actions workflow:

```yaml
- name: Run tests
  run: npm test -- --ci --coverage --maxWorkers=2
```

## Contributing

When adding new tests:

1. Follow existing test patterns
2. Use descriptive test names
3. Test both success and error cases
4. Keep tests isolated and independent
5. Mock external dependencies
6. Add comments for complex test logic

## Test Results

Current test status:
- ✅ 18 tests passing
- 🎯 2 test suites (API + Integration)
- ⚡ Average run time: ~7 seconds

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
