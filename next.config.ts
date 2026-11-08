import type {NextConfig} from 'next';
import {PHASE_DEVELOPMENT_SERVER} from 'next/constants';

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
  distDir: isDev ? '.next/dev' : '.next',
  deploymentId: 'ucg-v3',
  cleanDistDir: false,
  reactStrictMode: true,
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  htmlLimitedBots: /.*/,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  async headers() {
    const queryKeys = ['q', 'search', 'filter', 'value', 'from', 'to', 'category', 'page', 'sort'];
    const noindexRules = queryKeys.map((key) => ({
      source: '/((?!_next/|api/|favicon|icon|logo|apple-touch-icon|manifest).*)',
      has: [{ type: 'query' as const, key }],
      missing: [{ type: 'query' as const, key: 'url' }],
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, follow',
        },
      ],
    }));

    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isDev
              ? 'no-store, no-cache, must-revalidate'
              : 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
      {
        source: '/:file(.*\\.(?:webp|png|ico|svg))',
        headers: [
          {
            key: 'Cache-Control',
            value: isDev
              ? 'public, max-age=3600'
              : 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
      ...noindexRules,
    ];
  },
  async redirects() {
    return [
      // 0. Canonicalize www.unitconvertersgo.com to https://unitconvertersgo.com
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.unitconvertersgo.com',
          },
        ],
        destination: 'https://unitconvertersgo.com/:path*',
        statusCode: 301,
      },
      // 1. PPM in /density -> /concentration-solution or /density
      {
        source: '/density/ppm-to-mg-per-liter',
        destination: '/concentration-solution',
        statusCode: 301,
      },
      {
        source: '/density/mg-per-liter-to-ppm',
        destination: '/concentration-solution',
        statusCode: 301,
      },
      {
        source: '/density/ppm-to-:unit',
        destination: '/density',
        statusCode: 301,
      },
      {
        source: '/density/:unit-to-ppm',
        destination: '/density',
        statusCode: 301,
      },
      // 2. Mass ↔ Calories & Volume ↔ Calories -> /energy/calories-to-joules, /weight-and-mass, or /volume
      {
        source: '/weight-and-mass/:unit(kilograms|grams|pounds|ounces|kg|g|lb|lbs|oz)-to-calories',
        destination: '/energy/calories-to-joules',
        statusCode: 301,
      },
      {
        source: '/weight-and-mass/calories-to-:unit(kilograms|grams|pounds|ounces|kg|g|lb|lbs|oz)',
        destination: '/energy/calories-to-joules',
        statusCode: 301,
      },
      {
        source: '/weight-and-mass/:unit-to-calories',
        destination: '/weight-and-mass',
        statusCode: 301,
      },
      {
        source: '/weight-and-mass/calories-to-:unit',
        destination: '/energy',
        statusCode: 301,
      },
      {
        source: '/volume/:unit-to-calories',
        destination: '/volume',
        statusCode: 301,
      },
      // 3. Culinary Mass ↔ Volume -> /cooking (density-aware ingredient converter)
      {
        source: '/weight-and-mass/:mass(grams|kilograms|ounces|pounds|g|kg|oz|lb|lbs)-to-:vol(teaspoons|tablespoons|fluid-ounces|cups|pints|quarts|gallons|milliliters|liters|tsp|tbsp|fl-oz|cup|pt|qt|gal|ml|l)',
        destination: '/cooking',
        statusCode: 301,
      },
      {
        source: '/volume/:vol(teaspoons|tablespoons|fluid-ounces|cups|pints|quarts|gallons|milliliters|liters|tsp|tbsp|fl-oz|cup|pt|qt|gal|ml|l)-to-:mass(grams|kilograms|ounces|pounds|g|kg|oz|lb|lbs)',
        destination: '/cooking',
        statusCode: 301,
      },
      // 4. Industrial / Non-culinary Mass ↔ Volume -> /weight-and-mass or /volume
      {
        source: '/weight-and-mass/:mass(milligrams|micrograms|tons|metric-tons|long-tons|carats|mg|mcg|ct)-to-:vol(teaspoons|tablespoons|fluid-ounces|cups|pints|quarts|gallons|milliliters|liters|tsp|tbsp|fl-oz|cup|pt|qt|gal|ml|l)',
        destination: '/weight-and-mass',
        statusCode: 301,
      },
      {
        source: '/volume/:vol(teaspoons|tablespoons|fluid-ounces|cups|pints|quarts|gallons|milliliters|liters|tsp|tbsp|fl-oz|cup|pt|qt|gal|ml|l)-to-:mass(milligrams|micrograms|tons|metric-tons|long-tons|carats|mg|mcg|ct)',
        destination: '/volume',
        statusCode: 301,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/sitemap-:name.xml',
          destination: '/api/sitemaps/:name',
        },
      ],
    };
  },
  webpack: (config, {dev, isServer}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '../build/polyfills/polyfill-module': false,
        'next/dist/build/polyfills/polyfill-module': false,
      };
    }
    return config;
  },
  };
};

export default nextConfig;

