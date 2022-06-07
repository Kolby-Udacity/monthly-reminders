/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  webpack: (config, options) => {
    // Uses babel for generating code coverage for cypress:build
    // See: https://github.com/vercel/next.js/discussions/30174
    // TODO - Can be removed when issue is resolved to allow using istanbul with SWC for code instrumentation
    if (process.env.FRONTEND_COVERAGE) {
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: ['istanbul'],
          presets: [['next/babel', {}]],
        },
      });
    }

    return config;
  },
};
