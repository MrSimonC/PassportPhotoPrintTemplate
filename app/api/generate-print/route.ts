import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import convert from 'heic-convert';

/**
 * Detects if a buffer contains a HEIC image
 */
function isHEIC(buffer: Buffer): boolean {
  // HEIC files start with specific byte patterns
  // Check for 'ftyp' box with heic/heix/hevc/hevx brands
  const header = buffer.toString('ascii', 4, 12);
  return header.includes('ftyp') && (
    buffer.toString('ascii', 8, 12).includes('heic') ||
    buffer.toString('ascii', 8, 12).includes('heix') ||
    buffer.toString('ascii', 8, 12).includes('hevc') ||
    buffer.toString('ascii', 8, 12).includes('hevx') ||
    buffer.toString('ascii', 8, 12).includes('mif1')
  );
}

/**
 * Converts HEIC image to PNG
 */
async function convertHEICToPNG(buffer: Buffer): Promise<Buffer> {
  try {
    // heic-convert expects a Uint8Array
    const outputBuffer = await convert({
      buffer: new Uint8Array(buffer),
      format: 'PNG',
      quality: 1
    });
    return Buffer.from(outputBuffer);
  } catch (error) {
    console.error('HEIC conversion error:', error);
    throw new Error('Failed to convert HEIC image');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { croppedImage } = body;

    if (!croppedImage) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Remove data URL prefix if present
    const base64Data = croppedImage.replace(/^data:image\/\w+;base64,/, '');
    let imageBuffer = Buffer.from(base64Data, 'base64');

    // Check if the image is HEIC and convert if necessary
    if (isHEIC(imageBuffer)) {
      imageBuffer = await convertHEICToPNG(imageBuffer);
    }

    // Get the dimensions of the cropped image
    const croppedImageSharp = sharp(imageBuffer);
    const metadata = await croppedImageSharp.metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Define the 6x4 inch canvas at 300 DPI (1800x1200 pixels)
    const canvasWidth = 1800;
    const canvasHeight = 1200;
    const dpi = 300;

    // UK passport photo size: 35mm x 45mm at 300 DPI = 413 x 531 pixels
    const photoContentWidth = 413;
    const photoContentHeight = 531;

    // White border around each photo (like traditional passport photos)
    const borderSize = 12; // pixels (about 1mm at 300 DPI)

    // Total photo size including border
    const photoWidth = photoContentWidth + (borderSize * 2);
    const photoHeight = photoContentHeight + (borderSize * 2);

    // Resize the cropped image to UK passport photo size and add white border
    const resizedPhoto = await sharp(imageBuffer)
      .resize(photoContentWidth, photoContentHeight, {
        fit: 'fill',
      })
      .extend({
        top: borderSize,
        bottom: borderSize,
        left: borderSize,
        right: borderSize,
        background: { r: 255, g: 255, b: 255 }
      })
      .png()
      .toBuffer();

    // Calculate spacing for a 3x2 grid (3 columns, 2 rows)
    const cols = 3;
    const rows = 2;
    const horizontalSpacing = (canvasWidth - cols * photoWidth) / (cols + 1);
    const verticalSpacing = (canvasHeight - rows * photoHeight) / (rows + 1);

    // Create an array of composite operations for all 6 photos
    const compositeOperations = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = Math.round(horizontalSpacing * (col + 1) + photoWidth * col);
        const y = Math.round(verticalSpacing * (row + 1) + photoHeight * row);

        compositeOperations.push({
          input: resizedPhoto,
          top: y,
          left: x,
        });
      }
    }

    // Create a white canvas and composite all photos onto it
    const finalImage = await sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .composite(compositeOperations)
      .png()
      .withMetadata({
        density: dpi,
      })
      .toBuffer();

    // Return the image as a response
    return new NextResponse(finalImage as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="passport-photos.png"',
      },
    });
  } catch (error) {
    console.error('Error generating print:', error);
    return NextResponse.json(
      { error: 'Failed to generate print layout' },
      { status: 500 }
    );
  }
}
