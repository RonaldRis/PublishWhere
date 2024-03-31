"use client"
import { MisMarcasContext } from '@/contexts/MisMarcasContext';
import React, { useContext } from 'react'
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
import { IUser } from '@/lib/models/user.model';
import MarcaNewTeamMember from '@/components/marcas/MarcaNewTeamMember';
import { Button } from '@/components/ui/button';



function DetallesMarcaEditable() {

    const { marcaGlobalSeleccionada } = useContext(MisMarcasContext);
    const [isOpenModalNewTeamMember, setIsOpenModalNewTeamMember] = React.useState<boolean>(false);

    return (

        <div className='flex-grow'>
            {!marcaGlobalSeleccionada ? (
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
                            {marcaGlobalSeleccionada?.name}
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
                                    <h1>Admin: {marcaGlobalSeleccionada?.admin?.name}</h1>


                                    <Separator className='my-2' />

                                    <h2 className='font-bold' >Miembros</h2>

                                    {marcaGlobalSeleccionada?.equipo?.length > 0 && (

                                        <ul className='list-disc list-inside'>
                                            {marcaGlobalSeleccionada?.equipo?.map((user) => {
                                                user = user as IUser;
                                                return (

                                                    <li key={user._id}>
                                                        {user.name}
                                                    </li>
                                                )
                                            })}

                                        </ul>

                                    )}

                                    <Button className='w-full' variant='ghost' onClick={() => setIsOpenModalNewTeamMember(true)}>Agregar miembro</Button>


                                </TabsContent>
                            </Tabs>



                        </CardContent>
                    </ScrollArea>





                </Card>
            )}

            {
                marcaGlobalSeleccionada &&
                <MarcaNewTeamMember isOpenModalNewTeamMember={isOpenModalNewTeamMember} setIsOpenModalNewTeamMember={setIsOpenModalNewTeamMember} />

            }



        </div>

    )
}

export default DetallesMarcaEditable