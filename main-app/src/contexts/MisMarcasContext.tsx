"use client"

import { fetchAllMarcasAction, fetchMisMarcasAction } from '@/lib/actions/marcas.actions';
import { IMarca } from '@/lib/models/marca.model';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect, Context, createContext, ReactNode } from 'react';
import { useLocalStorage } from "usehooks-ts"



interface IGlobalContextProps {
    marcaGlobalSeleccionada: IMarca | null;
    setMarcaGlobalSeleccionada: React.Dispatch<React.SetStateAction<IMarca | null>>;
    marcas: IMarca[];
    setMarcas: React.Dispatch<React.SetStateAction<IMarca[]>>;
    isMarcaLoading: boolean;
    setIsMarcaLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchRefreshMarcas:  () => void; 
    isOpenModalNuevaMarca: boolean;
    setIsOpenModalNuevaMarca: React.Dispatch<React.SetStateAction<boolean>>;

}



// Contexto
const MisMarcasContext = React.createContext<IGlobalContextProps>
    ({
        marcaGlobalSeleccionada: null,
        setMarcaGlobalSeleccionada: () => { },
        marcas: [],
        setMarcas: () => { },
        isMarcaLoading: false,
        setIsMarcaLoading: () => { },
        fetchRefreshMarcas: async () =>{},
        isOpenModalNuevaMarca: false,
        setIsOpenModalNuevaMarca: () => {},
    });



// Proveedor
const MisMarcasProvider = ({ children }: { children: ReactNode }) => {


    const {data: session} = useSession();

    const [marcas, setMarcas] = React.useState<IMarca[]>([]); 
    const [marcaGlobalSeleccionada, setMarcaGlobalSeleccionada] = useLocalStorage<IMarca | null>("marcaGlobalSeleccionada", null);
    const [isMarcaLoading, setIsMarcaLoading] = React.useState<boolean>(false);
    const [isOpenModalNuevaMarca, setIsOpenModalNuevaMarca] = React.useState<boolean>(false);

    const fetchRefreshMarcas = async () => {
        setIsMarcaLoading(true);
        if(!session?.user.id) return setIsMarcaLoading(false);

        const result = await fetchMisMarcasAction(session?.user.id as string); //TODO: Cambiar por el fetch de las marcas del usuario
        const marcasOrdenadas = result.result!.sort((a, b) => a.name.localeCompare(b.name)); 
        setMarcas(marcasOrdenadas);
        setIsMarcaLoading(false);

    };



    useEffect(() => {
        fetchRefreshMarcas();
    }, [session?.user.id]);



    const values = {
        marcaGlobalSeleccionada,
        setMarcaGlobalSeleccionada,
        marcas,
        setMarcas,
        isMarcaLoading,
        setIsMarcaLoading,
    };


    return (
        <MisMarcasContext.Provider value={{

            marcaGlobalSeleccionada: marcaGlobalSeleccionada,
            setMarcaGlobalSeleccionada: setMarcaGlobalSeleccionada,
            marcas: marcas,
            setMarcas: setMarcas,
            isMarcaLoading: isMarcaLoading,
            setIsMarcaLoading: setIsMarcaLoading,
            fetchRefreshMarcas: fetchRefreshMarcas,
            isOpenModalNuevaMarca: isOpenModalNuevaMarca,
            setIsOpenModalNuevaMarca: setIsOpenModalNuevaMarca,
        }}>
            {children}
        </MisMarcasContext.Provider>
    );




};


export { MisMarcasProvider, MisMarcasContext };