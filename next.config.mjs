import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.resolve.alias['@codemirror/state'] = path.resolve(__dirname, 'node_modules/@codemirror/state');
        return config;
      },
      reactStrictMode: true,
      poweredByHeader: false,
};

export default nextConfig;
