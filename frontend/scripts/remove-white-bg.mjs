import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');
const files = ['logo.png', 'favicon.png'];

const BLACK_THRESHOLD = 85; // remove black and dark grey backgrounds

for (const file of files) {
  const filePath = join(publicDir, file);
  let img = sharp(filePath);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  const withAlpha = await sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer();
  img = sharp(withAlpha);
  await img
    .trim({ threshold: 2 })
    .toFile(filePath);
  console.log(`${file}: background removed and trimmed.`);
}
