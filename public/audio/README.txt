Place your MP3 files in this folder (public/audio/).

Existing:
- tadow.mp3

To add more songs:
1. Drop your .mp3 files here (e.g., song2.mp3, chill.mp3).
2. Open src/config.ts and add them to the SITE.playlist array:
   {
     title: "Song Name",
     artist: "Artist Name",
     audioUrl: "/audio/song2.mp3",
   }
3. The "Now Playing" player will automatically include them and allow skipping between tracks!
