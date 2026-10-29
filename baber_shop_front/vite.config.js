
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        id: "/",
        name: "Barber Shop",
        short_name: "Barber Shop",
        description:
          "Découvrez les salons de coiffure et suivez votre position dans la file d'attente.",
        lang: "fr",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#16794b",
        background_color: "#ffffff",

        // Icône SVG existante : nous vérifierons ensuite
        // les icônes adaptées à l'installation Android.
       icons: [
  {
    src: "/icons/icon-192.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icons/icon-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "any",
  },
],
      },

      workbox: {
        navigateFallback: "/index.html",
        globPatterns: [
          "**/*.{js,css,html,svg,ico,png,webp,woff2}",
        ],
      },
    }),
  ],
});
