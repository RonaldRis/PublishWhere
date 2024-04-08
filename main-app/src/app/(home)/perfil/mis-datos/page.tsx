import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import MyData from "./MyData";

export default async function MisDatosPage() {


  return (
    <div className="" >


      <Card className='w-full h-full flex flex-col'>
        <CardHeader>
          <CardTitle className='text-center'>
            Mis datos
          </CardTitle>


        </CardHeader>


        <CardContent className='flex-grow'>


          <Suspense fallback="Cargando datos... ">
            <MyData />
          </Suspense>

        </CardContent>


      </Card>


    </div>
  )
}
