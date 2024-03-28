"use client"
import React, { use, useContext, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '../ui/button';
import { IMarca } from '@/lib/models/marca.model';

import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import { ScrollBar, ScrollArea } from '@/components/ui/scroll-area';
import MarcaNueva from './MarcaNueva';
import { MisMarcasContext } from '@/contexts/MisMarcasContext';



interface Props {
    hasNewBotton: boolean;
    marcaSeleccionada: IMarca|null;
    setMarcaSeleccionada: React.Dispatch<React.SetStateAction<IMarca|null>>;
}

function MarcaSeleccionadaBuscador({ hasNewBotton, marcaSeleccionada, setMarcaSeleccionada }: Props) {
    // Aquí puedes usar las props para renderizar tu componente.
    // Este es solo un ejemplo básico, tendrás que adaptarlo a tus necesidades.

    const { data: session } = useSession();
    const { marcas, isMarcaLoading, setIsOpenModalNuevaMarca } = useContext(MisMarcasContext);

    const [marcasFiltro, setMarcasFiltro] = React.useState<IMarca[]>(marcas)


    useEffect(() => {
        setMarcasFiltro(marcas);
    }, [marcas]);

    const onChangeInputHandler = (event: any) => {
        if (!event.target.value || event.target.value === '') return setMarcasFiltro(marcas)
        const nuevasMarcas = marcas.filter(marca => marca.name.includes(event.target.value));
        setMarcasFiltro(nuevasMarcas)
    }



    return (





        // codigo original

        <Card className='w-full h-full'>
            <CardHeader>
                <CardTitle>Marcas</CardTitle>
                <CardDescription>Selecciona una marca</CardDescription>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input type="text" id="marca" placeholder="Marca ..." onChange={onChangeInputHandler} />
                </div>
            </CardHeader>

            <CardContent className='h-2/3 '>
                <ScrollArea className="h-full w-full">

                    {
                        isMarcaLoading ?
                            <p>Cargando...</p>
                            :
                            marcasFiltro?.map((marca, index) => (


                                <div key={marca._id} className={`flex flex-col justify-between ${marca._id == marcaSeleccionada?._id ? "bg-slate-200" : ""}`}>

                                    <Button className='w-full text-left' variant={"ghost"} onClick={() => setMarcaSeleccionada(marca)}>
                                        {marca.name}
                                    </Button>

                                </div>
                            ))
                    }


                </ScrollArea>
            </CardContent>

            <Separator className="my-2" />


            {hasNewBotton &&
                <CardFooter>
                    <Button className='w-full' onClick={() => setIsOpenModalNuevaMarca(true)}>Nueva marca</Button>
                </CardFooter>
            }


        </Card>

    );
}

export default MarcaSeleccionadaBuscador;