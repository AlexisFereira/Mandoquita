/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return ["audio", "computing", "home-living"].map((slug) => ({
      source: `/categorias/${slug}`,
      destination: "/categorias",
      permanent: true,
    }));
  },
};

module.exports = nextConfig;
