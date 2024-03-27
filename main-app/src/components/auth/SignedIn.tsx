"use client"

import { useSession } from 'next-auth/react'
import React from 'react'

function SignedIn({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = useSession()

    if (session) {
        return (
            <>
                {children}
            </>
        )
    }

    return <></>
}

export default SignedIn