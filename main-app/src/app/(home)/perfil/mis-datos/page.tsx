import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import MyData from "./MyData";

export default async function MisDatosPage() {


  return (
    <div className="container flex flex-col items-center justify-center h-4/5" >


      <Card className='w-full  '>
        <CardHeader>
          <CardTitle className='text-center'>
            Mis datos
          </CardTitle>


        </CardHeader>


        <CardContent className='flex-grow container'>


          <Suspense fallback="Cargando datos... ">
            <MyData />
          </Suspense>

        </CardContent>


      </Card>


    </div>
  )
}
