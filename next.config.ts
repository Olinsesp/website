import type { NextConfig } from 'next';

const SUPABASE_URL = process.env.SUPABASE_URL;
let supabaseHostname = '';

if (SUPABASE_URL) {
  try {
    supabaseHostname = new URL(SUPABASE_URL).hostname;
  } catch (error) {
    console.error('Invalid SUPABASE_URL:', error);
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

if (supabaseHostname) {
  nextConfig.images?.remotePatterns?.push({
    protocol: 'https',
    hostname: supabaseHostname,
    port: '',
    pathname: '/**',
  });
} else {
  nextConfig.images?.remotePatterns?.push({
    protocol: 'http',
    hostname: 'localhost',
    port: '',
    pathname: '/**',
  });
}

export default nextConfig;
