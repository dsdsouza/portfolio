import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { attachBrowserService } from './server/browser-service.mjs';

function localBrowser() {
  const attach = (server) => {
    if (!server.httpServer) return;
    const close = attachBrowserService(server.httpServer);
    server.httpServer.once('close', close);
  };
  return { name: 'local-profile-browser', configureServer: attach, configurePreviewServer: attach };
}

export default defineConfig({
  plugins: [react(), localBrowser()],
  build: {
    manifest: true,
    rolldownOptions: { output: { codeSplitting: { groups: [
      { name: 'react-vendor', test: /node_modules\/(react|react-dom|scheduler)\// },
    ] } } },
  },
});
