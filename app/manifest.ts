import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Olea Social",
    short_name: "Olea Social",
    description: "Modern Eastern Mediterranean dining in Covent Garden.",
    start_url: "/",
    display: "browser",
    background_color: brand.grove,
    theme_color: brand.grove,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
