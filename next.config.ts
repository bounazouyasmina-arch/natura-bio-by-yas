import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Évite que le téléphone affiche une vieille version des offres après un changement de texte
  async headers() {
    return [
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/espace",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
