import { defineConfig } from "vite";

export default defineConfig({
  // Set the base URL for your project here
  base: "/shine/",
  assetsInclude: ["**/*.glb", "**/*.stl"],
  resolve: {
    alias: {
      // Map the glb extension to the url-loader
      // This tells Vite to use the url-loader for glb files
      "^.+\\.glb$": "url-loader",
    },
  },
  // ... other configuration options
});
