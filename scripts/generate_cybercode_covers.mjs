import fs from 'fs';
import path from 'path';

const PUBLIC_IMAGES_DIR = path.join('/home/earth/digital-magazine', 'public', 'images');
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

export function generateCyberCodeCover(slug, title, category, tags = []) {
  const sanitizedTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sanitizedCat = category.toUpperCase();
  const tagList = tags.length > 0 ? tags.slice(0, 3).map(t => `#${t.toUpperCase()}`).join('   ') : `#${sanitizedCat}   #TIWANTIWA   #DISPATCH`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050508" />
      <stop offset="50%" stop-color="#09090b" />
      <stop offset="100%" stop-color="#121216" />
    </linearGradient>
    <linearGradient id="cyber-glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="50%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
  </defs>

  <!-- Cybernetic Dark Base -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Cybercode Matrix Grid Lines -->
  <g opacity="0.15" stroke="#34d399" stroke-width="1">
    <path d="M 0 100 L 1200 100 M 0 200 L 1200 200 M 0 300 L 1200 300 M 0 400 L 1200 400 M 0 500 L 1200 500" />
    <path d="M 200 0 L 200 630 M 400 0 L 400 630 M 600 0 L 600 630 M 800 0 L 800 630 M 1000 0 L 1000 630" />
  </g>

  <!-- Glowing Cyber Accent Bar -->
  <rect x="80" y="80" width="1040" height="4" fill="url(#cyber-glow)" rx="2" />

  <!-- Category & Cybercode Metadata Header -->
  <g transform="translate(80, 130)">
    <rect x="0" y="0" width="240" height="38" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
    <text x="18" y="24" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold" letter-spacing="2">SYS_NODE // ${sanitizedCat}</text>
  </g>

  <!-- Narrative Title Painting the Picture -->
  <g transform="translate(80, 240)">
    <text x="0" y="0" fill="#ffffff" font-family="serif" font-size="46" font-weight="bold" width="1040" letter-spacing="-0.5">
      <tspan x="0" dy="0">${sanitizedTitle.length > 50 ? sanitizedTitle.slice(0, 50) + '...' : sanitizedTitle}</tspan>
    </text>
  </g>

  <!-- Rich Story Narrative Tags Painting the Context -->
  <g transform="translate(80, 420)">
    <rect x="0" y="0" width="1040" height="48" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1" />
    <text x="24" y="30" fill="#fbbf24" font-family="monospace" font-size="14" font-weight="bold" letter-spacing="1.5">
      ${tagList}
    </text>
  </g>

  <!-- Cybercode Footer Stamp -->
  <g transform="translate(80, 540)">
    <text x="0" y="0" font-family="monospace" font-size="13" fill="#71717a" letter-spacing="1.5">
      <tspan fill="#34d399">[</tspan>TIWANTIWA CYBERCODE ENGINE<tspan fill="#34d399">]</tspan> // SECURE SEC-2026
    </text>
  </g>
</svg>`;

  const filePath = path.join(PUBLIC_IMAGES_DIR, `${slug}.svg`);
  fs.writeFileSync(filePath, svg, 'utf8');
  console.log(`[+] Generated CyberCode SVG cover for ${slug}`);
  return `/images/${slug}.svg`;
}
