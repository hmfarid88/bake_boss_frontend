/** @type {import('next').NextConfig} */

const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:"https",
                hostname:"lh3.googleusercontent.com"
            }
        ]
    },
    experimental: {
        serverActions: {
          allowedOrigins: ['http://localhost:8080/bake_boss_backend'],
        },
      },

};



// import withMDX from '@next/mdx';
// import dotenv from 'dotenv';

// dotenv.config({ path: `./.env.${process.env.ENVIRONMENT}` });

// const mdxConfig = withMDX({
//   extension: /\.(md|mdx)$/,
// });

// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com',
//       },
//     ],
//   },
//   env: {
//     SESSION_SECRET: process.env.SESSION_SECRET,
//     NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   },
//   webpack(config, options) {
//     return config;
//   },

// };

// export default mdxConfig(nextConfig);
// import dotenv from 'dotenv';
// dotenv.config({
//     path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
// });

// const allowedOrigins =
//     process.env.NODE_ENV === 'production'
//         ? ['http://64.227.161.25/bake_boss_backend']
//         : ['http://localhost:8080'];

// const nextConfig = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: "https",
//                 hostname: "lh3.googleusercontent.com"
//             }
//         ]
//     },
//     experimental: {
//         serverActions: {
//             allowedOrigins
//         }
//     }
// };

// export default nextConfig;
