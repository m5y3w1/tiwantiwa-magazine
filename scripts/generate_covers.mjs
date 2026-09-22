import fs from 'fs';
import path from 'path';

const PUBLIC_IMAGES_DIR = path.join('/home/earth/digital-magazine', 'public', 'images');
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

export function generateSvgCover(slug, title, category) {
  const sanitizedTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sanitizedCat = category.toUpperCase();
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#09090b" />
      <stop offset="100%" stop-color="#18181b" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />
  
  <!-- Grid overlay -->
  <path d="M 0 0 L 1200 0 M 0 105 L 1200 105 M 0 210 L 1200 210 M 0 315 L 1200 315 M 0 420 L 1200 420 M 0 525 L 1200 525 M 0 630 L 1200 630" stroke="#27272a" stroke-width="1" opacity="0.4" />
  
  <!-- Top Badge / Category -->
  <rect x="80" y="80" width="220" height="40" rx="6" fill="#27272a" stroke="#3f3f46" stroke-width="1" />
  <text x="100" y="107" fill="#34d399" font-family="monospace" font-size="14" font-weight="bold" letter-spacing="2">${sanitizedCat}</text>
  
  <!-- Title -->
  <text x="80" y="240" fill="#ffffff" font-family="serif" font-size="52" font-weight="bold" width="1040">
    <tspan x="80" dy="0">${sanitizedTitle.length > 45 ? sanitizedTitle.slice(0, 45) + '...' : sanitizedTitle}</tspan>
  </text>
  
  <!-- Brand Footer -->
  <g transform="translate(80, 520)">
    <text x="0" y="0" fill="#a1a1aa" font-family="monospace" font-size="18" letter-spacing="1">
      <tspan fill="#34d399">[</tspan>tiwantiwa<tspan fill="#34d399">]</tspan> — Enterprise Digital Magazine
    </text>
  </g>
</svg>`;

  const filePath = path.join(PUBLIC_IMAGES_DIR, `${slug}.svg`);
  fs.writeFileSync(filePath, svg, 'utf8');
  console.log(`[+] Generated SVG cover for ${slug} at ${filePath}`);
  return `/images/${slug}.svg`;
}
