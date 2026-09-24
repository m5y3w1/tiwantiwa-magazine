import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join('/home/earth/digital-magazine', 'public');

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#09090b" />
  
  <!-- T in Emerald Green -->
  <path d="M 12 16 L 36 16 L 36 24 L 28 24 L 28 48 L 20 48 L 20 24 L 12 24 Z" fill="#34d399" />
  
  <!-- W in Bright Gold -->
  <path d="M 38 16 L 43 16 L 46 36 L 49 16 L 54 16 L 57 36 L 60 16 L 64 16 L 58 48 L 54 48 L 51 30 L 48 48 L 44 48 Z" fill="#fbbf24" transform="translate(-24, 0)" />
</svg>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), faviconSvg, 'utf8');
console.log('[+] Favicon optimized for 32x32 legibility.');
