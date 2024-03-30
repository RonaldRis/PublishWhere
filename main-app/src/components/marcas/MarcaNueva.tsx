"use client"
import React from 'react'
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
import { postCrearMarca } from '@/lib/actions/marcas.actions';
import { MisMarcasContext } from '@/contexts/MisMarcasContext';
import { revalidatePath } from 'next/cache';

function MarcaNueva({ isOpenModalNuevaMarca, setIsOpenModalNuevaMarca }: { isOpenModalNuevaMarca: boolean, setIsOpenModalNuevaMarca: React.Dispatch<React.SetStateAction<boolean>> }) {


    const { data: session } = useSession();
    const { fetchRefreshMarcas } = React.useContext(MisMarcasContext);


    const [nuevaMarca, setNuevaMarca] = React.useState<string>("");

    const handlerGuardarMarca = async () => {

        //TODO: NOW MANEJAR ERROR DE SI YA EXISTE LA MARCA
        if (nuevaMarca === '') return;
        if (!session) return;
        const result = await postCrearMarca(session.user.id, nuevaMarca);

        console.log(result);
        fetchRefreshMarcas(); //TODO: Now: decidir si refresh all o solo agregar el actual



        //TODO: Guardar en la base de datos
        //TODO: Actualizar el contexto global
        ///TOOD: revalidar la pagina actual
        setIsOpenModalNuevaMarca(false);
        setNuevaMarca("")

        toast.success('Marca creada correctamente');
    }


    return (

        <Dialog open={isOpenModalNuevaMarca} onOpenChange={setIsOpenModalNuevaMarca}
        >
            <DialogTrigger asChild>
                <Button className=' hidden w-full' onClick={() => setIsOpenModalNuevaMarca(!isOpenModalNuevaMarca)}>Nueva marca</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nueva marca</DialogTitle>
                    <DialogDescription>
                        Completa los campos para crear una nueva marca
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right">
                            Marca
                        </span>
                        <Input
                            id="marca"
                            placeholder="Marca"
                            className="col-span-3"
                            value={nuevaMarca}
                            onChange={(e) => setNuevaMarca(e.target.value)}
                        />
                    </div>

                </div>
                <DialogFooter>
                    <Button type='submit' onClick={handlerGuardarMarca}>Guardar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default MarcaNueva