import type { Metadata } from "next";
import { Basic, Inter } from "next/font/google";
import "./globals.css";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import SelfSessionProvider from "@/app/SelfSessionProvider";
import { Suspense } from "react";
import { Toaster } from 'sonner'
import {  MisMarcasProvider } from "@/contexts/MisMarcasContext";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PublishWhere",
  description: "App de publicación de contenido en redes sociales.",
};

// Importa dinámicamente MarcaNewTeamMember
const HeaderDynamic = dynamic(() => import('@/components/headers/AppHeader'));



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
              <HeaderDynamic />
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