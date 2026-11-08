import { AUTO_PLAYLIST, INTRO_TRACK, SongTrack } from "@/data/playlist";
export type { SongTrack };
export { AUTO_PLAYLIST, INTRO_TRACK };

// Site-wide config — edit values here.
export const SITE = {
  name: "Edhubilli Sandeep Kumar",
  email: "edhubillisandeepkumar1234@gmail.com",
  github: "sandeep-kumar-270904",
  twitter: "",
  linkedin: "",
  resumeUrl: "/resume.pdf",
  isAvailable: true,
  availableUntil: "April 2026",
  location: "India",
  timezone: "IST (UTC+5:30)",
  languages: ["English", "Telugu", "Hindi"],
  // Spotify track to feature in the "Now Playing" widget.
  // "Tadow" — FKJ & Masego
  spotifyTrackId: "1eyekkPRDDtR0Bm0EYjvgs",
  // Multiple songs playlist — automatically synced from public/audio/!
  // Any song you drop into public/audio/ will be detected and added automatically.
  playlist: AUTO_PLAYLIST,
  introTrack: INTRO_TRACK,
  // Single song fallback for backward compatibility
  nowPlaying: AUTO_PLAYLIST[0] || {
    title: "Tadow",
    artist: "FKJ & Masego",
    audioUrl: "/audio/tadow.mp3",
  },
  socials: {
    github: "https://github.com/sandeep-kumar-270904",
    linkedin: "https://www.linkedin.com/in/edhubilli-sandeep-kumar/",
    twitter: "https://x.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    leetcode: "https://leetcode.com/",
  },
};
