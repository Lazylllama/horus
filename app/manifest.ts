import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nephthys Dashboard",
    short_name: "Nephthys",
    description: "keep track of your tickets",
    start_url: "/",
    display: "standalone",
    background_color: "#070e0b",
    theme_color: "#070e0b",
    icons: [
      {
        src: "/Nephthys_192x192_R.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Nephthys_512x512_R.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
