/**
 * Script to generate test fixture images
 * Run with: npx ts-node __tests__/fixtures/generateFixtures.ts
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateFixtures() {
  const fixturesDir = __dirname;

  console.log('Generating test fixture images...');

  // Generate a realistic passport photo (simulating a face with gradient)
  const passportPhoto = await sharp({
    create: {
      width: 500,
      height: 700,
      channels: 3,
      background: { r: 220, g: 210, b: 200 }, // Beige background
    },
  })
    .png()
    .toBuffer();

  writeFileSync(join(fixturesDir, 'test-passport-photo.png'), passportPhoto);
  console.log('✓ Created test-passport-photo.png');

  // Generate a small test image
  const smallImage = await sharp({
    create: {
      width: 100,
      height: 150,
      channels: 3,
      background: { r: 150, g: 150, b: 150 },
    },
  })
    .png()
    .toBuffer();

  writeFileSync(join(fixturesDir, 'test-small-image.png'), smallImage);
  console.log('✓ Created test-small-image.png');

  // Generate a large test image
  const largeImage = await sharp({
    create: {
      width: 3000,
      height: 4000,
      channels: 3,
      background: { r: 100, g: 120, b: 140 },
    },
  })
    .png()
    .toBuffer();

  writeFileSync(join(fixturesDir, 'test-large-image.png'), largeImage);
  console.log('✓ Created test-large-image.png');

  console.log('\nAll fixture images generated successfully!');
}

generateFixtures().catch(console.error);
