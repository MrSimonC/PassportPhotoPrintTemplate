import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

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
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Get the dimensions of the cropped image
    const croppedImageSharp = sharp(imageBuffer);
    const metadata = await croppedImageSharp.metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Define the 6x4 inch canvas at 300 DPI (1800x1200 pixels)
    const canvasWidth = 1800;
    const canvasHeight = 1200;
    const dpi = 300;

    // Standard passport photo size: 2x2 inches at 300 DPI = 600x600 pixels
    const photoWidth = 600;
    const photoHeight = 600;

    // Resize the cropped image to passport photo size
    // Use 'fill' to ensure the entire cropped image is used without additional cropping
    const resizedPhoto = await sharp(imageBuffer)
      .resize(photoWidth, photoHeight, {
        fit: 'fill',
      })
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
      .jpeg({ quality: 95 })
      .withMetadata({
        density: dpi,
      })
      .toBuffer();

    // Return the image as a response
    return new NextResponse(finalImage as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'inline; filename="passport-photos.jpg"',
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
