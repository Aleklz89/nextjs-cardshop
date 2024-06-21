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
  const isMaintenancePath = request.nextUrl.pathname.startsWith('/en/maintenance') || request.nextUrl.pathname.startsWith('/uk/maintenance');
  
  console.log(isAdminPath);
  console.log(isCabinetPath);
  console.log(isMaintenancePath);

  // Проверка состояния режима обслуживания из API
  const maintenanceModeResponse = await fetch(new URL('/api/status', request.url).toString());
  const { maintenanceMode } = await maintenanceModeResponse.json();
  console.log("Maintenance mode:", maintenanceMode);

  if (maintenanceMode && !isMaintenancePath && !isAdminPath) {
    const redirectUrl = request.nextUrl.locale === 'uk' ? '/uk/maintenance' : '/en/maintenance';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (!maintenanceMode && isMaintenancePath) {
    const redirectUrl = request.nextUrl.locale === 'uk' ? '/uk' : '/en';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (!jwt && request.nextUrl.pathname === '/en') {
    return intlResponse instanceof NextResponse ? intlResponse : NextResponse.next();
  }

  if (!jwt) {
    if (isAdminPath || isCabinetPath) {
      return NextResponse.redirect(new URL('/en', request.url));
    }
  }

  try {
    const { payload } = await jose.jwtVerify(jwt, secret);
    console.log("Verified JWT with payload:", payload);

    if (isAdminPath && !payload.is_staff) {
      return NextResponse.redirect(new URL('/en', request.url));
    }

    if (isCabinetPath && payload.is_staff) {
      return NextResponse.redirect(new URL('/en', request.url));
    }

  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL('/en', request.url));
  }

  if (intlResponse instanceof NextResponse) return intlResponse;

  if (!jwt) {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  try {
    const { payload } = await jose.jwtVerify(jwt, secret);
    console.log("Verified JWT with payload:", payload);

    if (payload.is_staff && isAdminPath) {
      return NextResponse.next();
    } else if (!payload.is_staff && isCabinetPath) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/en', request.url));
  } catch (err) {
    console.error("Error verifying JWT:", err);
    return NextResponse.redirect(new URL('/en', request.url));
  }
}

export const config = {
  matcher: ['/', '/(uk|en)/:path*', '/cabinet/:path*', '/admin/:path*']
};
