module.exports = {
  basePath: '',
  images: {
    domains: ['noties-v2-toumani.vercel.app', 'noties-v2.vercel.app'],
  },
};


/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
})

module.exports = withPWA({
  // config
})