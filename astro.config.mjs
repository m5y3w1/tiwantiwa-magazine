import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://tiwantiwa.com',
  integrations: [
    tailwind({
      configFile: './tailwind.config.js'
    })
  ]
});
