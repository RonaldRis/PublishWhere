
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


  request.cookies.getAll().forEach((cookie) => {
    console.log("cookie", cookie)
  } )
  
  console.log("middleware", request.url)
  //Not the best, but workst
  if (request.url.includes("publishwhere")) {
    if (!request.cookies.get("__Secure-next-auth.session-token"))
      return NextResponse.redirect(new URL('/api/auth/signin', request.url))

  }
  else if (!request.cookies.get("next-auth.session-token")) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url))
  }

  return NextResponse.next()

}

