
// import { NextRequest, NextResponse } from 'next/server'
// import { decrypt } from '@/app/lib/auth'
// import { cookies } from 'next/headers'

// // 1. Specify protected and public routes
// const protectedRoutes = ['/dashboard', '/purchase']
// const publicRoutes = ['/']

// export default async function middleware(req: NextRequest) {
//   // 2. Check if the current route is protected or public
//   const path = req.nextUrl.pathname
//   const isProtectedRoute = protectedRoutes.includes(path)
//   const isPublicRoute = publicRoutes.includes(path)

//   // 3. Decrypt the session from the cookie
//   const cookie = cookies().get('session')?.value
//   const session = await decrypt(cookie)

//   // 5. Redirect to /login if the user is not authenticated
//   if (isProtectedRoute && !session?.username) {
//     return NextResponse.redirect(new URL('/', req.nextUrl))
//   }

//   // 6. Redirect to /dashboard if the user is authenticated
//   if (
//     isPublicRoute &&
//     session?.username &&
//     !path.startsWith('/dashboard')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
//   }

//   return NextResponse.next()
// }

// // Routes Middleware should not run on
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }

// solution 02 working

// import { NextRequest, NextResponse } from 'next/server';
// import { decrypt } from '@/app/lib/auth';
// import { cookies } from 'next/headers';

// // const adminProtectedRoutes = ['/admin-dashboard'];
// // const userProtectedRoutes = ['/dashboard'];
// const adminProtectedRoutes = [''];
// const userProtectedRoutes = [''];
// const publicRoutes = ['/'];

// export default async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;
 
//   const isAdminProtectedRoute = adminProtectedRoutes.includes(path);
//   const isUserProtectedRoute = userProtectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);

//   const cookie = cookies().get('session')?.value;

//   // Handle missing cookie
//   if (!cookie) {
//     if (isAdminProtectedRoute || isUserProtectedRoute) {
//       return NextResponse.redirect(new URL('/', req.nextUrl));
//     }
//     return NextResponse.next();
//   }

//   try {
//     const session = await decrypt(cookie);

//     // If decryption fails or userId is missing, redirect to login for protected routes
//     if ((isAdminProtectedRoute || isUserProtectedRoute) && !session?.username) {
//       return NextResponse.redirect(new URL('/', req.nextUrl));
//     }

//     if (session?.username && session?.roles) {
    
//       if (isUserProtectedRoute && session.roles !== 'ROLE_USER') {
//         return NextResponse.redirect(new URL('/', req.nextUrl));
//       }

//       if (isAdminProtectedRoute && session.roles !== 'ROLE_ADMIN') {
//         return NextResponse.redirect(new URL('/', req.nextUrl));
//       }

//       if (isPublicRoute) {
//         if (session.roles === 'ROLE_ADMIN' && !req.nextUrl.pathname.startsWith('/admin-dashboard')) {
//           return NextResponse.redirect(new URL('/admin-dashboard', req.nextUrl));
//         }
//         if (session.roles === 'ROLE_USER' && !req.nextUrl.pathname.startsWith('/dashboard')) {
//           return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error in middleware:', error);
//     // Consider adding more robust error handling here
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };

// solution 03

import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/auth';
import { cookies } from 'next/headers';

// Define the roles as a union type
type UserRole = 'ROLE_ADMIN' | 'ROLE_PRODUCTION' | 'ROLE_SALES';

// Role-based protected routes mapping
const roleRouteMap: Record<UserRole, string[]> = {
  ROLE_ADMIN: ['/admin-dashboard', '/adduser', '/updateuser'],
  ROLE_PRODUCTION: [
    '/adminstration',
    '/cashbook',
    '/damage-material',
    '/damage-product',
    '/damaged-product',
    '/damaged-material',
    '/dashboard',
    '/datewise-materials-ledger',
    '/datewise-purchase-ledger',
    '/datewise-production-materials',
    '/datewise-stock-ledger',
    '/datewise-used-materials',
    '/details-requisition',
    '/details-supplier',
    '/dp-dist',
    '/dp-dist-report',
    '/expense-report',
    '/invoice',
    '/itemlist',
    '/materials',
    '/materials-ledger',
    '/office-pay-report',
    '/office-receve-report',
    '/payment',
    '/production-stock',
    '/profit-report',
    '/purchase',
    '/purchase-ledger',
    '/receive',
    '/requisition-list',
    '/requisition-materials',
    '/retailer-pay-report',
    '/sales-returned',
    '/stock-ledger',
    '/stockreport',
    '/supplier-ledger',
    '/supplier-pay-report',
    '/used-materials',
   
  ],
  ROLE_SALES: [
    '/datewise-entry-ledger',
    '/datewise-expense-report',
    '/datewise-officepay-report',
    '/datewise-officerecev-report',
    '/datewise-salereport',
    '/datewise-salesprofit',
    '/datewise-salestock-ledger',
    '/datewise-stock-returned',
    '/datewise-supplierpay-report',
    '/datewise-vendor-sale',
    '/pending-product',
    '/pending-product-details',
    '/pending-vendor-details',
    '/product-return',
    '/sales-additional',
    '/sales-admin',
    '/sales-cashbook',
    '/sales-dashboard',
    '/sales-entry-ledger',
    '/sales-expense-report',
    '/sales-invoice',
    '/sales-officepay-report',
    '/sales-officerecev-report',
    '/sales-payment',
    '/sales-profitloss',
    '/sales-receive',
    '/sales-requisition',
    '/sales-requisition-report',
    '/sales-salereport',
    '/sales-sales-today',
    '/sales-shop',
    '/sales-stock',
    '/sales-stock-ledger',
    '/sales-stock-returned',
    '/sales-supplierpay-report',
    '/vendor-sale',
    '/vendor-sale-report',
  ],
};
const publicRoutes = ['/'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the path is public
  const isPublicRoute = publicRoutes.includes(path);

  // Find the roles that protect the current route
  const protectingRoles = (Object.keys(roleRouteMap) as UserRole[]).filter((role) =>
    roleRouteMap[role].includes(path)
  );

  const cookie = cookies().get('session')?.value;

  // If no session cookie is found and the route is protected, redirect to the home page
  if (!cookie && protectingRoles.length > 0) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  try {
    const session = await decrypt(cookie);

    // If session decryption fails or userId is missing, redirect for protected routes
    if (!session?.username && protectingRoles.length > 0) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if (session?.username && session?.roles) {
      // Check if user role matches the role protecting the route
      if (
        protectingRoles.length > 0 &&
        !protectingRoles.includes(session.roles as UserRole)
      ) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }

      // Redirect logged-in users accessing public routes to their respective dashboards
      if (isPublicRoute) {
        if (
          session.roles === 'ROLE_ADMIN' &&
          !req.nextUrl.pathname.startsWith('/admin-dashboard')
        ) {
          return NextResponse.redirect(new URL('/admin-dashboard', req.nextUrl));
        }
        if (
          session.roles === 'ROLE_PRODUCTION' &&
          !req.nextUrl.pathname.startsWith('/dashboard')
        ) {
          return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
        }
        if (
          session.roles === 'ROLE_SALES' &&
          !req.nextUrl.pathname.startsWith('/sales-dashboard')
        ) {
          return NextResponse.redirect(new URL('/sales-dashboard', req.nextUrl));
        }
      }
    }
  } catch (error) {
    console.error('Error in middleware:', error);
    // Redirect to login page or custom error page if needed
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // Allow request to continue if all checks are passed
  return NextResponse.next();
}

export const config = {
   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};




