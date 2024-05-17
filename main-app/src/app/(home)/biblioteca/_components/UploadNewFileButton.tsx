"use client";

import { Button } from '@/components/ui/button'
import { BibliotecaContext } from '@/contexts/BibliotecaContext';
import { CalendarioContext } from '@/contexts/CalendarioContext';
import React, { useContext, useEffect, useState } from 'react'

function UploadNewFileButton() {

    const { isCalendarPage } = useContext(CalendarioContext);
    const { setIsOpenModalNewFile } = useContext(BibliotecaContext);


    return (
        <div suppressHydrationWarning >
            <Button onClick={() => setIsOpenModalNewFile(true)} className={isCalendarPage ? "hidden" : ""}>
                Sube un archivo
            </Button>
        </div>
    )
}

export default UploadNewFileButton