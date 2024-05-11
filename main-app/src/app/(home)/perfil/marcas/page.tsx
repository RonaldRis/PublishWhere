"use client";
import React, { Suspense, use, useContext, useEffect } from 'react';


import dynamic from 'next/dynamic';
import { toast } from 'sonner';

// Importa dinámicamente MarcaSeleccionadaBuscador
const MarcaSeleccionadaBuscador = dynamic(() => import('@/components/marcas/MarcaSeleccionadaBuscador'));
const DetallesMarcaEditable = dynamic(() => import('./DetallesMarcaEditable'));


function PerfilMarcasPage() {

  //Obtener de manera dinamica del URL el marcaId si existe y actualizarlo
   useEffect(() => {
    const marcaId = new URLSearchParams(window.location.search).get('marcaId');
    if (marcaId) {
    }
  }
  ,[]);




  return (
    <div className='flex gap-2 w-full h-[80vh] '>
      {/* Sidebar */}
      <div className='w-[400px] max-w-[400px] min-w-[400px] h-full'>


        <MarcaSeleccionadaBuscador
          hasNewBotton={true}
        />
      </div>


      <DetallesMarcaEditable />



    </div>
  )
}




export default PerfilMarcasPage;
