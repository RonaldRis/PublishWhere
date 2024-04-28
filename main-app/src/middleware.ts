// import { cookies } from "next/headers"
// import { NextRequest, NextResponse } from "next/server"

import { NextRequest, NextResponse } from "next/server"


export const config = {

    matcher: ["/calendario/:path*", "/perfil/:path*", "/marcas/:path*", "/biblioteca/:path*", "/reportes/:path*", "/configuracion/:path*", "/publicaciones/:path*" ]
}



export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("next-auth.session-token")


    if (!sessionCookie) {
        return Response.redirect(new URL('/', request.url))
    }

    console.log("middleware.ts: nextUrl - ", request.nextUrl)
    console.log("middleware.ts: url     - ", request.url)

    return NextResponse.next()
}
