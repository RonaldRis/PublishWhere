"use client";
import MarcaSeleccionadaBuscador from '@/components/marcas/MarcaSeleccionadaBuscador';
import { fetchAllMarcas, fetchMisMarcas } from '@/lib/actions/marcas.actions';
import { IMarca } from '@/lib/models/marca.model';
import React, { use, useContext, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MisMarcasContext } from '@/contexts/MisMarcasContext';
import { IUser } from '@/lib/models/user.model';


function PerfilMarcasPage() {

  const { marcas, setMarcas } = useContext(MisMarcasContext);

  const [marcaSeleccionadaId, setMarcaSeleccionadaId] = React.useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = React.useState<IMarca | null>(null);



  //Encuentro el objeto de la marca por su id (busco por id porque podría cambiar el nombre)
  useEffect(() => {
    if (marcaSeleccionadaId) {
      const marca = marcas.find(marca => marca._id === marcaSeleccionadaId);
      if (marca) {
        setMarcaSeleccionada(marca);
      }
    } else {
      setMarcaSeleccionada(null);
    }

  }, [marcaSeleccionadaId, marcas]);




  return (
    <div className='flex gap-2 w-full h-full '>
      {/* Sidebar */}
      <div className='w-400px h-full'>

        <MarcaSeleccionadaBuscador
          hasNewBotton={true}
          marcaSeleccionadaId={marcaSeleccionadaId} setMarcaSeleccionadaId={setMarcaSeleccionadaId}
        />
      </div>

      {/* Datos de la marca  */}
      <div className='flex-grow'>
        {!marcaSeleccionada ? (
          <Card className='w-full h-full'>
            <CardHeader>
              <CardTitle className='text-center'>
                Selecciona una marca
              </CardTitle>
            </CardHeader>
          </Card>

        ) : (

          <Card className='w-full h-full flex flex-col'>
            <CardHeader>
              <CardTitle className='text-center'>
                {marcaSeleccionada?.name}
              </CardTitle>
              <CardDescription>Detalles de la marca</CardDescription>

            </CardHeader>


            <ScrollArea className="h-full w-full">
              <CardContent className='flex-grow'>


                <Tabs defaultValue="redes" className="w-full">
                  <TabsList className='w-full'>
                    <TabsTrigger className='w-full' value="redes">Redes sociales</TabsTrigger>
                    <TabsTrigger className='w-full' value="equipo">Equipo</TabsTrigger>
                  </TabsList>
                  <TabsContent value="redes">
                    <h1 className='font-bold' >Redes sociales</h1>


                    <ol className="list-disc list-inside ">
                      <li key="insta">Instagram</li>
                      <li key="Face">Facebook</li>
                      <li key="X">Twitter</li>


                    </ol>
                  </TabsContent>
                  <TabsContent value="equipo">
                    <h1 className='font-bold' >Equipo</h1>
                    <h1>Admin: {marcaSeleccionada.admin.name}</h1>


                    <Separator className='my-2' />

                    <h2 className='font-bold' >Miembros</h2>

                    {marcaSeleccionada?.equipo?.length > 0 && (

                      <ul className='list-disc list-inside'>
                        {marcaSeleccionada?.equipo.map((user) => {
                          user = user as IUser;
                          return (

                            <li key={user._id}>
                              {user.name}
                            </li>
                          )
                        })}

                      </ul>

                    )}


                  </TabsContent>
                </Tabs>



              </CardContent>
            </ScrollArea>





          </Card>
        )}

      </div>

    </div>
  )
}




export default PerfilMarcasPage;
