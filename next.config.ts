import type {NextConfig} from 'next';
import {PHASE_DEVELOPMENT_SERVER} from 'next/constants';
import fs from 'fs';
import path from 'path';

interface SlugRedirectEntry {
  source: string;
  destination: string;
  permanent: boolean;
}

function loadSlugRedirects(): Array<{ source: string; destination: string; statusCode: 301 }> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'slug-redirects.json');
    if (!fs.existsSync(filePath)) return [];
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as SlugRedirectEntry[];
    return parsed.map((r) => ({
      source: r.source,
      destination: r.destination,
      statusCode: 301 as const,
    }));
  } catch {
    return [];
  }
}

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isGithubPages = process.env.GITHUB_PAGES === 'true';
  const isVercel = process.env.VERCEL === '1';

  const baseConfig: NextConfig = {
    distDir: isGithubPages ? 'out' : isDev ? '.next/dev' : '.next',
    ...(isGithubPages
      ? { output: 'export' }
      : isVercel
      ? {}
      : { output: 'standalone', deploymentId: 'ucg-v3' }),
    cleanDistDir: isGithubPages,
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
      ...(isGithubPages ? { unoptimized: true } : {}),
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
    transpilePackages: ['motion'],
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

  if (isGithubPages) {
    return baseConfig;
  }

  return {
    ...baseConfig,
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
    const slugRedirects = loadSlugRedirects();
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
      // 0b. Slug redirects, merged thin hubs (/radiation, /digital-image-resolution, /concentration-molar, /fuel-consumption -> /specialty), duplicate losers, and exponent-loss fixes
      ...slugRedirects,
      // 0c. Any remaining /conversions/:category -> /:category
      {
        source: '/conversions/:category/:slug',
        destination: '/:category/:slug',
        statusCode: 301,
      },
      {
        source: '/conversions/:category',
        destination: '/:category',
        statusCode: 301,
      },
      // 1. PPM in /density -> /concentration-solution or /density
      {
        source: '/density/ppm-to-mg-per-liter',
        destination: '/concentration-solution/ppm-to-mg-per-liter',
        statusCode: 301,
      },
      {
        source: '/density/mg-per-liter-to-ppm',
        destination: '/concentration-solution/mg-per-liter-to-ppm',
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
  };
};

export default nextConfig;

