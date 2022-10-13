import {baseViteConfig} from 'virmator/dist/compiled-base-configs/base-vite';
import {defineConfig} from 'vite';

export default defineConfig({
    ...baseViteConfig,
    ...(process.env.CI
        ? {
              base: '/element-vir-playground/',
          }
        : {}),
});
