import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === 'production' ? '/Society-Technology' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Society-Technology/' : '',
};

export default nextConfig;
