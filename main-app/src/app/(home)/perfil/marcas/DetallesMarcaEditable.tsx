"use client"
import { MisMarcasContext } from '@/contexts/MisMarcasContext';
import React, { use, useContext } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IUser } from '@/lib/models/user.model';
import MarcaNewTeamMember from '@/components/marcas/MarcaNewTeamMember';
import { Button } from '@/components/ui/button';
import { CircleX, Pencil } from 'lucide-react';
import { set } from 'mongoose';
import { deleteMarcaAction, deleteTeamMembersOnMarcaAction, fetchMarcaAction, renameMarcaAction } from '@/lib/actions/marcas.actions';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import EquipoCrud from './EquipoCrud';



function DetallesMarcaEditable() {

    const { marcaGlobalSeleccionada, fetchRefreshMarcas, setMarcaGlobalSeleccionada, marcas } = useContext(MisMarcasContext);
    const { data: session } = useSession();

    //Rename
    const [isOpenModalRename, setIsOpenModalRename] = React.useState<boolean>(false);
    const [newName, setNewName] = React.useState<string>('');

      //RENAME
      const handlerClickOnRenameOpenModal = () => {
        setIsOpenModalRename(true);
    }

    const handlerRenameMarcaConfirmarNuevoNombre = async () => {
        //Validaciones
        if (!marcaGlobalSeleccionada) {
            toast.info('No hay marca seleccionada');
            return;
        }

        if (newName === '') {
            toast.info('No hay nombre nuevo');
            return;
        }

        const marcaId = marcaGlobalSeleccionada._id;
        const result = await renameMarcaAction(marcaId, newName);
        if (!result.isOk) {
            toast.error(result.error!);
            return;
        }

        await fetchRefreshMarcas();
        setMarcaGlobalSeleccionada(
            {
                ...marcaGlobalSeleccionada,
                name: newName
            }
        );

        toast.success('Marca renombrada correctamente');
        setIsOpenModalRename(false);
        setNewName('');
    }



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
                        <CardTitle className='text-center flex'>

                            <span className='flex-grow flex justify-center'>
                                {marcaGlobalSeleccionada?.name}
                            </span>
                            <Button variant={"ghost"} className='relative right-0' onClick={handlerClickOnRenameOpenModal}>
                                <Pencil />
                            </Button>
                        </CardTitle>
                        <CardDescription>
                            Detalles de la marca


                        </CardDescription>

                    </CardHeader>


                    <ScrollArea className="h-full w-full">
                        <CardContent className='flex-grow'>


                            <Tabs defaultValue="equipo" className="w-full">
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
                                    <EquipoCrud/>
                                    

                                </TabsContent>
                            </Tabs>



                        </CardContent>
                    </ScrollArea>





                </Card>
            )}
            {
                marcaGlobalSeleccionada &&
                <>

                    {/* // Cambiar Nombre Dialog */}
                    <Dialog open={isOpenModalRename} onOpenChange={setIsOpenModalRename}>
                        <DialogTrigger asChild>
                            <Button className=' hidden w-full'>Cambiar nombre</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Cambiar nombre:  {marcaGlobalSeleccionada.name}</DialogTitle>
                                <DialogDescription>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <span className="text-right">
                                                Nuevo nombre
                                            </span>
                                            <Input
                                                id="marca"
                                                placeholder="Marca"
                                                className="col-span-3"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                            />
                                        </div>

                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="default" onClick={handlerRenameMarcaConfirmarNuevoNombre}>Confirmar nuevo nombre</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </>

            }



        </div>

    )
}

export default DetallesMarcaEditable