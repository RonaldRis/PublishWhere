
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/calendario/:path*",
    "/perfil/:path*",
    "/marcas/:path*",
    "/biblioteca/:path*",
    "/reportes/:path*",
    "/configuracion/:path*",
    "/publicaciones/:path*",
  ],
};

export async function middleware(request: NextRequest) {

  //Not the best, but workst
  if (!request.cookies.get("next-auth.session-token")) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url))
  }

  return NextResponse.next()

}

