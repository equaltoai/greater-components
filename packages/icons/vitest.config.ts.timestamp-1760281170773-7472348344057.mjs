// vitest.config.ts
import { defineConfig } from "file:///home/aron/ai-workspace/codebases/greater-components/node_modules/.pnpm/vitest@1.6.1_@types+node@20.19.10_@vitest+ui@2.1.9_vitest@2.1.9__jsdom@23.2.0_terser@5.43.1/node_modules/vitest/dist/config.js";
import { svelte } from "file:///home/aron/ai-workspace/codebases/greater-components/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@4.0.4_svelte@5.38.0_vite@5.4.19_@types+node@20.19.10_terser@5.43.1_/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
var vitest_config_default = defineConfig({
  plugins: [
    svelte({
      hot: !process.env.VITEST,
      compilerOptions: {
        dev: true
      }
    })
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
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
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2Fyb24vYWktd29ya3NwYWNlL2NvZGViYXNlcy9ncmVhdGVyLWNvbXBvbmVudHMvcGFja2FnZXMvaWNvbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2Fyb24vYWktd29ya3NwYWNlL2NvZGViYXNlcy9ncmVhdGVyLWNvbXBvbmVudHMvcGFja2FnZXMvaWNvbnMvdml0ZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hcm9uL2FpLXdvcmtzcGFjZS9jb2RlYmFzZXMvZ3JlYXRlci1jb21wb25lbnRzL3BhY2thZ2VzL2ljb25zL3ZpdGVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgc3ZlbHRlKHtcbiAgICAgIGhvdDogIXByb2Nlc3MuZW52LlZJVEVTVCxcbiAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgICBkZXY6IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICBdLFxuICB0ZXN0OiB7XG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBzZXR1cEZpbGVzOiBbJy4vdGVzdHMvc2V0dXAudHMnXSxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgcHJvdmlkZXI6ICd2OCcsXG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nLCAnaHRtbCcsICdsY292J10sXG4gICAgICByZXBvcnRzRGlyZWN0b3J5OiAnLi9jb3ZlcmFnZScsXG4gICAgICB0aHJlc2hvbGRzOiB7XG4gICAgICAgIGdsb2JhbDoge1xuICAgICAgICAgIGJyYW5jaGVzOiA5MCxcbiAgICAgICAgICBmdW5jdGlvbnM6IDkwLFxuICAgICAgICAgIGxpbmVzOiA5MCxcbiAgICAgICAgICBzdGF0ZW1lbnRzOiA5MFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaW5jbHVkZTogWydzcmMvKiovKi57dHMsanMsc3ZlbHRlfSddLFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnc3JjLyoqLyouZC50cycsXG4gICAgICAgICdzcmMvKiovKi50ZXN0Lnt0cyxqc30nLFxuICAgICAgICAnc3JjLyoqLyouc3BlYy57dHMsanN9JyxcbiAgICAgICAgJ3Rlc3RzLyoqLyonLFxuICAgICAgICAnZGlzdC8qKi8qJyxcbiAgICAgICAgJ25vZGVfbW9kdWxlcy8qKi8qJ1xuICAgICAgXVxuICAgIH1cbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6ICcvc3JjJ1xuICAgIH1cbiAgfVxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUErWCxTQUFTLG9CQUFvQjtBQUM1WixTQUFTLGNBQWM7QUFFdkIsSUFBTyx3QkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxDQUFDLFFBQVEsSUFBSTtBQUFBLE1BQ2xCLGlCQUFpQjtBQUFBLFFBQ2YsS0FBSztBQUFBLE1BQ1A7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixhQUFhO0FBQUEsSUFDYixTQUFTO0FBQUEsSUFDVCxZQUFZLENBQUMsa0JBQWtCO0FBQUEsSUFDL0IsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxRQUFRLE1BQU07QUFBQSxNQUN6QyxrQkFBa0I7QUFBQSxNQUNsQixZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsVUFDTixVQUFVO0FBQUEsVUFDVixXQUFXO0FBQUEsVUFDWCxPQUFPO0FBQUEsVUFDUCxZQUFZO0FBQUEsUUFDZDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVMsQ0FBQyx5QkFBeUI7QUFBQSxNQUNuQyxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
