import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Horus Dashboard",
    short_name: "Horus",
    description: "Hacker help, made simple.",
    start_url: "/",
    display: "standalone",
    background_color: "#070e0b",
    theme_color: "#070e0b",
    icons: [
      {
        src: "/Horus_R_192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Horus_R_512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
