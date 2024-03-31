"use client";
import React, { Suspense, use, useContext, useEffect } from 'react';


import dynamic from 'next/dynamic';

// Importa dinámicamente MarcaSeleccionadaBuscador
const MarcaSeleccionadaBuscador = dynamic(() => import('@/components/marcas/MarcaSeleccionadaBuscador'));
const DetallesMarcaEditable = dynamic(() => import('./DetallesMarcaEditable'));


function PerfilMarcasPage() {



  return (
    <div className='flex gap-2 w-full h-full '>
      {/* Sidebar */}
      <div className='w-400px h-full'>


        <MarcaSeleccionadaBuscador
          hasNewBotton={true}
        />
      </div>


      <DetallesMarcaEditable />



    </div>
  )
}




export default PerfilMarcasPage;
