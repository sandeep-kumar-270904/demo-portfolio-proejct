import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { syncAudioPlaylist } from "./scripts/sync-audio.js";

function autoAudioPlugin(): Plugin {
  return {
    name: "auto-audio-sync",
    buildStart() {
      syncAudioPlaylist();
    },
    configureServer(server) {
      syncAudioPlaylist();
      const audioFolder = path.resolve(__dirname, "public/audio");
      server.watcher.add(audioFolder);
      server.watcher.on("all", (_event, filePath) => {
        if (
          filePath.includes(path.join("public", "audio")) ||
          filePath.includes("public/audio")
        ) {
          syncAudioPlaylist();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    autoAudioPlugin(),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean) as Plugin[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));
