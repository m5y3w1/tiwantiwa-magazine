import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join('/home/earth/digital-magazine', 'public');
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Solid background -->
  <rect width="512" height="512" fill="#09090b" />
  
  <!-- Stylized 'TW' Monogram in Emerald Green and Gold -->
  <g transform="translate(64, 96)">
    <!-- 'T' Component -->
    <path d="M 30 20 L 210 20 L 210 90 L 140 90 L 140 320 L 100 320 L 100 90 L 30 90 Z" fill="#34d399" />
    
    <!-- 'W' Component -->
    <path d="M 230 20 L 270 20 L 310 200 L 350 20 L 390 20 L 430 200 L 470 20 L 510 20 L 450 320 L 405 320 L 370 150 L 335 320 L 295 320 Z" fill="#fbbf24" />
  </g>
</svg>`;

const faviconPath = path.join(PUBLIC_DIR, 'favicon.svg');
fs.writeFileSync(faviconPath, faviconSvg, 'utf8');
console.log(`[+] Favicon generated successfully at ${faviconPath}`);
