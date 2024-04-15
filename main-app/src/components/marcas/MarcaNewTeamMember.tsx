"use client"
import React, { use, useCallback, useContext, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { IMarca } from '@/lib/models/marca.model';
import { ScrollArea } from '../ui/scroll-area';
import { IUser } from '@/lib/models/user.model';
import { fetchAllUserAction } from '@/lib/actions/users.actions';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { fetchMarcaAction, postNewTeamMembersOnMarcaAction } from '@/lib/actions/marcas.actions';
import { MisMarcasContext } from '@/contexts/MisMarcasContext';

function MarcaNewTeamMember({ isOpenModalNewTeamMember, setIsOpenModalNewTeamMember }: { isOpenModalNewTeamMember: boolean, setIsOpenModalNewTeamMember: React.Dispatch<React.SetStateAction<boolean>> }) {

    
    //Global
    const { data: session } = useSession();
    const { fetchRefreshMarcas, marcaGlobalSeleccionada, setMarcaGlobalSeleccionada, marcas } = useContext(MisMarcasContext);

    ///USUARIOS
    const [usuarios, setUsuarios] = React.useState<IUser[]>([])
    const [isLoadingUsers, setIsLoadingUser] = React.useState(false)
    const [usersFiltro, setUsersFiltro] = React.useState<IUser[]>([])
    const [usersSeleccionados, setUsersSeleccionados] = React.useState<IUser[]>([])


    //HTML
    const [inputText, setInputText] = React.useState<string>("");



    //First load
    useEffect(() => {

        const fetchData = async (idPropio: String) => {

            setInputText('')

            setIsLoadingUser(true)
            if (!marcaGlobalSeleccionada) return;

            const res = await fetchAllUserAction();
            const allUsersNotInTheMarcaTeam = res.data!.filter(user => {
                if (marcaGlobalSeleccionada.equipo.length > 0) {
                    if (typeof marcaGlobalSeleccionada.equipo[0] === 'string') {
                        // If marcaSeleccionada.equipo is string[], use user._id
                        return !(marcaGlobalSeleccionada.equipo as string[]).includes(user._id);
                    } else {
                        // If marcaSeleccionada.equipo is IUser[], use user._id.toString()
                        return !(marcaGlobalSeleccionada.equipo as IUser[]).map(u => u._id).includes(user._id);
                    }
                }
                return false;
            });

            setUsuarios(allUsersNotInTheMarcaTeam);
            setUsersFiltro(allUsersNotInTheMarcaTeam);
            setUsersSeleccionados([])
            setIsLoadingUser(false)

        }
        fetchData(session?.user.id!);
    }, [session, marcaGlobalSeleccionada]);

    //SI CAMBIA DE MARCA, DEBO LIMPIAR LOS USUARIOS SELECCIONADOS
    useEffect(() => {
        setUsersSeleccionados([])
    }, [marcaGlobalSeleccionada])



    useEffect(() => {
        if (!inputText || inputText === '') return setUsersFiltro(usuarios)
        const nuevosUsuariosFiltrados = usuarios.filter(user =>
            user.name.toLowerCase().includes(inputText.toLowerCase())
            || user.email.toLowerCase().includes(inputText.toLowerCase())
        );
        setUsersFiltro(nuevosUsuariosFiltrados)
    }, [inputText, usuarios, usersSeleccionados]);


    const handlerOnTextChange = (event: any) => {
        setInputText(event.target.value);
    }

    const handlerUserFiltradoClick = (userId: string) => {
        const user = usuarios.find(user => user._id === userId);
        if (!user) return;
        setUsersSeleccionados([...usersSeleccionados, user]);
    }

    const hanlderBadgeOnClick = (userId: string) => {
        //Quito el usuario de los seleccionados
        const user = usersSeleccionados.find(user => user._id === userId);
        if (!user) return;
        setUsersSeleccionados(usersSeleccionados.filter(user => user._id !== userId));
    }

    const handlerGuardarNewTeamMembers = async () => {

        if (usersSeleccionados.length <= 0) {
            toast.info('Debes seleccionar al menos un usuario');
            return;
        }

        if (!session) {
            toast.error('No hay sesión activa');
            return;
        };

        if (!marcaGlobalSeleccionada) {
            toast.error('No hay marca seleccionada');
            return;
        }

        const idSeleccionados = usersSeleccionados.map(user => user._id);
        const marcaId = marcaGlobalSeleccionada._id;
        const result = await postNewTeamMembersOnMarcaAction(marcaId, idSeleccionados);

        if (!result.isOk) {
            toast.error(result.message!);
            return;
        }


        await fetchRefreshMarcas();

        
        setIsOpenModalNewTeamMember(false);
        setUsersSeleccionados([])
        setInputText("")
        
        toast.success('Equipo actualizado correctamente');
        setMarcaGlobalSeleccionada(result.data!);
    }






    return (

        <Dialog open={isOpenModalNewTeamMember} onOpenChange={setIsOpenModalNewTeamMember}
        >
            <DialogTrigger asChild>
                <Button className=' hidden w-full' onClick={() => setIsOpenModalNewTeamMember(!isOpenModalNewTeamMember)}>Nueva marca</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Agregar miembros al equipo: {marcaGlobalSeleccionada?.name}</DialogTitle>
                    <DialogDescription>
                        Selecciona a las personas que quieras agregar
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right">
                            Buscar a:
                        </span>
                        <Input
                            id="text"
                            placeholder="Nombre o correo a buscar..."
                            className="col-span-3"
                            value={inputText}
                            onChange={handlerOnTextChange}
                        />


                    </div>
                    <Separator className='my-2' />

                    <ScrollArea className='h-60'>


                        {
                            isLoadingUsers ?
                                <p>Cargando...</p>
                                :

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="text-right">
                                        Miembros disponibles
                                    </span>
                                    <div className="col-span-3">
                                        <ul className='list-disc list-inside'>
                                            {
                                                usersFiltro?.length === 0 ?
                                                    <li>No hay más usuarios disponibles</li>
                                                    :
                                                    usersFiltro?.map((user, index) =>

                                                        usersSeleccionados.includes(user) ? null : //Valido que no este en la otra lista
                                                            (
                                                                <div key={user._id} className={`flex flex-col justify-between`}>

                                                                    <Button className='h-auto whitespace-normal' variant={"ghost"} onClick={() => handlerUserFiltradoClick(user._id)}>
                                                                        {user.name + " - " + user.email}

                                                                    </Button>

                                                                </div>
                                                            ))
                                            }
                                        </ul>

                                    </div>
                                </div>


                        }


                        <Separator className='my-2' />

                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-right">
                                Miembros seleccionados
                            </span>
                            <div className="col-span-3">
                                {usersSeleccionados.length > 0 && (
                                    <ul className='list-disc list-inside'>
                                        {usersSeleccionados.map((user) => {
                                            return (
                                                <li key={user._id}>
                                                    <Badge className='cursor-pointer h-auto whitespace-normal' variant="default" onClick={() => hanlderBadgeOnClick(user._id)}>
                                                        {user.name + " - " + user.email}
                                                    </Badge>


                                                </li>
                                            )
                                        }
                                        )}
                                    </ul>
                                )}

                            </div>
                        </div>


                    </ScrollArea>

                </div>
                <Separator className='my-2' />
                <DialogFooter className='items-center'>
                    <span >Asegurate de guardar tus cambios</span>
                    <Button type='submit' onClick={handlerGuardarNewTeamMembers}>Guardar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >

    )
}

export default MarcaNewTeamMember