import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import createMiddleware from 'next-intl/middleware';

export async function middleware(request: NextRequest) {
  console.log("Middleware called");

  const intlMiddleware = createMiddleware({
    locales: ['en', 'uk'],
    defaultLocale: 'en'
  });

  const intlResponse = intlMiddleware(request);
  console.log("Localization middleware applied");

  const jwt = request.nextUrl.searchParams.get('token') || request.cookies.get("Authorization")?.value || '';
  console.log("JWT:", jwt);
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const isAdminPath = request.nextUrl.pathname.startsWith('/uk/admin') || request.nextUrl.pathname.startsWith('/en/admin');
  const isCabinetPath = request.nextUrl.pathname.startsWith('/uk/cabinet') || request.nextUrl.pathname.startsWith('/en/cabinet');
  const isMaintenancePath = request.nextUrl.pathname.startsWith('/en/tech/maintenance') || request.nextUrl.pathname.startsWith('/uk/tech/maintenance');
  const isMainPath = request.nextUrl.pathname.startsWith('/en') || request.nextUrl.pathname.startsWith('/uk');
  
  console.log(isAdminPath);
  console.log(isCabinetPath);
  console.log(isMaintenancePath);

  // Проверка состояния режима обслуживания из API
  const maintenanceModeResponse = await fetch(new URL('/api/status', request.url).toString());
  const { maintenanceMode } = await maintenanceModeResponse.json();
  console.log("Maintenance mode:", maintenanceMode);

  // if (maintenanceMode) {
  //   if (isAdminPath) {
  //     console.log("Admin path accessed during maintenance mode");
  //   } else if (!isMaintenancePath) {
  //     console.log("Redirecting to maintenance page");
  //     const redirectUrl = request.nextUrl.locale === 'uk' ? '/uk/tech/maintenance' : '/en/tech/maintenance';
  //     return NextResponse.redirect(new URL(redirectUrl, request.url));
  //   }
  // }

  // if (!maintenanceMode && isMaintenancePath) {
  //   console.log("Redirecting to main page from maintenance");
  //   const redirectUrl = request.nextUrl.locale === 'uk' ? '/uk' : '/en';
  //   return NextResponse.redirect(new URL(redirectUrl, request.url));
  // }

  if (!jwt && isMainPath) {
    console.log("No JWT for main path");
    return intlResponse instanceof NextResponse ? intlResponse : NextResponse.next();
  }

  if (!jwt) {
    if (isAdminPath || isCabinetPath) {
      console.log("No JWT for admin or cabinet path, redirecting");
      return NextResponse.redirect(new URL('/en', request.url));
    }
  }

  try {
    const { payload } = await jose.jwtVerify(jwt, secret);
    console.log("Verified JWT with payload:", payload);

    if (isAdminPath && !payload.is_staff) {
      console.log("User is not staff, redirecting from admin path");
      return NextResponse.redirect(new URL('/en', request.url));
    }

    if (isCabinetPath && payload.is_staff) {
      console.log("Staff user trying to access cabinet path, redirecting");
      return NextResponse.redirect(new URL('/en', request.url));
    }

  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL('/en', request.url));
  }

  if (intlResponse instanceof NextResponse) return intlResponse;

  if (!jwt) {
    console.log("No JWT, redirecting to main page");
    return NextResponse.redirect(new URL('/en', request.url));
  }

  try {
    const { payload } = await jose.jwtVerify(jwt, secret);
    console.log("Verified JWT with payload:", payload);

    if (payload.is_staff && isAdminPath) {
      console.log("Staff user accessing admin path");
      return NextResponse.next();
    } else if (!payload.is_staff && isCabinetPath) {
      console.log("Non-staff user accessing cabinet path");
      return NextResponse.next();
    }

    console.log("Redirecting to main page");
    return NextResponse.redirect(new URL('/en', request.url));
  } catch (err) {
    console.error("Error verifying JWT:", err);
    return NextResponse.redirect(new URL('/en', request.url));
  }
}

export const config = {
  matcher: ['/', '/(uk|en)/:path*', '/cabinet/:path*', '/admin/:path*']
};
