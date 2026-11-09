/* CHARACTER ART (WebP files in public/art/, converted from design/characters/*.png with sharp,
   quality 88, alpha kept, resize only).
   To swap one: drop a new .webp into public/art/ and change its path here.
   Set a slot to null (or leave the file out) and that spot simply stays empty.

   Blue Lock characters are copyrighted by their owners; this is a personal, non-commercial fan tribute. */
export const art = {
  intel: "/art/intel.webp",                 // green #13, crouching: "Skills" on the pitch (top left) + 02 Intel
  fieldwork: "/art/fieldwork.webp",         // white hair #11, sitting with the ball: "Project" on the pitch (top right) + 03 Field Work
  profile: "/art/profile-runner.webp",      // #10 running: "Achievements" on the pitch (bottom left) + beside the Track Record in 01 Profile
  achievements: "/art/achievements.webp",   // close-up portrait: 04 Achievements banner
  contact: "/art/contact.webp",             // red hair, sprinting: "Contact" on the pitch (bottom right) + 05 Contact
  photo: "/halima.webp",                    // Halima: only inside the location pin in 01 Profile
  // home pitch only
  homeProfile: "/art/home-profile.webp",    // #11 sprinting towards you: "Profile" in the centre of the pitch
  pitch: "/art/pitch.webp",                 // the neon pitch slab (from Isometric_Neon_Football_Pitch.png, trimmed, alpha kept)
};
