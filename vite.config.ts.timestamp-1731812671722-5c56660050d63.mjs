// vite.config.ts
import { defineConfig } from "file:///C:/Users/Faiz/CascadeProjects/vfx-company-dashboard/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Faiz/CascadeProjects/vfx-company-dashboard/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "node:path";
var __vite_injected_original_dirname = "c:\\Users\\Faiz\\CascadeProjects\\vfx-company-dashboard";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils")
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    // Force the specified port
    host: true,
    // Listen on all addresses
    open: true,
    cors: true,
    historyApiFallback: true
    // Enable SPA routing
  },
  base: "/",
  // Ensure proper base URL for routing
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion", "chart.js", "react-chartjs-2"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxGYWl6XFxcXENhc2NhZGVQcm9qZWN0c1xcXFx2ZngtY29tcGFueS1kYXNoYm9hcmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcImM6XFxcXFVzZXJzXFxcXEZhaXpcXFxcQ2FzY2FkZVByb2plY3RzXFxcXHZmeC1jb21wYW55LWRhc2hib2FyZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYzovVXNlcnMvRmFpei9DYXNjYWRlUHJvamVjdHMvdmZ4LWNvbXBhbnktZGFzaGJvYXJkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgJ0Bjb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgICdAdXRpbHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdXRpbHMnKSxcbiAgICB9XG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSwgLy8gRm9yY2UgdGhlIHNwZWNpZmllZCBwb3J0XG4gICAgaG9zdDogdHJ1ZSwgLy8gTGlzdGVuIG9uIGFsbCBhZGRyZXNzZXNcbiAgICBvcGVuOiB0cnVlLFxuICAgIGNvcnM6IHRydWUsXG4gICAgaGlzdG9yeUFwaUZhbGxiYWNrOiB0cnVlLCAvLyBFbmFibGUgU1BBIHJvdXRpbmdcbiAgfSxcbiAgYmFzZTogJy8nLCAvLyBFbnN1cmUgcHJvcGVyIGJhc2UgVVJMIGZvciByb3V0aW5nXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ2ZyYW1lci1tb3Rpb24nLCAnY2hhcnQuanMnLCAncmVhY3QtY2hhcnRqcy0yJ11cbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFWLFNBQVMsb0JBQW9CO0FBQ2xYLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyxlQUFlLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUN6RCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsSUFDakQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUE7QUFBQSxJQUNaLE1BQU07QUFBQTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sb0JBQW9CO0FBQUE7QUFBQSxFQUN0QjtBQUFBLEVBQ0EsTUFBTTtBQUFBO0FBQUEsRUFDTixjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLGlCQUFpQixZQUFZLGlCQUFpQjtBQUFBLEVBQ2hGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
