import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import SelfSessionProvider from "@/app/SelfSessionProvider";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import BasicHeader from "@/components/headers/BasicHeader";
import { Toaster } from 'sonner'
import {  MisMarcasProvider } from "@/contexts/MisMarcasContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PublishWhere",
  description: "App de publicación de contenido en redes sociales.",
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);


  return (

    <html lang="en">
      <body className={inter.className}>
        <SelfSessionProvider session={session}>
          <MisMarcasProvider>



            <Suspense>
              <BasicHeader />
            </Suspense>
            <main className="container m-auto pt-20 h-screen ">
              <div className=" w-full h-full py-10">

                {children}

              </div>
            </main>
            <Toaster position='bottom-right' richColors />


          </MisMarcasProvider>
        </SelfSessionProvider>
      </body>
    </html>
  );
}
