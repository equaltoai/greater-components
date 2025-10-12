// vite.config.ts
import { defineConfig } from "file:///home/aron/ai-workspace/codebases/greater-components/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.10_terser@5.43.1/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///home/aron/ai-workspace/codebases/greater-components/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@4.0.4_svelte@5.38.0_vite@5.4.19_@types+node@20.19.10_terser@5.43.1_/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import path from "path";
var __vite_injected_original_dirname = "/home/aron/ai-workspace/codebases/greater-components/packages/headless";
var vite_config_default = defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true
      }
    })
  ],
  build: {
    lib: {
      entry: {
        index: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
        "primitives/button": path.resolve(__vite_injected_original_dirname, "src/primitives/button.ts"),
        "primitives/modal": path.resolve(__vite_injected_original_dirname, "src/primitives/modal.ts"),
        "primitives/menu": path.resolve(__vite_injected_original_dirname, "src/primitives/menu.ts"),
        "primitives/tooltip": path.resolve(__vite_injected_original_dirname, "src/primitives/tooltip.ts"),
        "primitives/tabs": path.resolve(__vite_injected_original_dirname, "src/primitives/tabs.ts")
      },
      name: "GreaterHeadless",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["svelte", "svelte/store", "svelte/internal", "focus-trap", "tabbable"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        exports: "named",
        entryFileNames: "[name].js"
      }
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true
  },
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      },
      include: ["src/**/*.{ts,js,svelte}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,js}",
        "src/**/*.spec.{ts,js}",
        "tests/**/*",
        "dist/**/*",
        "node_modules/**/*"
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hcm9uL2FpLXdvcmtzcGFjZS9jb2RlYmFzZXMvZ3JlYXRlci1jb21wb25lbnRzL3BhY2thZ2VzL2hlYWRsZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9hcm9uL2FpLXdvcmtzcGFjZS9jb2RlYmFzZXMvZ3JlYXRlci1jb21wb25lbnRzL3BhY2thZ2VzL2hlYWRsZXNzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Fyb24vYWktd29ya3NwYWNlL2NvZGViYXNlcy9ncmVhdGVyLWNvbXBvbmVudHMvcGFja2FnZXMvaGVhZGxlc3Mvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBzdmVsdGUoe1xuICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgIHJ1bmVzOiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgXSxcbiAgYnVpbGQ6IHtcblx0XHRsaWI6IHtcblx0XHRcdGVudHJ5OiB7XG5cdFx0XHRcdGluZGV4OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXG5cdFx0XHRcdCdwcmltaXRpdmVzL2J1dHRvbic6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvcHJpbWl0aXZlcy9idXR0b24udHMnKSxcblx0XHRcdFx0J3ByaW1pdGl2ZXMvbW9kYWwnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3ByaW1pdGl2ZXMvbW9kYWwudHMnKSxcblx0XHRcdFx0J3ByaW1pdGl2ZXMvbWVudSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvcHJpbWl0aXZlcy9tZW51LnRzJyksXG5cdFx0XHRcdCdwcmltaXRpdmVzL3Rvb2x0aXAnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3ByaW1pdGl2ZXMvdG9vbHRpcC50cycpLFxuXHRcdFx0XHQncHJpbWl0aXZlcy90YWJzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wcmltaXRpdmVzL3RhYnMudHMnKSxcblx0XHRcdH0sXG5cdFx0XHRuYW1lOiAnR3JlYXRlckhlYWRsZXNzJyxcblx0XHRcdGZvcm1hdHM6IFsnZXMnXVxuXHRcdH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsnc3ZlbHRlJywgJ3N2ZWx0ZS9zdG9yZScsICdzdmVsdGUvaW50ZXJuYWwnLCAnZm9jdXMtdHJhcCcsICd0YWJiYWJsZSddLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIHByZXNlcnZlTW9kdWxlczogdHJ1ZSxcbiAgICAgICAgcHJlc2VydmVNb2R1bGVzUm9vdDogJ3NyYycsXG4gICAgICAgIGV4cG9ydHM6ICduYW1lZCcsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLmpzJ1xuICAgICAgfVxuICAgIH0sXG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgc291cmNlbWFwOiB0cnVlXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICBwcm92aWRlcjogJ3Y4JyxcbiAgICAgIHJlcG9ydGVyOiBbJ3RleHQnLCAnanNvbicsICdodG1sJywgJ2xjb3YnXSxcbiAgICAgIHJlcG9ydHNEaXJlY3Rvcnk6ICcuL2NvdmVyYWdlJyxcbiAgICAgIHRocmVzaG9sZHM6IHtcbiAgICAgICAgZ2xvYmFsOiB7XG4gICAgICAgICAgYnJhbmNoZXM6IDkwLFxuICAgICAgICAgIGZ1bmN0aW9uczogOTAsXG4gICAgICAgICAgbGluZXM6IDkwLFxuICAgICAgICAgIHN0YXRlbWVudHM6IDkwXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0cyxqcyxzdmVsdGV9J10sXG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICdzcmMvKiovKi5kLnRzJyxcbiAgICAgICAgJ3NyYy8qKi8qLnRlc3Que3RzLGpzfScsXG4gICAgICAgICdzcmMvKiovKi5zcGVjLnt0cyxqc30nLFxuICAgICAgICAndGVzdHMvKiovKicsXG4gICAgICAgICdkaXN0LyoqLyonLFxuICAgICAgICAnbm9kZV9tb2R1bGVzLyoqLyonXG4gICAgICBdXG4gICAgfVxuICB9XG59KTtcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvWSxTQUFTLG9CQUFvQjtBQUNqYSxTQUFTLGNBQWM7QUFDdkIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLGlCQUFpQjtBQUFBLFFBQ2YsT0FBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDUCxLQUFLO0FBQUEsTUFDSixPQUFPO0FBQUEsUUFDTixPQUFPLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsUUFDN0MscUJBQXFCLEtBQUssUUFBUSxrQ0FBVywwQkFBMEI7QUFBQSxRQUN2RSxvQkFBb0IsS0FBSyxRQUFRLGtDQUFXLHlCQUF5QjtBQUFBLFFBQ3JFLG1CQUFtQixLQUFLLFFBQVEsa0NBQVcsd0JBQXdCO0FBQUEsUUFDbkUsc0JBQXNCLEtBQUssUUFBUSxrQ0FBVywyQkFBMkI7QUFBQSxRQUN6RSxtQkFBbUIsS0FBSyxRQUFRLGtDQUFXLHdCQUF3QjtBQUFBLE1BQ3BFO0FBQUEsTUFDQSxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2Y7QUFBQSxJQUNFLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxVQUFVLGdCQUFnQixtQkFBbUIsY0FBYyxVQUFVO0FBQUEsTUFDaEYsUUFBUTtBQUFBLFFBQ04saUJBQWlCO0FBQUEsUUFDakIscUJBQXFCO0FBQUEsUUFDckIsU0FBUztBQUFBLFFBQ1QsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osYUFBYTtBQUFBLElBQ2IsU0FBUztBQUFBLElBQ1QsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxRQUFRLE1BQU07QUFBQSxNQUN6QyxrQkFBa0I7QUFBQSxNQUNsQixZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsVUFDTixVQUFVO0FBQUEsVUFDVixXQUFXO0FBQUEsVUFDWCxPQUFPO0FBQUEsVUFDUCxZQUFZO0FBQUEsUUFDZDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVMsQ0FBQyx5QkFBeUI7QUFBQSxNQUNuQyxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
