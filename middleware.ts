import { NextResponse, NextRequest } from 'next/server';
import * as jose from "jose";
import createMiddleware from 'next-intl/middleware';

export async function middleware(request: NextRequest) {
  console.log("Middleware called");


  const intlMiddleware = createMiddleware({
    locales: ['en', 'uk'],
    defaultLocale: 'en'
  });


  let intlResponse = intlMiddleware(request);
  console.log("Localization middleware applied");

  const jwt = request.nextUrl.searchParams.get('token') || request.cookies.get("Authorization")?.value || '';
  console.log("JWT:", jwt);
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);


  const isAdminPath = request.nextUrl.pathname.startsWith('/uk/admin') || request.nextUrl.pathname.startsWith('/en/admin');
  const isCabinetPath = request.nextUrl.pathname.startsWith('/uk/cabinet') || request.nextUrl.pathname.startsWith('/en/cabinet');
  


  console.log(isAdminPath)
  console.log(isCabinetPath)

  if (!jwt) {
    if (isAdminPath) {
      return
    }
    if (isCabinetPath) {
      return
    }
  }

  
  try {
    const { payload } = await jose.jwtVerify(jwt, secret);
    console.log("Verified JWT with payload:", payload);
  
    if (isAdminPath && !payload.is_staff) {
      return;
    }

    if (isCabinetPath && payload.is_staff) {
      return
    }
  
  } catch (error) {
    console.error("JWT verification failed:", error);
  }



  // Если intlMiddleware возвращает NextResponse, возвращаем его
  if (intlResponse instanceof NextResponse) return intlResponse;

  // Извлекаем JWT из URL или cookies

  // Если JWT отсутствует, перенаправляем пользователя
  if (!jwt) {
    return NextResponse.redirect(new URL('/en', request.url));
  }


  try {
    const { payload } = await jose.jwtVerify(jwt, secret);
    console.log("Verified JWT with payload:", payload);

    // Проверка доступа на страницы администратора и кабинета
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
    const isCabinetPath = request.nextUrl.pathname.startsWith('/en/cabinet');
    if (payload.is_staff && isAdminPath) {
      return NextResponse.next();
    } else if (!payload.is_staff && isCabinetPath) {
      return NextResponse.next();
    }

    // Перенаправление на главную страницу, если условия не соблюдены
    return NextResponse.redirect(new URL("/", request.url));
  } catch (err) {
    console.error("Error verifying JWT:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ['/', '/(uk|en)/:path*', '/cabinet/:path*', '/admin/:path*']
};
