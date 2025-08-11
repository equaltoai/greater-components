// vite.config.ts
import { defineConfig } from "file:///Users/aronprice/modern-work/greater-components/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.10_terser@5.43.1/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///Users/aronprice/modern-work/greater-components/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@4.0.4_svelte@5.38.0_vite@5.4.19_@types+node@20.19.10_terser@5.43.1_/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/aronprice/modern-work/greater-components/packages/icons";
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
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "GreaterIcons",
      fileName: "index"
    },
    rollupOptions: {
      external: ["svelte", "svelte/store", "svelte/internal"],
      output: {
        globals: {
          svelte: "Svelte"
        }
      }
    },
    outDir: "dist",
    emptyOutDir: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXJvbnByaWNlL21vZGVybi13b3JrL2dyZWF0ZXItY29tcG9uZW50cy9wYWNrYWdlcy9pY29uc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2Fyb25wcmljZS9tb2Rlcm4td29yay9ncmVhdGVyLWNvbXBvbmVudHMvcGFja2FnZXMvaWNvbnMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2Fyb25wcmljZS9tb2Rlcm4td29yay9ncmVhdGVyLWNvbXBvbmVudHMvcGFja2FnZXMvaWNvbnMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBzdmVsdGUoe1xuICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgIHJ1bmVzOiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXG4gICAgICBuYW1lOiAnR3JlYXRlckljb25zJyxcbiAgICAgIGZpbGVOYW1lOiAnaW5kZXgnXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWydzdmVsdGUnLCAnc3ZlbHRlL3N0b3JlJywgJ3N2ZWx0ZS9pbnRlcm5hbCddLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICBzdmVsdGU6ICdTdmVsdGUnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlXG4gIH1cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFcsU0FBUyxvQkFBb0I7QUFDelksU0FBUyxjQUFjO0FBQ3ZCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxpQkFBaUI7QUFBQSxRQUNmLE9BQU87QUFBQSxNQUNUO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQzdDLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsVUFBVSxnQkFBZ0IsaUJBQWlCO0FBQUEsTUFDdEQsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
