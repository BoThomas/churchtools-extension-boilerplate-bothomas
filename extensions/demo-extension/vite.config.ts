import { defineConfig, loadEnv, type ServerOptions } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { versionInfoPlugin } from '@churchtools-extensions/build-tools/version-info-plugin';
import fs from 'fs';
import path from 'path';

function localHttps(): ServerOptions['https'] | undefined {
  const keyPath = path.resolve(__dirname, '../../certs/localhost-key.pem');
  const certPath = path.resolve(__dirname, '../../certs/localhost.pem');

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    return undefined;
  }

  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const extensionKey = process.env.VITE_KEY || 'demoextension';

  return defineConfig({
    base: `/ccm/${extensionKey}/`,
    server: {
      port: Number(process.env.VITE_PORT) || 5173,
      https: localHttps(),
      proxy: {
        '/api': {
          target: process.env.VITE_EXTERNAL_API_URL,
          changeOrigin: true,
          secure: true,
        },
      },
    },
    plugins: [vue(), tailwindcss(), versionInfoPlugin()],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
    },
  });
};
