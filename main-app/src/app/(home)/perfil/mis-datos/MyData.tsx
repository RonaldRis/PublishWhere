"use client"
import { Button } from "@/components/ui/button";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { IUser } from "@/lib/models/user.model";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useContext } from "react";


const MyData = () => {
    const { data: session, status } = useSession();

    const [user, setUser] = React.useState<IUser | null>(null);
    const {marcas} = useContext(MisMarcasContext);


    React.useEffect(() => {
        if (session) {
            setUser(session.user as IUser);
        }
    }, [session]);


    const handlerLogout = () => {
        signOut();
    };

    return (
        <>
            <div className="text-center">
                {session?.user?.image && (
                    <Image src={session.user.image} alt="Foto de perfil" className="mx-auto mt-5 rounded-full w-32 h-32 object-cover" width={128} height={128} />
                )}
                <div className="mt-5 text-left">
                    <p><strong>Nombre:</strong> {session?.user?.name ?? 'Invitado'}</p>
                    <p><strong>Correo:</strong> {session?.user?.email ?? 'No disponible'}</p>
                    {session && (
                        <>
                            <p><strong>Fecha de registro:</strong> {new Date().getFullYear()}</p>
                            {/* TODO: No afecta la app: CAMBIAR FECHA DE REGISTRO, POSTERIORMENTE */}
                        </>
                    )}
                </div>
                <div className="flex justify-center mt-5">

                    <Button color="blue" className="mr-2" onClick={() => { /* Función para cambiar contraseña */ }}>
                        Editar mis datos 
                        {/* TODO: No prioritario: Editar datos editables:  */}
                    </Button>
                    <button type='button' onClick={handlerLogout} className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'>
                        Cerrar Sesión
                    </button>

                </div>
            </div>
        </>
    );
};

export default MyData;
