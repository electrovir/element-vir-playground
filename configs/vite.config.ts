import {baseViteConfig} from 'virmator/dist/compiled-base-configs/base-vite';
import {defineConfig} from 'vite';

export default defineConfig({
    ...baseViteConfig,
    ...(process.env.CI
        ? {
              base: `/${process.env.npm_package_name}/`,
              build: {
                  minify: false,
              },
          }
        : {}),
});
