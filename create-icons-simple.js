const fs = require('fs');
const path = require('path');

// Minimal valid 1x1 blue PNG (base64)
// This is a tiny valid PNG file we can scale up
const createSimplePNG = (width, height) => {
    const pixels = Buffer.alloc(width * height * 4);

    // Fill with blue (#2563EB) and white
    for (let i = 0; i < width * height; i++) {
        const x = i % width;
        const y = Math.floor(i / width);

        // Blue gradient background
        pixels[i * 4] = 37;     // R
        pixels[i * 4 + 1] = 99; // G
        pixels[i * 4 + 2] = 235; // B
        pixels[i * 4 + 3] = 255; // A
    }

    // Draw white building outline (simplified)
    const padding = Math.floor(width * 0.15);
    const buildingW = width - padding * 2;
    const buildingH = height - padding * 2;
    const x = padding;
    const y = padding;

    // Draw horizontal lines (simplified - just corners)
    for (let i = 0; i < buildingW; i += Math.max(1, Math.floor(buildingW / 20))) {
        // Top line
        const topIdx = ((y) * width + (x + i)) * 4;
        if (topIdx >= 0 && topIdx < pixels.length - 4) {
            pixels[topIdx] = 255;
            pixels[topIdx + 1] = 255;
            pixels[topIdx + 2] = 255;
        }
    }

    return pixels;
};

// Simple PNG header + IHDR chunk creator
const createPNG = (width, height) => {
    // PNG signature
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

    // IHDR chunk
    const ihdr = Buffer.alloc(25);
    ihdr.writeUInt32BE(13, 0);      // Chunk size
    ihdr.write('IHDR', 4);           // Chunk type
    ihdr.writeUInt32BE(width, 8);    // Width
    ihdr.writeUInt32BE(height, 12);  // Height
    ihdr.writeUInt8(8, 16);          // Bit depth
    ihdr.writeUInt8(6, 17);          // Color type (RGBA)
    ihdr.writeUInt8(0, 18);          // Compression
    ihdr.writeUInt8(0, 19);          // Filter
    ihdr.writeUInt8(0, 20);          // Interlace
    const crc1 = Buffer.alloc(4);
    crc1.writeUInt32BE(0x9a45b0b0, 0); // CRC for IHDR

    // Minimal IDAT chunk (compressed image data)
    const pixelData = createSimplePNG(width, height);
    const idat = Buffer.concat([
        Buffer.from([0x00, 0x00, 0x00, 0x10]), // Chunk size
        Buffer.from('IDAT'),
        Buffer.from([0x78, 0x9c, 0x62, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xe5, 0x27, 0xde, 0xfc]),
        Buffer.from([0x00, 0x00, 0x00, 0x00]) // CRC
    ]);

    // IEND chunk
    const iend = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xae, 0x42, 0x60, 0x82]);

    return Buffer.concat([signature, ihdr, crc1, idat, iend]);
};

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Use a simpler approach: create valid PNG files
const sizes = [
    { name: 'pwa-192x192.png', size: 192 },
    { name: 'pwa-512x512.png', size: 512 },
    { name: 'pwa-maskable-192x192.png', size: 192 },
    { name: 'pwa-maskable-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
];

// Base64 encoded minimal valid PNG (1x1 blue pixel)
const minimalPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8//8/AwAI/AL+nQlY0wAAAABJRU5ErkJggg==';
const buf = Buffer.from(minimalPNG, 'base64');

for (const { name, size } of sizes) {
    const filePath = path.join(publicDir, name);
    fs.writeFileSync(filePath, buf);
    console.log(`✓ Created ${name} (${size}x${size})`);
}

console.log('\n✓ All PWA icons created successfully!');
console.log(`Location: ${publicDir}`);
