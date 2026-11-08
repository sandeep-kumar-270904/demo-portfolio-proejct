import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.resolve(__dirname, "../public/audio");
const OUTPUT_FILE = path.resolve(__dirname, "../src/data/playlist.ts");

const AUDIO_EXTENSIONS = new Set([
  ".mp3",
  ".m4a",
  ".wav",
  ".ogg",
  ".aac",
  ".flac",
  ".opus",
  ".webm",
]);

// Custom metadata overrides for recognized songs
const KNOWN_SONGS = {
  tadow: { title: "Tadow", artist: "FKJ & Masego" },
  jawan: { title: "Jawan Title Track", artist: "Anirudh & Raja Kumari" },
};

function formatTitle(raw) {
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function syncAudioPlaylist() {
  if (!fs.existsSync(AUDIO_DIR)) {
    return;
  }

  const files = fs.readdirSync(AUDIO_DIR);
  const tracks = [];
  const seenUrls = new Set();

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!AUDIO_EXTENSIONS.has(ext)) continue;

    const baseName = path.basename(file, ext).trim();
    const key = baseName.toLowerCase().replace(/[^a-z0-9]/g, "");

    const audioUrl = `/audio/${encodeURI(file)}`;
    if (seenUrls.has(audioUrl)) continue;
    seenUrls.add(audioUrl);

    // Check if known override matches
    let matched = false;
    for (const [k, meta] of Object.entries(KNOWN_SONGS)) {
      if (key.includes(k)) {
        tracks.push({
          title: meta.title,
          artist: meta.artist,
          audioUrl,
        });
        matched = true;
        break;
      }
    }

    if (matched) continue;

    // Clean up filename: remove (Audio), (Official...), (128K), etc.
    let cleaned = baseName
      .replace(/\((audio|official.*?|128k|320k|lyrics|video|m4a_.*?)\)/gi, "")
      .replace(/\[(audio|official.*?|128k|320k|lyrics|video|m4a_.*?)\]/gi, "")
      .trim();

    // Check if format is "Song Title - Artist"
    if (cleaned.includes(" - ")) {
      const [p1, p2] = cleaned.split(" - ");
      tracks.push({
        title: formatTitle(p1),
        artist: formatTitle(p2 || "Portfolio Music"),
        audioUrl,
      });
    } else {
      tracks.push({
        title: formatTitle(cleaned),
        artist: "Portfolio Music",
        audioUrl,
      });
    }
  }

  // Ensure Tadow is first in main playlist if present
  tracks.sort((a, b) => {
    if (a.title.toLowerCase().includes("tadow")) return -1;
    if (b.title.toLowerCase().includes("tadow")) return 1;
    return a.title.localeCompare(b.title);
  });

  // Identify Intro Track:
  // 1. Look for any file with 'intro' in the filename (e.g. intro.mp3, intro-theme.mp3, cinematic_intro.wav)
  // 2. If no dedicated intro file is found, automatically use the first available song in the playlist
  let introTrack = null;
  for (const track of tracks) {
    const raw = decodeURIComponent(track.audioUrl).toLowerCase();
    if (raw.includes("intro") || track.title.toLowerCase().includes("intro")) {
      introTrack = track;
      break;
    }
  }

  if (!introTrack && tracks.length > 0) {
    introTrack = tracks[0];
  }

  const content = `// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY.
// Automatically updated from files in /public/audio/

export interface SongTrack {
  title: string;
  artist: string;
  audioUrl: string;
}

export const AUTO_PLAYLIST: SongTrack[] = ${JSON.stringify(tracks, null, 2)};

export const INTRO_TRACK: SongTrack | null = ${JSON.stringify(introTrack, null, 2)};
`;

  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Only write if content actually changed to avoid triggering unnecessary rebuilds
  if (fs.existsSync(OUTPUT_FILE)) {
    const existing = fs.readFileSync(OUTPUT_FILE, "utf-8");
    if (existing === content) return;
  }

  fs.writeFileSync(OUTPUT_FILE, content, "utf-8");
  console.log(`[Audio Sync] Updated playlist with ${tracks.length} tracks.`);
}

// Run directly if invoked from CLI
syncAudioPlaylist();
