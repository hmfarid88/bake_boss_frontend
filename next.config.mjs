// /** @type {import('next').NextConfig} */

// const nextConfig = {
//     images:{
//         remotePatterns:[
//             {
//                 protocol:"https",
//                 hostname:"lh3.googleusercontent.com"
//             }
//         ]
//     },
//     // experimental: {
//     //     serverActions: {
//     //       allowedOrigins: ['http://localhost:8080'],
//     //     },
//     //   },
   
// };


// const withMDX = require('@next/mdx')({
//     extension: /\.(md|mdx)$/,
//   });
//   const withImages = require('next-images');
//   require('dotenv').config({ path: `./.env.${process.env.ENVIRONMENT}` });
  
//   module.exports = withImages(
//     withMDX({
//       env: {
//         SESSION_SECRET: process.env.SESSION_SECRET,
//         NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
//       },
//       webpack(config, options) {
//         return config;
//       },
//     })
//   );
  

// export default nextConfig;


import withMDX from '@next/mdx';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.ENVIRONMENT}` });

const mdxConfig = withMDX({
  extension: /\.(md|mdx)$/,
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  env: {
    SESSION_SECRET: process.env.SESSION_SECRET,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  webpack(config, options) {
    return config;
  },
  
};

export default mdxConfig(nextConfig);

  