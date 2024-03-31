// import { cookies } from "next/headers"
// import { NextRequest, NextResponse } from "next/server"

import { NextRequest, NextResponse } from "next/server"


export const config = {

    matcher: ["/dashboard/:path*", "/perfil/:path*", "/marcas/:path*", "/biblioteca/:path*", "/reportes/:path*", "/configuracion/:path*", "/publicaciones/:path*" ]
}



export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("next-auth.session-token")

    // console.log("\n\n\nPATHNAME", request.nextUrl.pathname)
    // console.log("COOKIE", sessionCookie)

    // Sample Object:
    // COOKIE {
    //     name: 'next-auth.session-token',
    //     value: '6fd08942-7a4c-4a3c-8a9b-8bed82f8189e'
    //   }

    if (!sessionCookie) {
        return Response.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}
