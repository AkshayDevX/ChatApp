import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  server: {
		port: 5173,
		cors: true,
		proxy: {
			"/api/v1": {
				target: "http://localhost:8000",
				changeOrigin: true,
				ws: true,
			},
		},
	},
})
