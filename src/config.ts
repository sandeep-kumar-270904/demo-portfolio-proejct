// Site-wide config — edit values here.
export interface SongTrack {
  title: string;
  artist: string;
  audioUrl: string;
}

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
  // Multiple songs playlist — add as many songs as you want!
  // To add a new song:
  // 1. Put the audio file into public/audio/
  // 2. Add an entry to this playlist array below:
  playlist: [
    {
      title: "Tadow",
      artist: "FKJ & Masego",
      audioUrl: "/audio/tadow.mp3",
    },
    {
      title: "Jawan Title Track",
      artist: "Anirudh & Raja Kumari",
      audioUrl: "/audio/jawan.m4a",
    },
  ] as SongTrack[],
  // Single song fallback for backward compatibility
  nowPlaying: {
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
