
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


  // request.cookies.getAll().forEach((cookie) => {
  //   console.log("cookie", cookie)
  // })

  //Si tiene la primera es en el hosting, si es la segunda es en localhost
  if (request.cookies.get("__Secure-next-auth.session-token") || request.cookies.get("next-auth.session-token")) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/auth', request.url))

}

