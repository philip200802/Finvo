import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Minimal valid PNG - 1x1 pixel (blue #2563EB)
const minimalPNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8//8/AwAI/AL+nQlY0wAAAABJRU5ErkJggg==', 'base64');

const publicDir = path.join(__dirname, 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Create all required icons
const icons = [
    'pwa-192x192.png',
    'pwa-512x512.png',
    'pwa-maskable-192x192.png',
    'pwa-maskable-512x512.png',
    'apple-touch-icon.png'
];

icons.forEach(icon => {
    const filePath = path.join(publicDir, icon);
    fs.writeFileSync(filePath, minimalPNG);
    console.log(`✓ Created ${icon}`);
});

console.log('\n✓ All PWA icons created in /public directory!');
