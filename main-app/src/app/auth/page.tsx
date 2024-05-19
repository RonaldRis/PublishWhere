"use client";
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

function PageAuth() {


    const {data:session} = useSession();
    const router = useRouter();

    if(session){
        router.push('/calendario');
    }

    const handlerClickLogin = () => {
        signIn("google", { callbackUrl: "/calendario" });
    }

    return (
        <div className='flex w-full h-screen bg-[#161b22] items-center justify-center'>


            <Image src="/google.png" alt="Google" width={400} height={200} className='border rounded-md cursor-pointer' onClick={handlerClickLogin} />

        </div>
    )
}

export default PageAuth