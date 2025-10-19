import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/shadcn-ui')
    },
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'https://express.haeispa.online',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  
});
