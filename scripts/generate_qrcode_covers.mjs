import fs from 'fs';
import path from 'path';

const PUBLIC_IMAGES_DIR = path.join('/home/earth/digital-magazine', 'public', 'images');
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

// Simple deterministic pseudo-QR matrix generator for visual authenticity
function generateQRPattern(seedString) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash |= 0;
  }
  
  let rects = '';
  const size = 16; // 16x16 grid inside QR box
  const cellSize = 10;
  const startX = 40;
  const startY = 40;

  // Draw finder patterns (corners)
  const drawFinder = (x, y) => {
    let svg = `<rect x="${x}" y="${y}" width="70" height="70" fill="#ffffff" rx="4" />`;
    svg += `<rect x="${x+10}" y="${y+10}" width="50" height="50" fill="#09090b" rx="2" />`;
    svg += `<rect x="${x+20}" y="${y+20}" width="30" height="30" fill="#34d399" rx="1" />`;
    return svg;
  };

  rects += drawFinder(startX, startY);
  rects += drawFinder(startX + 90, startY);
  rects += drawFinder(startX, startY + 90);

  // Random data cells based on hash
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones
      if ((r < 7 && c < 7) || (r < 7 && c > size - 8) || (r > size - 8 && c < 7)) continue;
      
      const pseudoRand = Math.sin(hash + r * 12.9898 + c * 78.233) * 43758.5453;
      if (pseudoRand - Math.floor(pseudoRand) > 0.45) {
        const rx = startX + c * cellSize;
        const ry = startY + r * cellSize;
        rects += `<rect x="${rx}" y="${ry}" width="${cellSize}" height="${cellSize}" fill="#ffffff" rx="1" />`;
      }
    }
  }

  return rects;
}

export function generateQRCodeCover(slug, title, category, tags = []) {
  const sanitizedTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sanitizedCat = category.toUpperCase();
  const tagList = tags.length > 0 ? tags.slice(0, 3).map(t => `#${t.toUpperCase()}`).join('   ') : `#${sanitizedCat}   #TIWANTIWA   #DISPATCH`;
  
  const qrMatrix = generateQRPattern(slug);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050508" />
      <stop offset="100%" stop-color="#18181b" />
    </linearGradient>
    <linearGradient id="gold-glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
  </defs>

  <!-- Base Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- QR Code Structural Box (Left Side) -->
  <g transform="translate(80, 195)">
    <rect x="20" y="20" width="200" height="200" fill="#18181b" stroke="#27272a" stroke-width="2" rx="12" />
    <g transform="translate(10, 10)">
      ${generateQRPattern(slug)}
    </g>
  </g>

  <!-- Category Badge -->
  <g transform="translate(320, 195)">
    <rect x="0" y="0" width="180" height="34" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
    <text x="16" y="22" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">NODE // ${sanitizedCat}</text>
  </g>

  <!-- Narrative Dispatch Title (Right Side) -->
  <g transform="translate(320, 260)">
    <text x="0" y="0" fill="#ffffff" font-family="serif" font-size="40" font-weight="bold" width="800" letter-spacing="-0.5">
      <tspan x="0" dy="0">${sanitizedTitle.length > 42 ? sanitizedTitle.slice(0, 42) + '...' : sanitizedTitle}</tspan>
    </text>
  </g>

  <!-- Narrative Context Tags -->
  <g transform="translate(320, 390)">
    <text x="0" y="0" fill="url(#gold-glow)" font-family="monospace" font-size="13" font-weight="bold" letter-spacing="1.5">
      ${tagList}
    </text>
  </g>

  <!-- Footer Brand Stamp -->
  <g transform="translate(80, 550)">
    <text x="0" y="0" font-family="monospace" font-size="12" fill="#71717a" letter-spacing="1.5">
      <tspan fill="#34d399">[</tspan>TIWANTIWA QR INTEL ENGINE<tspan fill="#34d399">]</tspan> // SCAN FOR FULL DISPATCH
    </text>
  </g>
</svg>`;

  const filePath = path.join(PUBLIC_IMAGES_DIR, `${slug}.svg`);
  fs.writeFileSync(filePath, svg, 'utf8');
  console.log(`[+] Generated QR Code cover for ${slug}`);
  return `/images/${slug}.svg`;
}
