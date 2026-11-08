import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
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

      // Silently handle transient Windows EBUSY locks during file paste/copy
      server.watcher.on("error", (err: unknown) => {
        console.warn("[Watcher Warning (Safe)]:", (err as Error)?.message || err);
      });

      let debounceTimer: ReturnType<typeof setTimeout> | undefined;
      const audioFolder = path.resolve(__dirname, "public/audio");
      server.watcher.add(audioFolder);
      server.watcher.on("all", (_event, filePath) => {
        if (
          filePath &&
          (filePath.includes(path.join("public", "audio")) ||
            filePath.includes("public/audio"))
        ) {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            try {
              syncAudioPlaylist();
            } catch (err) {
              console.warn("[Sync Audio Warning]:", err);
            }
          }, 350);
        }
      });

      // Add HTTP Range Request support for all local audio files in Vite
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith("/audio/")) {
          return next();
        }

        const decodedPath = decodeURI(req.url.split("?")[0]);
        const filePath = path.resolve(__dirname, "public", "." + decodedPath);

        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          return next();
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;
        const ext = path.extname(filePath).toLowerCase();

        const mimeTypes: Record<string, string> = {
          ".mp3": "audio/mpeg",
          ".m4a": "audio/mp4",
          ".wav": "audio/wav",
          ".ogg": "audio/ogg",
          ".aac": "audio/aac",
          ".flac": "audio/flac",
        };
        const contentType = mimeTypes[ext] || "application/octet-stream";

        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

          if (start >= fileSize || end >= fileSize) {
            res.writeHead(416, {
              "Content-Range": `bytes */${fileSize}`,
            });
            return res.end();
          }

          const chunksize = end - start + 1;
          const stream = fs.createReadStream(filePath, { start, end });

          res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": contentType,
          });

          stream.pipe(res);
        } else {
          res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": contentType,
            "Accept-Ranges": "bytes",
          });
          fs.createReadStream(filePath).pipe(res);
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
