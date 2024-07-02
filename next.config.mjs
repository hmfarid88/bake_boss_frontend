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
          allowedOrigins: ['http://localhost:8080'],
        },
      },
    //   async redirects() {
    //     return [{
    //         source: '/',
    //         destination: '/login',
    //         permanent: true
    //     }]
    // }
};

export default nextConfig;
