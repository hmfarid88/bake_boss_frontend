
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

import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/auth';
import { cookies } from 'next/headers';

// const adminProtectedRoutes = ['/admin-dashboard'];
// const userProtectedRoutes = ['/dashboard'];
const adminProtectedRoutes = [''];
const userProtectedRoutes = [''];
const publicRoutes = ['/'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
 
  const isAdminProtectedRoute = adminProtectedRoutes.includes(path);
  const isUserProtectedRoute = userProtectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = cookies().get('session')?.value;

  // Handle missing cookie
  if (!cookie) {
    if (isAdminProtectedRoute || isUserProtectedRoute) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    return NextResponse.next();
  }

  try {
    const session = await decrypt(cookie);

    // If decryption fails or userId is missing, redirect to login for protected routes
    if ((isAdminProtectedRoute || isUserProtectedRoute) && !session?.username) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if (session?.username && session?.roles) {
    
      if (isUserProtectedRoute && session.roles !== 'ROLE_USER') {
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }

      if (isAdminProtectedRoute && session.roles !== 'ROLE_ADMIN') {
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }

      if (isPublicRoute) {
        if (session.roles === 'ROLE_ADMIN' && !req.nextUrl.pathname.startsWith('/admin-dashboard')) {
          return NextResponse.redirect(new URL('/admin-dashboard', req.nextUrl));
        }
        if (session.roles === 'ROLE_USER' && !req.nextUrl.pathname.startsWith('/dashboard')) {
          return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
        }
      }
    }
  } catch (error) {
    console.error('Error in middleware:', error);
    // Consider adding more robust error handling here
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};





