import sharp from 'sharp';

/**
 * Creates a test passport photo image
 * @param width - Width in pixels
 * @param height - Height in pixels
 * @param color - RGB color object
 * @returns Buffer containing the PNG image
 */
export async function createTestImage(
  width: number = 400,
  height: number = 600,
  color: { r: number; g: number; b: number } = { r: 100, g: 150, b: 200 }
): Promise<Buffer> {
  return await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: color,
    },
  })
    .png()
    .toBuffer();
}

/**
 * Converts a buffer to base64 data URL
 */
export function bufferToDataURL(buffer: Buffer, mimeType: string = 'image/png'): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Validates image dimensions
 */
export async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}

/**
 * Checks if an image is valid PNG
 */
export async function isValidPNG(buffer: Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(buffer).metadata();
    return metadata.format === 'png';
  } catch {
    return false;
  }
}

/**
 * Creates a passport-sized cropped image for testing
 * This mimics what would come from the CropStep component
 */
export async function createPassportCroppedImage(): Promise<string> {
  // Create a realistic passport photo sized image (slightly larger than final size)
  const buffer = await createTestImage(500, 700, { r: 220, g: 210, b: 200 });
  return bufferToDataURL(buffer);
}

/**
 * Creates various test scenarios
 */
export const testImageScenarios = {
  // Valid passport photo
  validPassportPhoto: async () => createPassportCroppedImage(),

  // Very small image
  tinyImage: async () => {
    const buffer = await createTestImage(50, 50);
    return bufferToDataURL(buffer);
  },

  // Very large image
  largeImage: async () => {
    const buffer = await createTestImage(4000, 6000);
    return bufferToDataURL(buffer);
  },

  // Square image (wrong aspect ratio)
  squareImage: async () => {
    const buffer = await createTestImage(500, 500);
    return bufferToDataURL(buffer);
  },

  // Wide image (wrong orientation)
  wideImage: async () => {
    const buffer = await createTestImage(700, 500);
    return bufferToDataURL(buffer);
  },

  // HEIC image (real world scenario)
  heicImage: async () => {
    const fs = await import('fs');
    const path = await import('path');
    const convert = (await import('heic-convert')).default;
    const heicPath = path.join(__dirname, '../fixtures/test-large-image-heic.heic');

    // Read HEIC file
    const heicBuffer = fs.readFileSync(heicPath);

    // Convert HEIC to PNG using heic-convert
    // heic-convert expects a Uint8Array
    const pngBuffer = await convert({
      buffer: new Uint8Array(heicBuffer),
      format: 'PNG',
      quality: 1
    });

    return bufferToDataURL(Buffer.from(pngBuffer), 'image/png');
  },
};
