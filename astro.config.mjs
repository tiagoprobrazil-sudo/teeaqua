import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({ imageService: 'cloudflare-binding' }),
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  image: { domains: ['images.unsplash.com'] },
  security: { checkOrigin: true },
  devToolbar: { enabled: false },
});
