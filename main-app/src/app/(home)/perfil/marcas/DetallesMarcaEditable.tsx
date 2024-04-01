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
import { deleteMarca, deleteTeamMembersOnMarca, fetchMarca, renameMarca } from '@/lib/actions/marcas.actions';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';



function DetallesMarcaEditable() {

    const { marcaGlobalSeleccionada, fetchRefreshMarcas, setMarcaGlobalSeleccionada, marcas } = useContext(MisMarcasContext);
    const { data: session } = useSession();

    //Delete
    const [isOpenModalDelete, setIsOpenModalDelete] = React.useState<boolean>(false);
    const [userBorrar, setUserBorrar] = React.useState<IUser | null>(null);

    //Rename
    const [isOpenModalRename, setIsOpenModalRename] = React.useState<boolean>(false);
    const [newName, setNewName] = React.useState<string>('');

    //New Team Member
    const [isOpenModalNewTeamMember, setIsOpenModalNewTeamMember] = React.useState<boolean>(false);


    //Handlers
    //DELETE
    const handlerClickOnDeleteUserBadge = (user: IUser) => {
        if (!user) {
            toast.info('No hay usuario seleccionado');
            return;
        }
        if (user._id === marcaGlobalSeleccionada?.admin?._id) {
            toast.info('No puedes eliminar al administrador');
            return;
        }

        setUserBorrar(user);
        setIsOpenModalDelete(true);
    }

    const handlerDeleteUseronMarca = async () => {
        //Validaciones
        if (!userBorrar) {
            toast.info('No hay usuario seleccionado');
            return;
        }
        if (!marcaGlobalSeleccionada) {
            toast.info('No hay marca seleccionada');
            return;
        }


        const marcaId = marcaGlobalSeleccionada._id;
        const result = await deleteTeamMembersOnMarca(marcaId, userBorrar._id);

        if (!result.isOk) {
            toast.error(result.error!);
            return;
        }
        toast.success('Usuario eliminado correctamente');

        setIsOpenModalDelete(false);
        setUserBorrar(null);


        ///Actualizo las marcas y la marca seleccionada
        await fetchRefreshMarcas();

        if (userBorrar._id === session?.user.id) {
            setMarcaGlobalSeleccionada(null);
            return;
        }


        const marcaRenovada = await fetchMarca(marcaGlobalSeleccionada._id);
        if (!marcaRenovada.isOk) {
            toast.error(marcaRenovada.error!);
            return;
        }
        else
            setMarcaGlobalSeleccionada(marcaRenovada.result);


    }

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
        const result = await renameMarca(marcaId, newName);
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
                                    <h1 className='font-bold' >Equipo</h1>
                                    <h1>Admin: {marcaGlobalSeleccionada?.admin?.name}</h1>


                                    <Separator className='my-2' />

                                    <h2 className='font-bold' >Miembros</h2>

                                    {marcaGlobalSeleccionada?.equipo?.length > 0 && (

                                        <ul className='list-disc list-inside'>
                                            {marcaGlobalSeleccionada?.equipo?.map((user) => {
                                                user = user as IUser;
                                                return (

                                                    <li key={user._id} className='flex items-center justify-between'>

                                                        <span>{user.name}</span>
                                                        <Button className='justify-end' variant='ghost' onClick={() => handlerClickOnDeleteUserBadge(user)} >

                                                            <CircleX color="#e00000" />
                                                        </Button>
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
                <>
                    <MarcaNewTeamMember isOpenModalNewTeamMember={isOpenModalNewTeamMember} setIsOpenModalNewTeamMember={setIsOpenModalNewTeamMember} />

                    {/* // ConfirmarDelete Dialog */}
                    <Dialog open={isOpenModalDelete} onOpenChange={setIsOpenModalDelete}>
                        <DialogTrigger asChild>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Eliminar usuario:  <span>{userBorrar?.name}</span></DialogTitle>
                                <DialogDescription>
                                    ¿Estás seguro de que deseas eliminarlo del equipo - {marcaGlobalSeleccionada.name}?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="destructive" onClick={handlerDeleteUseronMarca}>Eliminar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


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