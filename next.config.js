/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    return ["audio", "computing", "home-living"].map((slug) => ({
      source: `/categorias/${slug}`,
      destination: "/categorias",
      permanent: true,
    }));
  },
};

module.exports = nextConfig;
