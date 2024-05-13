import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import * as jose from "jose";
import createMiddleware from 'next-intl/middleware';

// Объединённый async middleware
export async function middleware(request: NextRequest) {
  const intlMiddleware = createMiddleware({
    locales: ['en', 'uk'],
    defaultLocale: 'en'
  });

  // Вызов middleware для интернационализации
  const response = intlMiddleware(request);
  if (response) return response;

  // Обработка JWT
  const cookieToken = cookies().get("Authorization")?.value || '';
  const urlToken = request.nextUrl.searchParams.get('token') || '';
  const jwt = urlToken || cookieToken;
  
  if (!jwt) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const { payload } = await jose.jwtVerify(jwt, secret);
    console.log("Verified JWT with payload:", payload);

    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
    const isCabinetPath = request.nextUrl.pathname.startsWith('/cabinet');

    if (payload.is_staff) {
      if (isAdminPath) {
        return NextResponse.rewrite(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    if (!payload.is_staff && isCabinetPath) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch(err) {
    console.error("Error verifying JWT:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  // Матчеры для обоих видов маршрутов
  matcher: ['/', '/(uk|en)/:path*', '/cabinet/:path*', '/admin/:path*']
};
