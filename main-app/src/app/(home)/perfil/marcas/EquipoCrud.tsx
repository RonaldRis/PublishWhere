"use client"
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { deleteTeamMembersOnMarcaAction, fetchMarcaAction, renameMarcaAction } from '@/lib/actions/marcas.actions';
import { IUser } from '@/lib/models/user.model';
import { CircleX } from 'lucide-react';
import React, { useContext } from 'react'
import { toast } from 'sonner';
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
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { MisMarcasContext } from '@/contexts/MisMarcasContext';
import MarcaNewTeamMember from '@/components/marcas/MarcaNewTeamMember';

function EquipoCrud() {

    const { marcaGlobalSeleccionada, fetchRefreshMarcas, setMarcaGlobalSeleccionada, marcas } = useContext(MisMarcasContext);
    const { data: session } = useSession();


    //Delete
    const [isOpenModalDelete, setIsOpenModalDelete] = React.useState<boolean>(false);
    const [userBorrar, setUserBorrar] = React.useState<IUser | null>(null);


    //New Team Member
    const [isOpenModalNewTeamMember, setIsOpenModalNewTeamMember] = React.useState<boolean>(false);


    function validacionesEliminarMiembro(user: IUser) {
        if (!user) {
            toast.info('No hay usuario seleccionado');
            return false;
        }
        if (user._id === (marcaGlobalSeleccionada?.admin as IUser)._id) {
            toast.info('No puedes eliminar al administrador');
            return false;
        }
        if (!marcaGlobalSeleccionada) {
            toast.info('No hay marca seleccionada');
            return false;
        }
        const adminId = (marcaGlobalSeleccionada.admin as IUser)._id;
        const isUserAdmin = adminId === session?.user.id;
        const eliminarmeAMiMismo = user._id === session?.user.id;

        if (!(!isUserAdmin && eliminarmeAMiMismo)) {
            toast.info('Unicamente el administrador puede eliminar miembros');
            return false;
        }

        return true;
    }

    //Handlers
    //DELETE
    const handlerClickOnDeleteUserBadge = (user: IUser) => {
      
        if (!validacionesEliminarMiembro(user)) return;


        setUserBorrar(user);
        setIsOpenModalDelete(true);
    }

    const handlerDeleteUseronMarca = async () => {
        //Validaciones
        if (!validacionesEliminarMiembro(userBorrar!)) return;
        

        const marcaId = marcaGlobalSeleccionada?._id;
        const result = await deleteTeamMembersOnMarcaAction(marcaId!, userBorrar?._id!);

        if (!result.isOk) {
            toast.error(result.error!);
            return;
        }
        toast.success('Usuario eliminado correctamente');

        setIsOpenModalDelete(false);
        setUserBorrar(null);


        ///Actualizo las marcas y la marca seleccionada
        await fetchRefreshMarcas();

        if (userBorrar?._id === session?.user.id) {
            setMarcaGlobalSeleccionada(null);
            return;
        }


        const marcaRenovada = await fetchMarcaAction(marcaGlobalSeleccionada?._id!);
        if (!marcaRenovada.isOk) {
            toast.error(marcaRenovada.error!);
            return;
        }
        else
            setMarcaGlobalSeleccionada(marcaRenovada.data);


    }



    return (
        <div>
            <h1 className='font-bold' >Equipo</h1>
            <h1>Admin: {(marcaGlobalSeleccionada?.admin as IUser).name}</h1>


            <Separator className='my-2' />

            <h2 className='font-bold' >Miembros</h2>

            {marcaGlobalSeleccionada && marcaGlobalSeleccionada?.equipo?.length > 0 && (

                <ul className='list-disc list-inside'>
                    {marcaGlobalSeleccionada?.equipo?.map((user: any) => {
                        const userMap = user as IUser
                        return (

                            <li key={userMap._id} className='flex items-center justify-between'>

                                <span>{userMap.name}</span>
                                <Button className='justify-end' variant='ghost' onClick={() => handlerClickOnDeleteUserBadge(user)} >

                                    <CircleX color="#e00000" />
                                </Button>
                            </li>
                        )
                    })}

                </ul>

            )}

            <Button className='w-full' variant='ghost' onClick={() => setIsOpenModalNewTeamMember(true)}>Agregar miembro</Button>





            {
                marcaGlobalSeleccionada &&
                <>

                    {/* Modal Agregar miembros nuevos al equipo */}
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



                </>

            }


        </div>
    )
}

export default EquipoCrud