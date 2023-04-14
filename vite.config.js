import { createProxyMiddleware } from "http-proxy-middleware";
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "https://accounts.spotify.com",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
        onProxyReq(proxyReq) {
          proxyReq.setHeader("origin", "https://accounts.spotify.com");
        },
      },
    },
  },
});
