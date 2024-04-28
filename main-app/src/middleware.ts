// import { cookies } from "next/headers"
// import { NextRequest, NextResponse } from "next/server"

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

    //TODO: VALIDAR LAS PAGINAS INTERNAMENTE DENTRO DE CADA UNA SI HAY SESSIÓN O NO Y QUE LO MANDE INICIO
//   const sessionCookie = request.cookies.get("next-auth.session-token");

// //   if (!sessionCookie) {
// //     return Response.redirect(new URL("/", request.url));
// //   }

//   console.log("middleware.ts: nextUrl - ", request.nextUrl);
//   console.log("middleware.ts: url     - ", request.url);

//   // If the user is authenticated, allow the request to continue
//   const response = NextResponse.next();
//   response.headers.set("Referrer-Policy", "unsafe-url");
//   return response;

return NextResponse.next()

}
